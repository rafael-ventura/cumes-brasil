import { AppDataSource } from '../config/db';
import { Colecao } from '../../Domain/entities/Colecao';
import { Service } from 'typedi';
import { ISearchRepository } from '../../Domain/interfaces/repositories/ISearchRepository';
import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';
import { FiltrosBuscaColecao } from '../../Domain/interfaces/models/FiltrosBusca';
import { Via } from '../../Domain/entities/Via';
import { ViaColecao } from '../../Domain/entities/ViaColecao';
import BaseRepository from './BaseRepository';
import { ICrudRepository } from '../../Domain/interfaces/repositories/ICrudRepository';

@Service()
export class ColecaoRepository extends BaseRepository<Colecao> implements ISearchRepository<Colecao>, ICrudRepository<Colecao> {
    constructor() {
        super(Colecao);
    }

    async contarColecoesPorUsuarioId(usuarioId: number): Promise<number> {
        const raw = await this.repository
            .createQueryBuilder("colecao")
            .select("COUNT(colecao.id)", "cnt")
            .leftJoin("colecao.usuario", "usuario")
            .where("usuario.id = :usuarioId", { usuarioId })
            .getRawOne();
        return Number(raw?.cnt ?? 0);
    }

    async contarViasFavoritasPorUsuarioId(usuarioId: number): Promise<number> {
        const raw = await this.repository
            .createQueryBuilder("colecao")
            .select("COUNT(viaColecao.id)", "cnt")
            .leftJoin("colecao.viaColecoes", "viaColecao")
            .leftJoin("colecao.usuario", "usuario")
            .where("usuario.id = :usuarioId AND colecao.nome = :nome", { usuarioId, nome: "Favoritas" })
            .getRawOne();
        return Number(raw?.cnt ?? 0);
    }

    async getById(id: number, relations?: string[]): Promise<Colecao | null> {
        return this.repository.createQueryBuilder("colecao")
          .leftJoinAndSelect('colecao.usuario', 'usuario')
          .leftJoinAndSelect('colecao.imagem', 'imagem')
          .leftJoinAndSelect('colecao.viaColecoes', 'viaColecao')
          .leftJoinAndSelect('viaColecao.via', 'vias')
          .leftJoinAndSelect('vias.viaImagens', 'viaImagensCapa')
          .leftJoinAndSelect('viaImagensCapa.imagem', 'viaImagemCapa')
          .leftJoinAndSelect('vias.montanha', 'montanha')
          .leftJoinAndSelect('vias.face', 'face')
          .leftJoinAndSelect('vias.setor', 'setor')
          // Localização através de Setor
          .leftJoinAndSelect('setor.localizacoes', 'setorLocalizacoes')
          .leftJoinAndSelect('setorLocalizacoes.continente', 'setorContinente')
          .leftJoinAndSelect('setorLocalizacoes.pais', 'setorPais')
          .leftJoinAndSelect('setorLocalizacoes.regiao', 'setorRegiao')
          .leftJoinAndSelect('setorLocalizacoes.estado', 'setorEstado')
          .leftJoinAndSelect('setorLocalizacoes.cidade', 'setorCidade')
          .leftJoinAndSelect('setorLocalizacoes.bairro', 'setorBairro')
          .leftJoinAndSelect('setor.face', 'setorFace')
          .leftJoinAndSelect('setor.montanha', 'setorMontanha')
          // Localização através de Face
          .leftJoinAndSelect('face.localizacoes', 'faceLocalizacoes')
          .leftJoinAndSelect('faceLocalizacoes.continente', 'faceContinente')
          .leftJoinAndSelect('faceLocalizacoes.pais', 'facePais')
          .leftJoinAndSelect('faceLocalizacoes.regiao', 'faceRegiao')
          .leftJoinAndSelect('faceLocalizacoes.estado', 'faceEstado')
          .leftJoinAndSelect('faceLocalizacoes.cidade', 'faceCidade')
          .leftJoinAndSelect('faceLocalizacoes.bairro', 'faceBairro')
          .leftJoinAndSelect('face.montanha', 'faceMontanha')
          // Localização através de Montanha
          .leftJoinAndSelect('montanha.localizacoes', 'montanhaLocalizacoes')
          .leftJoinAndSelect('montanhaLocalizacoes.continente', 'montanhaContinente')
          .leftJoinAndSelect('montanhaLocalizacoes.pais', 'montanhaPais')
          .leftJoinAndSelect('montanhaLocalizacoes.regiao', 'montanhaRegiao')
          .leftJoinAndSelect('montanhaLocalizacoes.estado', 'montanhaEstado')
          .leftJoinAndSelect('montanhaLocalizacoes.cidade', 'montanhaCidade')
          .leftJoinAndSelect('montanhaLocalizacoes.bairro', 'montanhaBairro')
          .where('colecao.id = :id', { id })
          .getOne();
    }

    async getAll(): Promise<Colecao[]> {
        return this.repository.createQueryBuilder("colecao")
          .leftJoinAndSelect('colecao.usuario', 'usuario')
          .leftJoinAndSelect('colecao.imagem', 'imagem')
          .leftJoinAndSelect('colecao.viaColecoes', 'viaColecao')
          .leftJoinAndSelect('viaColecao.via', 'vias')
          .leftJoinAndSelect('vias.viaImagens', 'viaImagensCapa')
          .leftJoinAndSelect('viaImagensCapa.imagem', 'viaImagemCapa')
          .leftJoinAndSelect('vias.montanha', 'montanha')
          .leftJoinAndSelect('vias.face', 'face')
          .leftJoinAndSelect('vias.setor', 'setor')
          // Localização através de Setor
          .leftJoinAndSelect('setor.localizacoes', 'setorLocalizacoes')
          .leftJoinAndSelect('setorLocalizacoes.continente', 'setorContinente')
          .leftJoinAndSelect('setorLocalizacoes.pais', 'setorPais')
          .leftJoinAndSelect('setorLocalizacoes.regiao', 'setorRegiao')
          .leftJoinAndSelect('setorLocalizacoes.estado', 'setorEstado')
          .leftJoinAndSelect('setorLocalizacoes.cidade', 'setorCidade')
          .leftJoinAndSelect('setorLocalizacoes.bairro', 'setorBairro')
          .leftJoinAndSelect('setor.face', 'setorFace')
          .leftJoinAndSelect('setor.montanha', 'setorMontanha')
          // Localização através de Face
          .leftJoinAndSelect('face.localizacoes', 'faceLocalizacoes')
          .leftJoinAndSelect('faceLocalizacoes.continente', 'faceContinente')
          .leftJoinAndSelect('faceLocalizacoes.pais', 'facePais')
          .leftJoinAndSelect('faceLocalizacoes.regiao', 'faceRegiao')
          .leftJoinAndSelect('faceLocalizacoes.estado', 'faceEstado')
          .leftJoinAndSelect('faceLocalizacoes.cidade', 'faceCidade')
          .leftJoinAndSelect('faceLocalizacoes.bairro', 'faceBairro')
          .leftJoinAndSelect('face.montanha', 'faceMontanha')
          // Localização através de Montanha
          .leftJoinAndSelect('montanha.localizacoes', 'montanhaLocalizacoes')
          .leftJoinAndSelect('montanhaLocalizacoes.continente', 'montanhaContinente')
          .leftJoinAndSelect('montanhaLocalizacoes.pais', 'montanhaPais')
          .leftJoinAndSelect('montanhaLocalizacoes.regiao', 'montanhaRegiao')
          .leftJoinAndSelect('montanhaLocalizacoes.estado', 'montanhaEstado')
          .leftJoinAndSelect('montanhaLocalizacoes.cidade', 'montanhaCidade')
          .leftJoinAndSelect('montanhaLocalizacoes.bairro', 'montanhaBairro')
          .orderBy('colecao.created_at', 'ASC')
          .addOrderBy('colecao.id', 'ASC')
          .getMany();
    }

    async getByUsuarioId(usuario_id: number): Promise<Colecao[]> {
        return this.repository.createQueryBuilder("colecao")
          .leftJoinAndSelect('colecao.usuario', 'usuario')
          .leftJoinAndSelect('colecao.imagem', 'imagem')
          .leftJoinAndSelect('colecao.viaColecoes', 'viaColecao')
          .leftJoinAndSelect('viaColecao.via', 'vias')
          .leftJoinAndSelect('vias.viaImagens', 'viaImagensCapa')
          .leftJoinAndSelect('viaImagensCapa.imagem', 'viaImagemCapa')
          .leftJoinAndSelect('vias.montanha', 'montanha')
          .leftJoinAndSelect('vias.face', 'face')
          .leftJoinAndSelect('vias.setor', 'setor')
          // Localização através de Setor
          .leftJoinAndSelect('setor.localizacoes', 'setorLocalizacoes')
          .leftJoinAndSelect('setorLocalizacoes.continente', 'setorContinente')
          .leftJoinAndSelect('setorLocalizacoes.pais', 'setorPais')
          .leftJoinAndSelect('setorLocalizacoes.regiao', 'setorRegiao')
          .leftJoinAndSelect('setorLocalizacoes.estado', 'setorEstado')
          .leftJoinAndSelect('setorLocalizacoes.cidade', 'setorCidade')
          .leftJoinAndSelect('setorLocalizacoes.bairro', 'setorBairro')
          .leftJoinAndSelect('setor.face', 'setorFace')
          .leftJoinAndSelect('setor.montanha', 'setorMontanha')
          // Localização através de Face
          .leftJoinAndSelect('face.localizacoes', 'faceLocalizacoes')
          .leftJoinAndSelect('faceLocalizacoes.continente', 'faceContinente')
          .leftJoinAndSelect('faceLocalizacoes.pais', 'facePais')
          .leftJoinAndSelect('faceLocalizacoes.regiao', 'faceRegiao')
          .leftJoinAndSelect('faceLocalizacoes.estado', 'faceEstado')
          .leftJoinAndSelect('faceLocalizacoes.cidade', 'faceCidade')
          .leftJoinAndSelect('faceLocalizacoes.bairro', 'faceBairro')
          .leftJoinAndSelect('face.montanha', 'faceMontanha')
          // Localização através de Montanha
          .leftJoinAndSelect('montanha.localizacoes', 'montanhaLocalizacoes')
          .leftJoinAndSelect('montanhaLocalizacoes.continente', 'montanhaContinente')
          .leftJoinAndSelect('montanhaLocalizacoes.pais', 'montanhaPais')
          .leftJoinAndSelect('montanhaLocalizacoes.regiao', 'montanhaRegiao')
          .leftJoinAndSelect('montanhaLocalizacoes.estado', 'montanhaEstado')
          .leftJoinAndSelect('montanhaLocalizacoes.cidade', 'montanhaCidade')
          .leftJoinAndSelect('montanhaLocalizacoes.bairro', 'montanhaBairro')
          .where('usuario.id = :usuario_id', { usuario_id })
          .orderBy('colecao.created_at', 'ASC')
          .addOrderBy('colecao.id', 'ASC')
          .getMany();
    }


    async create(colecaoData: Partial<Colecao>): Promise<Colecao> {
        return await this.repository.save(colecaoData);
    }

    async update(id: number, colecaoData: Partial<Colecao>): Promise<void> {
        await this.repository.update(id, colecaoData);
    }

    async addViaToColecao(via_id: number, colecao_id: number): Promise<void> {
        // Verificar se a coleção existe
        const colecao = await this.repository.findOne({ where: { id: colecao_id } });
        if (!colecao) {
            throw new Error('Coleção não encontrada');
        }

        // Verificar se a via existe
        const via = await AppDataSource.getRepository(Via).findOne({ where: { id: via_id } });
        if (!via) {
            throw new Error('Via não encontrada');
        }

        // Criar uma nova instância de ViaColecao
        const viaColecao = new ViaColecao();
        viaColecao.colecao = colecao;
        viaColecao.via = via;

        // Salvar a relação usando o repositório de ViaColecao
        const viaColecaoRepository = AppDataSource.getRepository(ViaColecao);
        await viaColecaoRepository.save(viaColecao);
    }

    async atualizarImagem (id: number, imagem: import('../../Domain/entities/Imagem').Imagem): Promise<void> {
        const ent = await this.repository.findOne({ where: { id } as any });
        if (!ent) return;
        (ent as any).imagem = imagem;
        await this.repository.save(ent);
    }

    async excluirImagem (id: number): Promise<void> {
        const ent = await this.repository.findOne({ where: { id } as any });
        if (!ent) return;
        (ent as any).imagem = null;
        await this.repository.save(ent);
    }

    async delete (id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async removeViaFromColecao(via_id: number, colecao_id: number): Promise<void> {
        const viaColecaoRepository = AppDataSource.getRepository(ViaColecao);
        await viaColecaoRepository.delete({
            via: { id: via_id },
            colecao: { id: colecao_id }
        });
    }

    async getColecoesNotContainingViaForUser (
      viaId: number,
      usuarioId: number,
      page: number,
      limit: number
    ): Promise<{ colecoes: Colecao[]; total: number }> {
        const subQuery = AppDataSource.getRepository(ViaColecao)
          .createQueryBuilder('via_colecao')
          .select('via_colecao.colecaoId')
          .where('via_colecao.viaId = :viaId', { viaId });

        const [colecoes, total] = await this.repository
          .createQueryBuilder('colecao')
          .leftJoinAndSelect('colecao.imagem', 'imagem')
          .leftJoinAndSelect('colecao.viaColecoes', 'viaColecoes')
          .leftJoinAndSelect('viaColecoes.via', 'vias')
          .leftJoinAndSelect('vias.viaImagens', 'viaImagensCapa')
          .leftJoinAndSelect('viaImagensCapa.imagem', 'viaImagemCapa')
          .where('colecao.usuario.id = :usuarioId', { usuarioId })
          .andWhere(`colecao.id NOT IN (${subQuery.getQuery()})`)
          .setParameters(subQuery.getParameters())
          .skip((page - 1) * limit)
          .take(limit)
          .getManyAndCount();

        return {
            colecoes,
            total
        };
    }

    async search(filtros: FiltrosBuscaColecao): Promise<ISearchResult<Colecao>> {
        const {
            termoBusca,
            colecaoId,
            usuarioId,
            nomeVia,
            campoOrdenacao,
            direcaoOrdenacao,
            pagina = 1,
            itensPorPagina = 10
        } = filtros;

        const direcao = (direcaoOrdenacao?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC') as 'ASC' | 'DESC';

        // 1) IDs paginados: query enxuta só para descobrir quais coleções entram nesta página.
        //    Evita o problema de paginação com OneToMany e o sort-em-memória.
        const idsQb = this.repository.createQueryBuilder('colecao')
          .select('colecao.id', 'id')
          .andWhere('colecao.usuario.id = :usuarioId', { usuarioId });

        if (colecaoId) {
            idsQb.andWhere('colecao.id = :colecaoId', { colecaoId });
        }
        if (termoBusca) {
            idsQb.andWhere('colecao.nome ILIKE :termoBusca', { termoBusca: `%${termoBusca}%` });
        }
        if (nomeVia) {
            idsQb
              .innerJoin('colecao.viaColecoes', 'viaColecaoFiltro')
              .innerJoin('viaColecaoFiltro.via', 'viaFiltro')
              .andWhere('viaFiltro.nome ILIKE :nomeVia', { nomeVia: `%${nomeVia}%` })
              .groupBy('colecao.id');
        }

        // Ordenação:
        //  - updated_at: max(via_colecao.created_at) via subquery correlacionada, em SQL
        //  - demais: orderBy direto na própria coleção
        if (campoOrdenacao === 'updated_at') {
            idsQb.addSelect(
              '(SELECT MAX(vc.created_at) FROM via_colecao vc WHERE vc."colecaoId" = colecao.id)',
              'colecao_updated_at'
            );
            idsQb.orderBy('colecao_updated_at', direcao, direcao === 'DESC' ? 'NULLS LAST' : 'NULLS FIRST');
        } else if (campoOrdenacao) {
            idsQb.orderBy(`colecao.${campoOrdenacao}`, direcao);
        }

        const totalItems = await idsQb.getCount();
        const idsRaw = await idsQb
          .offset((pagina - 1) * itensPorPagina)
          .limit(itensPorPagina)
          .getRawMany<{ id: number }>();
        const idsPagina = idsRaw.map(r => r.id);

        if (idsPagina.length === 0) {
            return { items: [], totalPages: Math.ceil(totalItems / itensPorPagina), totalItems };
        }

        // 2) Hidrata as coleções da página com todas as relações pesadas.
        const itemsQb = this.repository.createQueryBuilder('colecao')
          .leftJoinAndSelect('colecao.viaColecoes', 'viaColecao')
          .leftJoinAndSelect('viaColecao.via', 'via')
          .leftJoinAndSelect('via.viaImagens', 'viaImagensSearch')
          .leftJoinAndSelect('viaImagensSearch.imagem', 'viaImagemSearch')
          .leftJoinAndSelect('via.montanha', 'montanha')
          .leftJoinAndSelect('via.face', 'face')
          .leftJoinAndSelect('via.setor', 'setor')
          .leftJoinAndSelect('setor.localizacoes', 'setorLocalizacoes')
          .leftJoinAndSelect('setorLocalizacoes.continente', 'setorContinente')
          .leftJoinAndSelect('setorLocalizacoes.pais', 'setorPais')
          .leftJoinAndSelect('setorLocalizacoes.regiao', 'setorRegiao')
          .leftJoinAndSelect('setorLocalizacoes.estado', 'setorEstado')
          .leftJoinAndSelect('setorLocalizacoes.cidade', 'setorCidade')
          .leftJoinAndSelect('setorLocalizacoes.bairro', 'setorBairro')
          .leftJoinAndSelect('setor.face', 'setorFace')
          .leftJoinAndSelect('setor.montanha', 'setorMontanha')
          .leftJoinAndSelect('face.localizacoes', 'faceLocalizacoes')
          .leftJoinAndSelect('faceLocalizacoes.continente', 'faceContinente')
          .leftJoinAndSelect('faceLocalizacoes.pais', 'facePais')
          .leftJoinAndSelect('faceLocalizacoes.regiao', 'faceRegiao')
          .leftJoinAndSelect('faceLocalizacoes.estado', 'faceEstado')
          .leftJoinAndSelect('faceLocalizacoes.cidade', 'faceCidade')
          .leftJoinAndSelect('faceLocalizacoes.bairro', 'faceBairro')
          .leftJoinAndSelect('face.montanha', 'faceMontanha')
          .leftJoinAndSelect('montanha.localizacoes', 'montanhaLocalizacoes')
          .leftJoinAndSelect('montanhaLocalizacoes.continente', 'montanhaContinente')
          .leftJoinAndSelect('montanhaLocalizacoes.pais', 'montanhaPais')
          .leftJoinAndSelect('montanhaLocalizacoes.regiao', 'montanhaRegiao')
          .leftJoinAndSelect('montanhaLocalizacoes.estado', 'montanhaEstado')
          .leftJoinAndSelect('montanhaLocalizacoes.cidade', 'montanhaCidade')
          .leftJoinAndSelect('montanhaLocalizacoes.bairro', 'montanhaBairro')
          .leftJoinAndSelect('colecao.imagem', 'imagem')
          .leftJoinAndSelect('colecao.usuario', 'usuario')
          .whereInIds(idsPagina);

        // Reaplica a ordenação para que a página venha na ordem certa.
        if (campoOrdenacao === 'updated_at') {
            itemsQb.addSelect(
              '(SELECT MAX(vc.created_at) FROM via_colecao vc WHERE vc."colecaoId" = colecao.id)',
              'colecao_updated_at'
            );
            itemsQb.orderBy('colecao_updated_at', direcao, direcao === 'DESC' ? 'NULLS LAST' : 'NULLS FIRST');
        } else if (campoOrdenacao) {
            itemsQb.orderBy(`colecao.${campoOrdenacao}`, direcao);
        }

        const items = await itemsQb.getMany();

        return {
            items,
            totalPages: Math.ceil(totalItems / itensPorPagina),
            totalItems
        };
    }

}
