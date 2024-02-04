import { ColecaoRepository } from "../../Infrastructure/repositories/ColecaoRepository";
import { Colecao } from "../../Domain/models/Colecao";
import { Via } from "../../Domain/models/Via";

export class ColecaoService {
    private repository: ColecaoRepository;

    constructor(repository: ColecaoRepository){
        this.repository = repository;
    }

    async getColecaoById(id: number): Promise<Colecao | null> {
        return this.repository.getColecaoById(id);
    }

    async getColecoesByUsuarioId(usuario_id: number): Promise<Colecao[] | null> {
        return this.repository.getColecoesByUsuarioId(usuario_id);
    }

    async getColecoes(): Promise<Colecao[] | null> {
        return this.repository.getColecoes();
    }

    async createColecao(colecao: Colecao): Promise<void> {
        return this.repository.createColecao(colecao);
    }

    async updateColecao(colecao: Colecao): Promise<void> {
        return this.repository.updateColecao(colecao);
    }

    async deleteColecao(id: number): Promise<void> {
        return this.repository.deleteColecao(id);
    }

    async addVia(via_id: number, colecao_id: number): Promise<void> {
        return this.repository.addVia(via_id, colecao_id);
    }

    async removeVia(via_id: number, colecao_id: number): Promise<void> {
        return this.repository.removeVia(via_id, colecao_id);
    }


}