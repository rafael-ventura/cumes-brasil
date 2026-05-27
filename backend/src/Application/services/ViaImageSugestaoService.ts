import { AppDataSource } from '../../Infrastructure/config/db';
import { ViaImageSugestao } from '../../Domain/entities/ViaImageSugestao';
import { ViaImagem } from '../../Domain/entities/ViaImagem';
import { ViaImageSugestaoRepository } from '../../Infrastructure/repositories/ViaImageSugestaoRepository';
import { ImagemRepository } from '../../Infrastructure/repositories/ImagemRepository';
import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import { safeLogger } from '../../Infrastructure/config/logger';

export class ViaImageSugestaoService {
  constructor (
    private sugestaoRepo = new ViaImageSugestaoRepository(),
    private imagemRepo = new ImagemRepository(),
    private viaRepo = new ViaRepository()
  ) {}

  async submeter (viaId: number, imagemId: number, usuarioId: number, creditos?: string): Promise<ViaImageSugestao> {
    const via = await this.viaRepo.getById(viaId);
    if (!via) throw new NotFoundError('Via não encontrada');

    const imagem = await this.imagemRepo.getById(imagemId);
    if (!imagem) throw new NotFoundError('Imagem não encontrada');

    return this.sugestaoRepo.criar({
      via: { id: viaId } as any,
      imagem: { id: imagemId } as any,
      usuario: { id: usuarioId } as any,
      creditos: creditos?.trim() || null,
      status: 'pendente'
    });
  }

  async listarPendentes (): Promise<ViaImageSugestao[]> {
    return this.sugestaoRepo.listarPendentes();
  }

  async listarTodas (): Promise<ViaImageSugestao[]> {
    return this.sugestaoRepo.listarTodas();
  }

  async listarAprovadaPorVia (viaId: number): Promise<ViaImageSugestao[]> {
    return this.sugestaoRepo.listarAprovadaPorVia(viaId);
  }

  async aprovar (id: number, adminId: number): Promise<ViaImageSugestao> {
    const sugestao = await this.sugestaoRepo.buscarPorId(id);
    if (!sugestao) throw new NotFoundError('Sugestão não encontrada');
    if (sugestao.status !== 'pendente') throw new BadRequestError('Sugestão já foi revisada');

    await this.sugestaoRepo.atualizar(id, {
      status: 'aprovada',
      admin_revisor: { id: adminId } as any,
      reviewed_at: new Date()
    });

    // Cria o vínculo definitivo via_imagem
    const viaImagemRepo = AppDataSource.getRepository(ViaImagem);
    const jaExiste = await viaImagemRepo.findOne({
      where: { via: { id: sugestao.via.id }, imagem: { id: sugestao.imagem.id } }
    });
    if (!jaExiste) {
      await viaImagemRepo.save(
        viaImagemRepo.create({ via: sugestao.via, imagem: sugestao.imagem })
      );
    }

    safeLogger.info('Sugestão de imagem aprovada', { sugestaoId: id, adminId, viaId: sugestao.via.id });

    return (await this.sugestaoRepo.buscarPorId(id))!;
  }

  async rejeitar (id: number, adminId: number, motivo: string): Promise<ViaImageSugestao> {
    const sugestao = await this.sugestaoRepo.buscarPorId(id);
    if (!sugestao) throw new NotFoundError('Sugestão não encontrada');
    if (sugestao.status !== 'pendente') throw new BadRequestError('Sugestão já foi revisada');
    if (!motivo?.trim()) throw new BadRequestError('Informe o motivo da rejeição');

    await this.sugestaoRepo.atualizar(id, {
      status: 'rejeitada',
      motivo_rejeicao: motivo.trim(),
      admin_revisor: { id: adminId } as any,
      reviewed_at: new Date()
    });

    safeLogger.info('Sugestão de imagem rejeitada', { sugestaoId: id, adminId, motivo });

    return (await this.sugestaoRepo.buscarPorId(id))!;
  }

  async contarPendentes (): Promise<number> {
    return this.sugestaoRepo.contarPorStatus('pendente');
  }
}
