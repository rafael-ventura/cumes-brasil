import { AppDataSource } from '../config/db';
import { Escalada } from '../../Domain/entities/Escalada';
import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';

export class EscaladaRepository {
    private repository = AppDataSource.getRepository(Escalada);
    USER_INFO = ["usuario.id", "usuario.nome", "usuario.email",
        "usuario.data_atividade", "usuario.clube_organizacao", "localizacao",
        "biografia"];

    async getById(id: number): Promise<Escalada | null> {
        return this.repository.createQueryBuilder("escalada")
            .leftJoinAndSelect("escalada.usuarioId", "usuario")
            .leftJoinAndSelect("escalada.viaId", "via")
            .leftJoinAndSelect("escalada.participantes", "participante")
            .where("escalada.id = :id", { id })
            .getOne();
    }

    async getAll(limit?: number): Promise<Escalada[]> {
        const query = this.repository.createQueryBuilder("escalada")
            .leftJoin("escalada.usuarioId", "usuario")
            .addSelect(this.USER_INFO)
            .leftJoinAndSelect("escalada.viaId", "via")
            .leftJoinAndSelect("escalada.participantes", "participante")
            .orderBy("escalada.data", "DESC");

        if (limit) {
            query.limit(limit);
        }

        return query.getMany();
    }

    async save(escalada: Partial<Escalada>): Promise<void> {
        await this.repository.save(escalada);
    }


    async remove(escalada: Escalada): Promise<void> {
        await this.repository.remove(escalada);
    }

    async getByUserId(userId: number): Promise<Escalada[]> {
        const query = this.repository.createQueryBuilder("escalada")
            .leftJoin("escalada.usuarioId", "usuario")
            .addSelect(this.USER_INFO)
            .leftJoin("escalada.viaId", "via")
            .addSelect(["via.id", "via.nome"])
            .leftJoinAndSelect("escalada.participantes", "participante")
            .where("usuario.id = :userId", { userId })
            .orderBy("escalada.data", "DESC");

        return query.getMany();
    }

    async getByViaId(viaId: number, limit?: number): Promise<Escalada[]> {
        const query = this.repository.createQueryBuilder("escalada")
            .leftJoin("escalada.usuarioId", "usuario")
            .addSelect(this.USER_INFO)
            .leftJoin("escalada.viaId", "via")
            .addSelect(["via.id", "via.nome"])
            .leftJoinAndSelect("escalada.participantes", "participante")
            .where("escalada.viaId = :viaId", { viaId })
            .orderBy("escalada.data", "DESC");

        if (limit) {
            query.limit(limit);
        }
        return query.getMany();
    }

    async getByViaIdAndByUser(userId: number, viaId: number, limit?: number): Promise<Escalada[]> {
        const query = this.repository.createQueryBuilder("escalada")
            .leftJoin("escalada.usuarioId", "usuario")
            .addSelect(this.USER_INFO)
            .leftJoin("escalada.viaId", "via")
            .addSelect(["via.id", "via.nome"])
            .leftJoinAndSelect("escalada.participantes", "participante")
            .where("usuario.id = :userId AND escalada.viaId = :viaId", { userId, viaId })
            .orderBy("escalada.data", "DESC");

        if (limit) {
            query.limit(limit);
        }

        return query.getMany();
    }

    async search(filters: any): Promise<ISearchResult<Escalada>> {
        const {
            unifiedSearch,
            page = 1,
            itemsPerPage = 10,
            sortField = 'escalada.data',
            sortOrder
        } = filters;

        let qb = this.repository.createQueryBuilder("escalada")
            .leftJoinAndSelect("escalada.usuario", "usuario")
            .leftJoinAndSelect("escalada.via", "via")
            .leftJoinAndSelect("via.imagem", "imagem") // Acessar a imagem através da via
            //acessar tambem os participantes
            .leftJoinAndSelect("escalada.participantes", "participante")
            .orderBy("escalada.data", "DESC");

        // Filtrar por nome da via (se necessário)
        if (unifiedSearch) {
            qb = qb.andWhere("via.nome LIKE :unifiedSearch", { unifiedSearch: `%${unifiedSearch}%` });
        }

        // Adiciona ordenação dinâmica
        if (sortField && sortOrder) {
            qb = qb.orderBy(`escalada.${sortField}`, sortOrder.toUpperCase());
        }

        // Total de escaladas que correspondem aos filtros
        const totalItems = await qb.getCount();

        // Escaladas paginadas
        const items = await qb
            .skip((page - 1) * itemsPerPage)
            .take(itemsPerPage)
            .getMany();

        const totalPages = Math.ceil(totalItems / itemsPerPage);

        return {
            items,
            totalPages,
            totalItems
        };
    }
}
