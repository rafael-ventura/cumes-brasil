import {ColecaoRepository} from "../../Infrastructure/repositories/ColecaoRepository";
import {Colecao} from "../../Domain/models/Colecao";
import {Via} from "../../Domain/models/Via";

export class ColecaoService {
    private repository: ColecaoRepository;
    private viaRepository: any;

    constructor(repository: ColecaoRepository, viaRepository: any) {
        this.repository = repository;
        this.viaRepository = viaRepository;
    }

    async getColecaoById(id: number): Promise<Colecao | null> {

        const colecao = await this.repository.getColecaoById(id);

        if (!colecao) {
            throw new Error("Coleção não encontrada");
        }

        const vias_ids = await this.getViasIdsByColecaoId(id);
        if (!vias_ids) {
            throw new Error("Nenhuma via encontrada");
        }

        const viasPromises = vias_ids.map(async (id: number) => {
            return await this.viaRepository.getViaById(id);
        });

        const vias = await Promise.all(viasPromises);
        colecao.vias = vias.filter((via) => via !== null) as Via[];

        return colecao;

    }

    // TODO: Se nao estamos usando, precisamos ter?
    async getViasIdsByColecaoId(id: number): Promise<number[] | null> {
        return this.repository.getViasIdsByColecaoId(id);
    }

    async getColecoesByUsuarioId(usuario_id: number): Promise<Colecao[] | null> {
        if (!usuario_id) {
            throw new Error("Usuário não informado");
        } else if (isNaN(usuario_id)) {
            throw new Error("Usuário inválido");
        }

        const colecoes = await this.repository.getColecoesByUsuarioId(usuario_id);
        if (!colecoes) {
            throw new Error("Nenhuma coleção encontrada");
        }
        return colecoes;
    }

    async getColecoes(): Promise<Colecao[] | null> {
        const colecoes = await this.repository.getColecoes();
        if (!colecoes) {
            throw new Error("Nenhuma coleção encontrada");
        }

        for (let i = 0; i < colecoes.length; i++) {
            const vias_ids = await this.getViasIdsByColecaoId(colecoes[i].id);
            if (!vias_ids) {
                throw new Error("Nenhuma via encontrada");
            }
            const viasPromises = vias_ids.map(async (id: number) => {
                return await this.viaRepository.getViaById(id);
            });

            const vias = await Promise.all(viasPromises);
            colecoes[i].vias = vias.filter((via) => via !== null) as Via[];
        }

        return colecoes;
    }

    async createColecao(colecao: Colecao): Promise<void> {
        return this.repository.createColecao(colecao);
    }

    async updateColecao(colecao: Colecao): Promise<void> {
        if (!await this.getColecaoById(colecao.id)) {
            throw new Error("Coleção não encontrada");
        }
        return this.repository.updateColecao(colecao);
    }

    async deleteColecao(id: number): Promise<void> {
        if (!await this.getColecaoById(id)) {
            throw new Error("Coleção não encontrada");
        }
        return this.repository.deleteColecao(id);
    }

    async addVia(via_id: number, colecao_id: number): Promise<void> {
        const colecao = await this.getColecaoById(colecao_id);
        if (!colecao) {
            throw new Error("Coleção não encontrada");
        }
        const via = await this.viaRepository.getViaById(via_id);
        if (!via) {
            throw new Error("Via não encontrada");
        }
        return this.repository.addVia(via_id, colecao_id);

    }

    async removeVia(via_id: number, colecao_id: number): Promise<void> {
        const colecao = await this.getColecaoById(colecao_id);
        if (!colecao) {
            throw new Error("Coleção não encontrada");
        }
        const via = await this.viaRepository.getViaById(via_id);
        if (!via) {
            throw new Error("Via não encontrada");
        }
        return this.repository.removeVia(via_id, colecao_id);
    }


}