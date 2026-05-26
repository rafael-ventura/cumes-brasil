import { AppDataSource } from '../config/db';
import { Escalada } from '../../Domain/entities/Escalada';
import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';
import { ISearchRepository } from '../../Domain/interfaces/repositories/ISearchRepository';
import { FiltrosBuscaEscalada } from '../../Domain/interfaces/models/FiltrosBusca';
import { ModalidadeEscalada } from '../../Domain/enum/EModalidadeEscalada';
import { Usuario } from '../../Domain/entities/Usuario';

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

    /**
     * Lista escaladas visíveis para quem observa: autor com perfil público ou o próprio autor.
     */
    async getAll(limit: number | undefined, usuarioIdObservador: number): Promise<Escalada[]> {
        const query = this.repository.createQueryBuilder("escalada")
          .leftJoin('escalada.usuario', 'usuario')
            .addSelect(this.USER_INFO)
          .leftJoinAndSelect('escalada.via', 'via')
            .leftJoinAndSelect("escalada.participantes", "participante")
            .andWhere('(usuario.perfil_publico = true OR usuario.id = :uid)', { uid: usuarioIdObservador })
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

    /**
     * Escaladas em que o usuário foi marcado na cordada (username em participantes), em qualquer tipo (GUIA, PARTICIPANTE, MISTO).
     * Exclui registros em que ele próprio é o autor.
     * @param usuarioObservadorId quem está vendo (para regra de visibilidade do autor do registro)
     */
    async getOndeUsuarioFoiMarcado (
        usuarioAlvoId: number,
        usernameAlvo: string,
        usuarioObservadorId: number
    ): Promise<Escalada[]> {
        const uname = usernameAlvo.trim().toLowerCase();
        const query = this.repository.createQueryBuilder("escalada")
            .distinct(true)
            .innerJoin("escalada.participantes", "p_match")
            .leftJoin("escalada.usuario", "usuario")
            .addSelect([...this.USER_INFO, "usuario.username"])
            .leftJoinAndSelect("escalada.via", "via")
            .leftJoinAndSelect("via.viaImagens", "viaImagens")
            .leftJoinAndSelect("viaImagens.imagem", "viaImagensImagem")
            .leftJoinAndSelect("escalada.participantes", "participante")
            .where("escalada.usuarioId != :alvoId", { alvoId: usuarioAlvoId })
            .andWhere("LOWER(TRIM(p_match.username)) = :uname", { uname })
            .andWhere("p_match.username IS NOT NULL")
            .andWhere("TRIM(p_match.username) <> ''");

        const ehProprioPerfil = String(usuarioObservadorId) === String(usuarioAlvoId);
        if (!ehProprioPerfil) {
            query.andWhere("(usuario.perfil_publico = true OR usuario.id = :obs)", { obs: usuarioObservadorId });
        }

        query.orderBy("escalada.data", "DESC");
        return query.getMany();
    }

    /**
     * Contagem pública (ex.: card no GET /u/:username): só registros cujo autor tem perfil público.
     */
    async getCountOndeUsuarioFoiMarcadoPublico (usuarioAlvoId: number, usernameAlvo: string): Promise<number> {
        const uname = usernameAlvo.trim().toLowerCase();
        const raw = await this.repository.createQueryBuilder("escalada")
            .select("COUNT(DISTINCT escalada.id)", "cnt")
            .innerJoin("escalada.participantes", "p_match")
            .leftJoin("escalada.usuario", "usuario")
            .where("escalada.usuarioId != :alvoId", { alvoId: usuarioAlvoId })
            .andWhere("LOWER(TRIM(p_match.username)) = :uname", { uname })
            .andWhere("p_match.username IS NOT NULL")
            .andWhere("TRIM(p_match.username) <> ''")
            .andWhere("usuario.perfil_publico = true")
            .getRawOne();
        return Number(raw?.cnt ?? 0);
    }

    /**
     * Contagem pública (ex.: card no GET /u/:username): escaladas em que o usuário participou
     * (como autor ou incluído na cordada), considerando apenas autor com perfil público quando
     * a escalada não pertence ao próprio usuário.
     */
    async getCountOndeUsuarioParticipaPublico (usuarioAlvoId: number, usernameAlvo: string): Promise<number> {
        const uname = usernameAlvo.trim().toLowerCase();

        const raw = await this.repository.createQueryBuilder("escalada")
            .leftJoin("escalada.participantes", "p_match")
            .leftJoin("escalada.usuario", "usuario")
            .select("COUNT(DISTINCT escalada.id)", "cnt")
            .where(
                `(
                  escalada.usuarioId = :alvoId
                  OR (
                    p_match.username IS NOT NULL
                    AND TRIM(p_match.username) <> ''
                    AND LOWER(TRIM(p_match.username)) = :uname
                  )
                )`,
                { alvoId: usuarioAlvoId, uname }
            )
            .andWhere("(escalada.usuarioId = :alvoId OR usuario.perfil_publico = true)", { alvoId: usuarioAlvoId })
            .getRawOne();

        return Number(raw?.cnt ?? 0);
    }

    /**
     * Contagem do número de escaladas em que o usuário foi marcado,
     * considerando qualquer visibilidade do autor.
     *
     * Obs.: exclui escaladas em que o usuário é o autor.
     */
    async getCountOndeUsuarioFoiMarcado (usuarioAlvoId: number, usernameAlvo: string): Promise<number> {
        const uname = usernameAlvo.trim().toLowerCase();
        const raw = await this.repository.createQueryBuilder("escalada")
            .select("COUNT(DISTINCT escalada.id)", "cnt")
            .innerJoin("escalada.participantes", "p_match")
            .leftJoin("escalada.usuario", "usuario")
            .where("escalada.usuarioId != :alvoId", { alvoId: usuarioAlvoId })
            .andWhere("LOWER(TRIM(p_match.username)) = :uname", { uname })
            .andWhere("p_match.username IS NOT NULL")
            .andWhere("TRIM(p_match.username) <> ''")
            .getRawOne();
        return Number(raw?.cnt ?? 0);
    }

    /**
     * Contagem de marcações em vias do CERJ.
     */
    async getCountOndeUsuarioFoiMarcadoViasCERJ (
        usuarioAlvoId: number,
        usernameAlvo: string,
        somentePublico: boolean
    ): Promise<number> {
        const uname = usernameAlvo.trim().toLowerCase();
        const query = this.repository.createQueryBuilder("escalada")
            .select("COUNT(DISTINCT escalada.id)", "cnt")
            .innerJoin("escalada.participantes", "p_match")
            .leftJoin("escalada.usuario", "usuario")
            .leftJoin("escalada.via", "via")
            .where("escalada.usuarioId != :alvoId", { alvoId: usuarioAlvoId })
            .andWhere("LOWER(TRIM(p_match.username)) = :uname", { uname })
            .andWhere("p_match.username IS NOT NULL")
            .andWhere("TRIM(p_match.username) <> ''")
            .andWhere("via.via_cerj = true");

        if (somentePublico) {
            query.andWhere("usuario.perfil_publico = true");
        }

        const raw = await query.getRawOne();
        return Number(raw?.cnt ?? 0);
    }

    /**
     * Contagem de marcações em vias do CERJ por modalidade (Tradicional / Esportiva).
     */
    async getCountOndeUsuarioFoiMarcadoViasCERJPorModalidade (
        usuarioAlvoId: number,
        usernameAlvo: string,
        modalidade: ModalidadeEscalada,
        somentePublico: boolean
    ): Promise<number> {
        const uname = usernameAlvo.trim().toLowerCase();
        const query = this.repository.createQueryBuilder("escalada")
            .select("COUNT(DISTINCT escalada.id)", "cnt")
            .innerJoin("escalada.participantes", "p_match")
            .leftJoin("escalada.usuario", "usuario")
            .leftJoin("escalada.via", "via")
            .where("escalada.usuarioId != :alvoId", { alvoId: usuarioAlvoId })
            .andWhere("LOWER(TRIM(p_match.username)) = :uname", { uname })
            .andWhere("p_match.username IS NOT NULL")
            .andWhere("TRIM(p_match.username) <> ''")
            .andWhere("via.via_cerj = true")
            .andWhere("via.modalidade = :modalidade", { modalidade });

        if (somentePublico) {
            query.andWhere("usuario.perfil_publico = true");
        }

        const raw = await query.getRawOne();
        return Number(raw?.cnt ?? 0);
    }

    /**
     * Métrica base para conquistas persistidas:
     * quantidade de vias distintas escaladas pelo usuário (como autor).
     */
    async contarViasEscaladasPorUsuario (usuarioId: number): Promise<number> {
        const raw = await this.repository.createQueryBuilder('escalada')
            .leftJoin('escalada.via', 'via')
            .select('COUNT(DISTINCT via.id)', 'cnt')
            .where('escalada.usuarioId = :usuarioId', { usuarioId })
            .getRawOne();
        return Number(raw?.cnt ?? 0);
    }

    /**
     * Quantidade de graus distintos presentes nas vias escaladas pelo usuário (como autor).
     */
    async contarGrausDiferentesPorUsuario (usuarioId: number): Promise<number> {
        const raw = await this.repository.createQueryBuilder('escalada')
            .leftJoin('escalada.via', 'via')
            .select('COUNT(DISTINCT via.grau)', 'cnt')
            .where('escalada.usuarioId = :usuarioId', { usuarioId })
            .andWhere('via.grau IS NOT NULL')
            .andWhere("TRIM(via.grau) <> ''")
            .getRawOne();
        return Number(raw?.cnt ?? 0);
    }

    /**
     * Quantidade de bairros distintos (vias com setor->localizacao->bairro) escalados pelo usuário (como autor).
     */
    async contarBairrosDiferentesPorUsuario (usuarioId: number): Promise<number> {
        const raw = await this.repository.createQueryBuilder('escalada')
            .leftJoin('escalada.via', 'via')
            .leftJoin('via.setor', 'setor')
            .leftJoin('setor.localizacoes', 'localizacoes')
            .leftJoin('localizacoes.bairro', 'bairro')
            .select('COUNT(DISTINCT bairro.id)', 'cnt')
            .where('escalada.usuarioId = :usuarioId', { usuarioId })
            .andWhere('bairro.id IS NOT NULL')
            .getRawOne();
        return Number(raw?.cnt ?? 0);
    }

    /**
     * Soma total de extensão (metros) nas vias escaladas pelo usuário (como autor).
     */
    async somarExtensaoViasPorUsuario (usuarioId: number): Promise<number> {
        const raw = await this.repository.createQueryBuilder('escalada')
            .leftJoin('escalada.via', 'via')
            .select('COALESCE(SUM(COALESCE(via.extensao, 0)), 0)', 'soma')
            .where('escalada.usuarioId = :usuarioId', { usuarioId })
            .getRawOne();

        return Number(raw?.soma ?? 0);
    }

    async getByViaId(viaId: number, limit: number | undefined, usuarioIdObservador: number): Promise<Escalada[]> {
        const query = this.repository.createQueryBuilder("escalada")
          .leftJoin('escalada.usuario', 'usuario')
            .addSelect(this.USER_INFO)
          .leftJoin('escalada.via', 'via')
            .addSelect(["via.id", "via.nome"])
            .leftJoinAndSelect("escalada.participantes", "participante")
            .where("escalada.viaId = :viaId", { viaId })
            .andWhere('(usuario.perfil_publico = true OR usuario.id = :uid)', { uid: usuarioIdObservador })
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
            comoPerfil = 'autor',
            itensPorPagina = 10
        } = filtros;
        let qb = this.repository.createQueryBuilder("escalada")
            .distinct(true)
            .leftJoinAndSelect("escalada.usuario", "usuario")
            .leftJoinAndSelect("escalada.via", "via")
            .leftJoinAndSelect("via.viaImagens", "viaImagens")
            .leftJoinAndSelect("viaImagens.imagem", "viaImagensImagem")
            //acessar tambem os participantes
            .leftJoinAndSelect("escalada.participantes", "participante")
            .orderBy("escalada.data", "DESC");

        const modo = (comoPerfil === 'marcado' || comoPerfil === 'todas' || comoPerfil === 'autor')
            ? comoPerfil
            : 'autor';
        const usuarioIdNum = Number(usuarioId || 0);
        const repoUsuario = AppDataSource.getRepository(Usuario);
        const usuarioAlvo = usuarioIdNum ? await repoUsuario.findOne({ where: { id: usuarioIdNum } }) : null;
        const usernameAlvo = String(usuarioAlvo?.username || '').trim().toLowerCase();

        if (modo === 'marcado' && usernameAlvo) {
            qb = qb.andWhere('escalada.usuario.id != :usuarioId', { usuarioId: usuarioIdNum })
                .andWhere('participante.username IS NOT NULL')
                .andWhere("TRIM(participante.username) <> ''")
                .andWhere("LOWER(TRIM(participante.username)) = :usernameAlvo", { usernameAlvo });
        } else if (modo === 'todas' && usernameAlvo) {
            qb = qb.andWhere(`(
                escalada.usuario.id = :usuarioId
                OR (
                    escalada.usuario.id != :usuarioId
                    AND participante.username IS NOT NULL
                    AND TRIM(participante.username) <> ''
                    AND LOWER(TRIM(participante.username)) = :usernameAlvo
                )
            )`, { usuarioId: usuarioIdNum, usernameAlvo });
        } else {
            qb = qb.andWhere('escalada.usuario.id = :usuarioId', { usuarioId: usuarioIdNum });
        }
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
