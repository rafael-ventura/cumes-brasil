import { Escalada } from "../../Domain/models/Escalada";
import { EscaladaRepository } from "../../Infrastructure/repositories/EscaladaRepository";

export class EscaladaService {
    private repository: EscaladaRepository;

    constructor(repository: EscaladaRepository) {
        this.repository = repository;
    }

    async getEscaladaById(id: number): Promise<Escalada | null> {
        return this.repository.getEscaladaById(id);
    }

    async getEscaladas(): Promise<Escalada[] | null> {
        return this.repository.getEscaladas();
    }

    async createEscalada(escalada: Escalada): Promise<void> {
        return this.repository.createEscalada(escalada);
    }

    async updateEscalada(escalada: Escalada): Promise<void> {
        return this.repository.updateEscalada(escalada);
    }

    async deleteEscalada(id: number): Promise<void> {
        return this.repository.deleteEscalada(id);
    }

    async getEscaladasDoUsuario(usuario_id: number): Promise<Escalada[] | null> {
        return this.repository.getEscaladasDoUsuario(usuario_id);
    }
}