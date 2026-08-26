import { SelectQueryBuilder } from 'typeorm';
import { Via } from '../../Domain/entities/Via';
import { AppDataSource } from '../config/db';
import { ISearchRepository } from '../../Domain/interfaces/repositories/ISearchRepository';
import { ISearchResult } from '../../Domain/interfaces/models/ISearchResult';
import { FiltrosBuscaVia } from '../../Domain/interfaces/models/FiltrosBusca';
import { ViaColecao } from '../../Domain/entities/ViaColecao';
import BaseRepository from './BaseRepository';
import { ICrudRepository } from '../../Domain/interfaces/repositories/ICrudRepository';

const CONDICAO_BAIRRO =
    "(LOWER(setorBairro.nome) = :nomeBairro " +
    "OR LOWER(setorFaceBairro.nome) = :nomeBairro " +
    "OR LOWER(setorMontanhaBairro.nome) = :nomeBairro " +
    "OR LOWER(faceBairro.nome) = :nomeBairro " +
    "OR LOWER(montanhaBairro.nome) = :nomeBairro)";

const CONDICAO_MONTANHA =
    "(montanha.id = :montanhaId " +
    "OR faceMontanha.id = :montanhaId " +
    "OR setorMontanha.id = :montanhaId " +
    "OR setorFaceMontanha.id = :montanhaId)";

const CONDICAO_TERMO_BUSCA =
    "(via.nome ILIKE :termo " +
    "OR montanha.nome ILIKE :termo " +
    "OR faceMontanha.nome ILIKE :termo " +
    "OR setorMontanha.nome ILIKE :termo " +
    "OR setorFaceMontanha.nome ILIKE :termo " +
    "OR setorBairro.nome ILIKE :termo " +
    "OR setorFaceBairro.nome ILIKE :termo " +
    "OR setorMontanhaBairro.nome ILIKE :termo " +
    "OR faceBairro.nome ILIKE :termo " +
    "OR montanhaBairro.nome ILIKE :termo)";

function condicaoLocalizacaoPorId(entidade: string): string {
    return `(setor${entidade}.id = :${entidade.toLowerCase()}Id ` +
        `OR setorFace${entidade}.id = :${entidade.toLowerCase()}Id ` +
        `OR setorMontanha${entidade}.id = :${entidade.toLowerCase()}Id ` +
        `OR face${entidade}.id = :${entidade.toLowerCase()}Id ` +
        `OR montanha${entidade}.id = :${entidade.toLowerCase()}Id)`;
}

export class ViaRepository extends BaseRepository<Via> implements ISearchRepository<Via>, ICrudRepository<Via> {
    constructor() {
        super(Via);
    }

    // ─── Helpers de joins ───────────────────────────────────────────────

    /**
     * Joins de localização via todas as hierarquias possíveis:
     * Via → Setor/Face/Montanha, cada um com suas localizações.
     */
    private joinsLocalizacao(qb: SelectQueryBuilder<Via>): SelectQueryBuilder<Via> {
        return qb
            .leftJoinAndSelect("via.montanha", "montanha")
            .leftJoinAndSelect("via.face", "face")
            .leftJoinAndSelect("via.setor", "setor")
            // Setor → localizações
            .leftJoinAndSelect("setor.localizacoes", "setorLocalizacoes")
            .leftJoinAndSelect("setorLocalizacoes.continente", "setorContinente")
            .leftJoinAndSelect("setorLocalizacoes.pais", "setorPais")
            .leftJoinAndSelect("setorLocalizacoes.regiao", "setorRegiao")
            .leftJoinAndSelect("setorLocalizacoes.estado", "setorEstado")
            .leftJoinAndSelect("setorLocalizacoes.cidade", "setorCidade")
            .leftJoinAndSelect("setorLocalizacoes.bairro", "setorBairro")
            .leftJoinAndSelect("setor.face", "setorFace")
            // Face do Setor → localizações
            .leftJoinAndSelect("setorFace.localizacoes", "setorFaceLocalizacoes")
            .leftJoinAndSelect("setorFaceLocalizacoes.continente", "setorFaceContinente")
            .leftJoinAndSelect("setorFaceLocalizacoes.pais", "setorFacePais")
            .leftJoinAndSelect("setorFaceLocalizacoes.regiao", "setorFaceRegiao")
            .leftJoinAndSelect("setorFaceLocalizacoes.estado", "setorFaceEstado")
            .leftJoinAndSelect("setorFaceLocalizacoes.cidade", "setorFaceCidade")
            .leftJoinAndSelect("setorFaceLocalizacoes.bairro", "setorFaceBairro")
            .leftJoinAndSelect("setorFace.montanha", "setorFaceMontanha")
            .leftJoinAndSelect("setor.montanha", "setorMontanha")
            // Montanha do Setor → localizações
            .leftJoinAndSelect("setorMontanha.localizacoes", "setorMontanhaLocalizacoes")
            .leftJoinAndSelect("setorMontanhaLocalizacoes.continente", "setorMontanhaContinente")
            .leftJoinAndSelect("setorMontanhaLocalizacoes.pais", "setorMontanhaPais")
            .leftJoinAndSelect("setorMontanhaLocalizacoes.regiao", "setorMontanhaRegiao")
            .leftJoinAndSelect("setorMontanhaLocalizacoes.estado", "setorMontanhaEstado")
            .leftJoinAndSelect("setorMontanhaLocalizacoes.cidade", "setorMontanhaCidade")
            .leftJoinAndSelect("setorMontanhaLocalizacoes.bairro", "setorMontanhaBairro")
            // Face → localizações
            .leftJoinAndSelect("face.localizacoes", "faceLocalizacoes")
            .leftJoinAndSelect("faceLocalizacoes.continente", "faceContinente")
            .leftJoinAndSelect("faceLocalizacoes.pais", "facePais")
            .leftJoinAndSelect("faceLocalizacoes.regiao", "faceRegiao")
            .leftJoinAndSelect("faceLocalizacoes.estado", "faceEstado")
            .leftJoinAndSelect("faceLocalizacoes.cidade", "faceCidade")
            .leftJoinAndSelect("faceLocalizacoes.bairro", "faceBairro")
            .leftJoinAndSelect("face.montanha", "faceMontanha")
            // Montanha → localizações
            .leftJoinAndSelect("montanha.localizacoes", "montanhaLocalizacoes")
            .leftJoinAndSelect("montanhaLocalizacoes.continente", "montanhaContinente")
            .leftJoinAndSelect("montanhaLocalizacoes.pais", "montanhaPais")
            .leftJoinAndSelect("montanhaLocalizacoes.regiao", "montanhaRegiao")
            .leftJoinAndSelect("montanhaLocalizacoes.estado", "montanhaEstado")
            .leftJoinAndSelect("montanhaLocalizacoes.cidade", "montanhaCidade")
            .leftJoinAndSelect("montanhaLocalizacoes.bairro", "montanhaBairro");
    }

    /**
     * Todas as relações da Via: localização completa + viaPrincipal, fonte, imagens, croquis.
     * Usado para leitura individual e busca paginada (ViaDTO precisa de tudo).
     */
    private todasRelacoes(qb: SelectQueryBuilder<Via>): SelectQueryBuilder<Via> {
        return this.joinsLocalizacao(qb)
            .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
            .leftJoinAndSelect("via.fonte", "fonte")
            .leftJoinAndSelect("via.viaImagens", "viaImagens")
            .leftJoinAndSelect("viaImagens.imagem", "viaImagensImagem")
            .leftJoinAndSelect("via.viaCroquis", "viaCroquis")
            .leftJoinAndSelect("viaCroquis.croqui", "croqui");
    }

    /**
     * Joins de bairro leves (sem select) para contagem.
     */
    private joinsBairroParaContagem(qb: SelectQueryBuilder<Via>): SelectQueryBuilder<Via> {
        return qb
            .leftJoin("via.setor", "setor")
            .leftJoin("setor.localizacoes", "setorLocalizacoes")
            .leftJoin("setorLocalizacoes.bairro", "setorBairro")
            .leftJoin("setor.face", "setorFace")
            .leftJoin("setorFace.localizacoes", "setorFaceLocalizacoes")
            .leftJoin("setorFaceLocalizacoes.bairro", "setorFaceBairro")
            .leftJoin("setor.montanha", "setorMontanha")
            .leftJoin("setorMontanha.localizacoes", "setorMontanhaLocalizacoes")
            .leftJoin("setorMontanhaLocalizacoes.bairro", "setorMontanhaBairro")
            .leftJoin("via.face", "face")
            .leftJoin("face.localizacoes", "faceLocalizacoes")
            .leftJoin("faceLocalizacoes.bairro", "faceBairro")
            .leftJoin("via.montanha", "montanha")
            .leftJoin("montanha.localizacoes", "montanhaLocalizacoes")
            .leftJoin("montanhaLocalizacoes.bairro", "montanhaBairro");
    }

    // ─── CRUD ───────────────────────────────────────────────────────────

    async getById(id: number, _relacoes?: string[]): Promise<Via | null> {
        return this.todasRelacoes(
            this.repository.createQueryBuilder("via").where("via.id = :id", { id })
        ).getOne();
    }

    async getAllPaginated(pagina: number, limite: number): Promise<{ items: Via[]; total: number; totalPages: number }> {
        const [vias, total] = await this.todasRelacoes(
            this.repository.createQueryBuilder("via")
        )
            .skip((pagina - 1) * limite)
            .take(limite)
            .getManyAndCount();

        return { items: vias, total, totalPages: Math.ceil(total / limite) };
    }

    async aleatoria(): Promise<Via | null> {
        return this.todasRelacoes(
            this.repository.createQueryBuilder("via").orderBy("RANDOM()")
        ).getOne();
    }

    async create(via: Partial<Via>): Promise<Via> {
        const resultado = await this.repository.insert(via);
        const id = resultado.identifiers[0].id;
        return this.getById(id) as Promise<Via>;
    }

    async atualizar(id: number, dados: Partial<Via>): Promise<Via | null> {
        await this.repository.update(id, dados);
        return this.getById(id);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    // ─── Coleção ────────────────────────────────────────────────────────

    async listarPorColecao(colecaoId: number, pagina: number, limite: number): Promise<{
        items: Via[];
        total: number;
        totalPages: number;
    }> {
        const subQuery = AppDataSource.getRepository(ViaColecao)
            .createQueryBuilder("via_colecao")
            .select("via_colecao.viaId")
            .where("via_colecao.colecaoId = :colecaoId", { colecaoId });

        const [vias, total] = await this.todasRelacoes(
            this.repository.createQueryBuilder("via")
                .where(`via.id IN (${subQuery.getQuery()})`)
                .setParameters(subQuery.getParameters())
        )
            .skip((pagina - 1) * limite)
            .take(limite)
            .getManyAndCount();

        return { items: vias, total, totalPages: Math.ceil(total / limite) };
    }

    async listarForaDeColecao(colecaoId: number, usuarioId: number, pagina: number, limite: number): Promise<{
        items: Via[];
        total: number;
        totalPages: number;
    }> {
        const subQuery = AppDataSource.getRepository(ViaColecao)
            .createQueryBuilder("via_colecao")
            .select("via_colecao.viaId")
            .innerJoin("via_colecao.colecao", "colecao")
            .where("via_colecao.colecaoId = :colecaoId", { colecaoId })
            .andWhere("colecao.usuarioId = :usuarioId", { usuarioId });

        const [vias, total] = await this.todasRelacoes(
            this.repository.createQueryBuilder("via")
                .where(`via.id NOT IN (${subQuery.getQuery()})`)
                .setParameters(subQuery.getParameters())
        )
            .skip((pagina - 1) * limite)
            .take(limite)
            .getManyAndCount();

        return { items: vias, total, totalPages: Math.ceil(total / limite) };
    }

    // ─── Busca ──────────────────────────────────────────────────────────

    /**
     * Constrói query com todas as relações e filtros aplicados.
     * Reutilizado por search() e potencialmente por métodos de contagem.
     */
    private construirQueryBusca(filtros: FiltrosBuscaVia): SelectQueryBuilder<Via> {
        const {
            termoBusca,
            montanhaId,
            grau,
            crux,
            faixaExtensao,
            exposicao,
            duracao,
            artificial,
            colecaoId,
            nomeBairro,
            tipoRocha,
            tipoEscalada,
            modalidade,
            viaCerj,
            comCroqui,
            semGrau,
            semLocalizacao,
            paisId,
            estadoId,
            cidadeId,
            bairroId,
        } = filtros;

        let qb = this.todasRelacoes(
            this.repository.createQueryBuilder("via")
        );

        // ── Filtro de coleção (innerJoin para restringir) ──
        if (colecaoId) {
            qb = qb
                .innerJoin("via.viaColecoes", "viaColecaoFiltro",
                    "viaColecaoFiltro.colecaoId = :colecaoId", { colecaoId })
                .addSelect("viaColecaoFiltro.data_adicao", "data_adicao");
        }

        // ── Filtros de localização por ID ──
        if (paisId)    qb = qb.andWhere(condicaoLocalizacaoPorId("Pais"), { paisId });
        if (estadoId)  qb = qb.andWhere(condicaoLocalizacaoPorId("Estado"), { estadoId });
        if (cidadeId)  qb = qb.andWhere(condicaoLocalizacaoPorId("Cidade"), { cidadeId });
        if (bairroId)  qb = qb.andWhere(condicaoLocalizacaoPorId("Bairro"), { bairroId });

        // ── Busca textual (ILIKE = case-insensitive no PostgreSQL) ──
        if (termoBusca) {
            qb = qb.andWhere(CONDICAO_TERMO_BUSCA, { termo: `%${termoBusca}%` });
        }

        if (nomeBairro) {
            qb = qb.andWhere(CONDICAO_BAIRRO, { nomeBairro: nomeBairro.toLowerCase() });
        }

        if (montanhaId) {
            qb = qb.andWhere(CONDICAO_MONTANHA, { montanhaId });
        }

        // ── Filtros de via ──
        if (grau)           qb = qb.andWhere("via.grau = :grau", { grau });
        if (crux)           qb = qb.andWhere("via.crux = :crux", { crux });
        if (modalidade)     qb = qb.andWhere("via.modalidade = :modalidade", { modalidade });
        if (viaCerj)        qb = qb.andWhere("via.via_cerj = :viaCerj", { viaCerj: true });
        if (comCroqui)      qb = qb.andWhere("viaCroquis.id IS NOT NULL");
        if (semGrau)        qb = qb.andWhere("via.grau IS NULL");

        if (faixaExtensao) {
            qb = qb.andWhere("via.extensao >= :extensaoMin AND via.extensao <= :extensaoMax", {
                extensaoMin: faixaExtensao[0],
                extensaoMax: faixaExtensao[1],
            });
        }

        if (exposicao) {
            qb = qb.andWhere("LOWER(via.exposicao) = :exposicao", {
                exposicao: exposicao.toLowerCase(),
            });
        }

        if (duracao) {
            qb = qb.andWhere("LOWER(via.duracao) = :duracaoNorm", {
                duracaoNorm: duracao.toLowerCase(),
            });
        }

        if (artificial) {
            qb = qb.andWhere("via.artificial ILIKE :artificial", { artificial: `${artificial}%` });
        }

        if (tipoRocha) {
            qb = qb.andWhere("via.tipo_rocha ILIKE :tipoRocha", { tipoRocha: `%${tipoRocha}%` });
        }

        if (tipoEscalada) {
            qb = qb.andWhere("via.tipo_escalada ILIKE :tipoEscalada", { tipoEscalada: `%${tipoEscalada}%` });
        }

        if (semLocalizacao) {
            qb = qb
                .andWhere("via.montanhaId IS NULL")
                .andWhere("via.faceId IS NULL")
                .andWhere("via.setorId IS NULL");
        }

        return qb;
    }

    async search(filtros: FiltrosBuscaVia): Promise<ISearchResult<any>> {
        const {
            pagina = 1,
            itensPorPagina = 10,
            campoOrdenacao,
            direcaoOrdenacao,
            colecaoId,
        } = filtros;

        let qb = this.construirQueryBusca(filtros);

        if (campoOrdenacao && direcaoOrdenacao) {
            qb = qb.orderBy(`via.${campoOrdenacao}`, direcaoOrdenacao.toUpperCase() as 'ASC' | 'DESC');
        } else {
            qb = qb.orderBy("via.nome", "ASC");
        }

        qb = qb.skip((pagina - 1) * itensPorPagina).take(itensPorPagina);

        // Quando há colecaoId precisamos do select extra data_adicao (raw + entities).
        // Sem colecaoId, getManyAndCount() é uma round-trip a menos.
        if (colecaoId) {
            const total = await qb.getCount();
            const { entities, raw } = await qb.getRawAndEntities();
            const itens = entities.map((entidade, idx) => ({
                ...entidade,
                data_adicao: raw[idx]?.data_adicao || null
            }));
            return {
                items: itens,
                totalPages: Math.ceil(total / itensPorPagina),
                totalItems: total
            };
        }

        const [itens, total] = await qb.getManyAndCount();
        return {
            items: itens,
            totalPages: Math.ceil(total / itensPorPagina),
            totalItems: total
        };
    }

    // ─── Contagens ──────────────────────────────────────────────────────

    async contarPorCampo(campo: string, valor: any, operador: string = "="): Promise<number> {
        const qb = this.repository.createQueryBuilder("via");

        if (campo === "via.exposicao" || campo === "via.duracao") {
            qb.where(`${campo} ILIKE :valor`, { valor: `%${valor}%` });
        } else if (operador === "IS NULL") {
            qb.where(`${campo} IS NULL`);
        } else if (operador === "IS NOT NULL") {
            qb.where(`${campo} IS NOT NULL`);
        } else {
            qb.where(`${campo} ${operador} :valor`, { valor });
        }

        return qb.getCount();
    }

    async contarSemLocalizacao(): Promise<number> {
        return this.repository.createQueryBuilder("via")
            .where("via.montanhaId IS NULL")
            .andWhere("via.faceId IS NULL")
            .andWhere("via.setorId IS NULL")
            .getCount();
    }

    async contarPorBairro(bairro: string): Promise<number> {
        return this.joinsBairroParaContagem(
            this.repository.createQueryBuilder("via")
        )
            .where(CONDICAO_BAIRRO, { nomeBairro: bairro.toLowerCase() })
            .getCount();
    }

    async contarComCroqui(): Promise<number> {
        return this.repository
            .createQueryBuilder("via")
            .innerJoin("via.viaCroquis", "viaCroquis")
            .getCount();
    }
}
