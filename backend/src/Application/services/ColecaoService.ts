import { ColecaoRepository } from '../../Infrastructure/repositories/ColecaoRepository';
import { Colecao } from '../../Domain/entities/Colecao';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import UnauthorizedError from '../errors/UnauthorizedError';
import BaseService from './BaseService';
import { ImagemService } from './ImagemService';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';
import { Imagem } from '../../Domain/entities/Imagem';
import { AppDataSource } from '../../Infrastructure/config/db';
import S3Helper from '../../Infrastructure/helpers/S3Helper';
import path from 'path';

export class ColecaoService extends BaseService<Colecao, ColecaoRepository> {
  private imagemService: ImagemService;
  private imagemRepository: ImagemRepository;
  private s3Service: S3Helper = new S3Helper();

  constructor(
    colecaoRepo: ColecaoRepository,
    imagemService: ImagemService,
    imagemRepository: ImagemRepository
  ) {
    super(colecaoRepo);
    this.imagemService = imagemService;
    this.imagemRepository = imagemRepository;
  }

  private assertDono(colecao: Colecao, usuarioId: number): void {
    const donoId = colecao.usuario?.id ?? (colecao as any).usuarioId;
    if (donoId == null || String(donoId) !== String(usuarioId)) {
      throw new UnauthorizedError('Sem permissão para alterar esta coleção.');
    }
  }

  async getColecaoById(id: number): Promise<Colecao | null> {
    return this.repository.getById(id);
  }

  async getAllColecoes(): Promise<Colecao[]> {
    return this.repository.getAll();
  }

  async getColecoesByUsuarioId(usuarioId: number): Promise<Colecao[]> {
    return this.repository.getByUsuarioId(usuarioId);
  }

  async createColecao(colecaoData: Partial<Colecao>): Promise<void> {
    await this.repository.create(colecaoData);
  }

  async updateColecao(id: number, colecaoData: Partial<Colecao>): Promise<void> {
    const colecao = await this.repository.getById(id);
    if (!colecao) {
      throw new NotFoundError('Coleção não encontrada');
    }
    await this.repository.update(id, colecaoData);
  }

  async deleteColecao(id: number): Promise<void> {
    const colecao = await this.repository.getById(id);
    if (!colecao) {
      throw new NotFoundError('Coleção não encontrada');
    }
    const nome = (colecao.nome || '').trim();
    if (
      nome === 'Favoritas' ||
      nome === 'Vias Favoritas' ||
      nome.includes('Favoritas')
    ) {
      throw new BadRequestError('A coleção de favoritos não pode ser excluída.');
    }
    await this.repository.delete(id);
  }

  async addViaToColecao(viaId: number, colecaoId: number): Promise<void> {
    await this.repository.addViaToColecao(viaId, colecaoId);
  }

  async removeViaFromColecao(viaId: number, colecaoId: number): Promise<void> {
    await this.repository.removeViaFromColecao(viaId, colecaoId);
  }

  async removerViasEmLote(usuarioId: number, colecaoId: number, viaIds: number[]): Promise<void> {
    if (!viaIds?.length) {
      throw new BadRequestError('Nenhuma via informada.');
    }
    const colecao = await this.repository.getById(colecaoId);
    if (!colecao) {
      throw new NotFoundError('Coleção não encontrada');
    }
    this.assertDono(colecao, usuarioId);
    for (const vid of viaIds) {
      await this.repository.removeViaFromColecao(vid, colecaoId);
    }
  }

  async atualizarCapaColecao(
    usuarioId: number,
    colecaoId: number,
    file?: Express.Multer.File
  ): Promise<Colecao | null> {
    if (!file) {
      throw new BadRequestError('Nenhuma imagem foi enviada.');
    }
    const colecao = await this.repository.getById(colecaoId);
    if (!colecao) {
      throw new NotFoundError('Coleção não encontrada');
    }
    this.assertDono(colecao, usuarioId);

    const imagemAntiga: Imagem | undefined = colecao.imagem;
    if (imagemAntiga && imagemAntiga.id && process.env.CLOUDFRONT_URL) {
      const fileName = imagemAntiga.url.split('/').pop();
      if (fileName) {
        await this.s3Service.deleteFileS3(fileName);
      }
      await this.imagemService.delete(imagemAntiga.id);
    } else if (imagemAntiga && imagemAntiga.id) {
      await this.imagemService.delete(imagemAntiga.id);
    }

    let imageUrl: string;
    if (process.env.CLOUDFRONT_URL) {
      const fileName = `colecoes/capa-colecao-${colecaoId}-${Date.now()}${path.extname(file.originalname)}`;
      imageUrl = await this.s3Service.uploadFileS3(fileName, file.buffer, file.mimetype);
    } else {
      imageUrl = `/assets/colecoes/${(file as Express.Multer.File & { filename?: string }).filename}`;
    }

    const novaImagem = await this.imagemRepository.createNew({
      url: imageUrl,
      tipo_entidade: 'colecao',
      descricao: `Capa da coleção ${colecao.nome} (${colecao.id})`
    });

    const repo = AppDataSource.getRepository(Colecao);
    const ent = await repo.findOne({ where: { id: colecaoId } });
    if (!ent) throw new NotFoundError('Coleção não encontrada');
    ent.imagem = novaImagem;
    await repo.save(ent);

    return this.repository.getById(colecaoId);
  }

  async excluirCapaColecao(usuarioId: number, colecaoId: number): Promise<Colecao | null> {
    const colecao = await this.repository.getById(colecaoId);
    if (!colecao) {
      throw new NotFoundError('Coleção não encontrada');
    }
    this.assertDono(colecao, usuarioId);

    const imagemAntiga = colecao.imagem;
    if (imagemAntiga?.id) {
      if (process.env.CLOUDFRONT_URL) {
        const fileName = imagemAntiga.url.split('/').pop();
        if (fileName) {
          await this.s3Service.deleteFileS3(fileName);
        }
      }
      await this.imagemService.delete(imagemAntiga.id);
    }

    const repo = AppDataSource.getRepository(Colecao);
    const ent = await repo.findOne({ where: { id: colecaoId } });
    if (!ent) throw new NotFoundError('Coleção não encontrada');
    ent.imagem = undefined as any;
    await repo.save(ent);

    return this.repository.getById(colecaoId);
  }

  async getColecoesNotContainingViaForUser(
    viaId: number,
    usuarioId: number,
    page: number,
    limit: number
  ): Promise<{ colecoes: Colecao[]; total: number }> {
    if (!usuarioId || !viaId) {
      throw new BadRequestError('Parâmetros inválidos: usuário ou via ausente.');
    }

    return await this.repository.getColecoesNotContainingViaForUser(
      viaId,
      usuarioId,
      page,
      limit
    );
  }
}
