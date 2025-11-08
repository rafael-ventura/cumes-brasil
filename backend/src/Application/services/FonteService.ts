import { Fonte } from "../../Domain/entities/Fonte";
import { FonteRepository } from "../../Infrastructure/repositories/FonteRepository";
import BadRequestError from "../errors/BadRequestError";
import NotFoundError from "../errors/NotFoundError";
import BaseService from "./BaseService";

export class FonteService extends BaseService<Fonte, FonteRepository> {

    constructor(fonteRepository: FonteRepository) {
        super(fonteRepository);
    }

	async getFonteById (id: number): Promise<Fonte | null> {
		if (!id) {
            throw new BadRequestError("ID da Fonte não fornecido");
		} else if (isNaN(id)) {
            throw new BadRequestError("ID da Fonte inválido");
		}
        return this.repository.getById(id);

	}

	async getFontes (): Promise<Fonte[]> {
        return this.repository.getAll();
	}

	async createFonte (fonte: Fonte): Promise<void> {
		if (!fonte) {
            throw new BadRequestError("Fonte inválida");
		}
        await this.repository.create(fonte);
	}

	async updateFonte (id: number, fonteData: Partial<Fonte>): Promise<void> {
		if (!id) {
            throw new BadRequestError("ID da Fonte não fornecido");
		} else if (isNaN(id)) {
            throw new BadRequestError("ID da Fonte inválido");
		}
        this.ensureExists(await this.getFonteById(id), "Fonte não encontrada");
        await this.repository.update(id, fonteData);
	}

	async deleteFonte(id: number): Promise<void> {
		if (!id) {
            throw new BadRequestError("ID da Fonte não fornecido");
		} else if (isNaN(id)) {
            throw new BadRequestError("ID da Fonte inválido");
		}
        this.ensureExists(await this.getFonteById(id), "Fonte não encontrada");
        await this.repository.delete(id);
	}
}
