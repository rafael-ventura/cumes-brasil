import { AppDataSource } from '../config/db';
import { Escalada } from '../../Domain/entities/Escalada';
import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';
import { ISearchRepository } from '../../Domain/interfaces/repositories/ISearchRepository';
import { FiltrosBuscaEscalada } from '../../Domain/interfaces/models/FiltrosBusca';

export class EscaladaRepository implements ISearchRepository<Escalada> {
    private repository = AppDataSource.getRepository(Escalada);
    USER_INFO = ["usuario.id", "usuario.nome", "usuario.email",
        "usuario.data_atividade", "usuario.clube_organizacao", "localizacao",
        "biografia"];
    USER_INFO_PUBLICO = ["usuario.id", "usuario.nome", "usuario.username"];

    async getById(id: number): Promise<Escalada | null> {
        return this.repository.createQueryBuilder("escalada")
            .leftJoin('escalada.usuario', 'usuario')
            .addSelect(['usuario.id', 'usuario.nome', 'usuario.username', 'usuario.perfil_publico'])
            .leftJoinAndSelect('usuario.foto_perfil', 'usuarioFotoPerfil')
            .leftJoinAndSelect('escalada.via', 'via')
            .leftJoinAndSelect('via.viaImagens', 'viaImagens')
            .leftJoinAndSelect('viaImagens.imagem', 'viaImagensImagem')
            .leftJoinAndSelect('escalada.participantes', 'participante')
            .where("escalada.id = :id", { id })
            .getOne();
    }

    async getAll(limit?: number): Promise<Escalada[]> {
        const query = this.repository.createQueryBuilder("escalada")
          .leftJoin('escalada.usuario', 'usuario')
            .addSelect(this.USER_INFO)
          .leftJoinAndSelect('escalada.via', 'via')
            .leftJoinAndSelect("escalada.participantes", "participante")
            .orderBy("escalada.data", "DESC");

        if (limit) {
            query.limit(limit);
        }

        return query.getMany();
    }

    async save(escalada: Partial<Escalada> | Escalada): Promise<Escalada> {
        // Usa save() ao invés de insert() para salvar relacionamentos (participantes) com cascade
        return await this.repository.save(escalada);
    }


    async remove(escalada: Escalada): Promise<void> {
        await this.repository.remove(escalada);
    }

    async getByUsuarioId (usuarioId: number): Promise<Escalada[]> {
        const query = this.repository.createQueryBuilder("escalada")
          .leftJoin('escalada.usuario', 'usuario')
            .addSelect(this.USER_INFO)
          .leftJoin('escalada.via', 'via')
            .addSelect(["via.id", "via.nome"])
            .leftJoinAndSelect("escalada.participantes", "participante")
          .where('usuario.id = :usuarioId', { usuarioId: usuarioId })
            .orderBy("escalada.data", "DESC");

        return query.getMany();
    }

    async getByViaId(viaId: number, limit?: number): Promise<Escalada[]> {
        const query = this.repository.createQueryBuilder("escalada")
          .leftJoin('escalada.usuario', 'usuario')
            .addSelect(this.USER_INFO)
          .leftJoin('escalada.via', 'via')
            .addSelect(["via.id", "via.nome"])
            .leftJoinAndSelect("escalada.participantes", "participante")
            .where("escalada.viaId = :viaId", { viaId })
            .orderBy("escalada.data", "DESC");

        if (limit) {
            query.limit(limit);
        }
        return query.getMany();
    }

    async getByViaIdAndByUser (usuarioId: number, viaId: number, limit?: number): Promise<Escalada[]> {
        const query = this.repository.createQueryBuilder("escalada")
          .leftJoin('escalada.usuario', 'usuario')
            .addSelect(this.USER_INFO)
          .leftJoin('escalada.via', 'via')
            .addSelect(["via.id", "via.nome"])
            .leftJoinAndSelect("escalada.participantes", "participante")
          .where('usuario.id = :usuarioId AND escalada.viaId = :viaId', {
              usuarioId: usuarioId,
              viaId
          })
            .orderBy("escalada.data", "DESC");

        if (limit) {
            query.limit(limit);
        }

        return query.getMany();
    }

    async search(filtros: FiltrosBuscaEscalada): Promise<ISearchResult<Escalada>> {
        const {
            termoBusca,
            pagina = 1,
            usuarioId,
            itensPorPagina = 10
        } = filtros;
        let qb = this.repository.createQueryBuilder("escalada")
            .leftJoinAndSelect("escalada.usuario", "usuario")
            .leftJoinAndSelect("escalada.via", "via")
            .leftJoinAndSelect("via.viaImagens", "viaImagens")
            .leftJoinAndSelect("viaImagens.imagem", "viaImagensImagem")
            //acessar tambem os participantes
            .leftJoinAndSelect("escalada.participantes", "participante")
            .orderBy("escalada.data", "DESC");

        // Filtro default pelo ID do usuário logado

        qb = qb.andWhere('escalada.usuario.id = :usuarioId', { usuarioId });
        // Filtrar por nome da via (se necessário)
        if (termoBusca) {
            qb = qb.andWhere("via.nome LIKE :termo", { termo: `%${termoBusca}%` });
        }

        // Não temos suporte a ordenação por campo em Escalada
        /*if (sortField && sortOrder) {
            qb = qb.orderBy(`escalada.${sortField}`, sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
        }*/

        // Total de escaladas que correspondem aos filtros
        const totalItems = await qb.getCount();

        const items = await qb
            .skip((pagina - 1) * itensPorPagina)
            .take(itensPorPagina)
            .getMany();

        const totalPages = Math.ceil(totalItems / itensPorPagina);

        return {
            items,
            totalPages,
            totalItems
        };
    }

    async getFeed(pagina: number, itensPorPagina: number): Promise<{ items: Escalada[]; totalPages: number; totalItems: number }> {
        const qb = this.repository.createQueryBuilder("escalada")
            .leftJoin('escalada.usuario', 'usuario')
            .addSelect(this.USER_INFO_PUBLICO)
            .leftJoinAndSelect('usuario.foto_perfil', 'usuarioFotoPerfil')
            .leftJoinAndSelect('escalada.via', 'via')
            .leftJoinAndSelect('via.viaImagens', 'viaImagens')
            .leftJoinAndSelect('viaImagens.imagem', 'viaImagensImagem')
            .leftJoinAndSelect('escalada.participantes', 'participante')
            .andWhere('usuario.perfil_publico = :publico', { publico: true })
            .orderBy('escalada.created_at', 'DESC');

        const totalItems = await qb.getCount();

        const items = await qb
            .skip((pagina - 1) * itensPorPagina)
            .take(itensPorPagina)
            .getMany();

        const totalPages = Math.ceil(totalItems / itensPorPagina);

        return { items, totalPages, totalItems };
    }
}
