import { Fonte } from "../../Domain/entities/Fonte";
import { FonteRepository } from "../../Infrastructure/repositories/FonteRepository";

export class FonteService {
	private fonteRepository: FonteRepository;

	constructor(fonteRepository: FonteRepository) {
		this.fonteRepository = fonteRepository;
	}

	async getFonteById (id: number): Promise<Fonte | null> {
		if (!id) {
			throw new Error("ID da Fonte não fornecido");
		} else if (isNaN(id)) {
			throw new Error("ID da Fonte inválido");
		}
		return this.fonteRepository.getById(id);

	}

	async getFontes (): Promise<Fonte[]> {
		return this.fonteRepository.getAll();
	}

	async createFonte (fonte: Fonte): Promise<void> {
		if (!fonte) {
			throw new Error("Fonte inválida");
		}
		return this.fonteRepository.create(fonte);
	}

	async updateFonte (id: number, fonteData: Partial<Fonte>): Promise<void> {
		if (!id) {
			throw new Error("ID da Fonte não fornecido");
		} else if (isNaN(id)) {
			throw new Error("ID da Fonte inválido");
		}
		const existingFonte = await this.getFonteById(id);
		if (!existingFonte) {
			throw new Error("Fonte não encontrada");
		}
		await this.fonteRepository.update(id, fonteData);
	}

	async deleteFonte(id: number): Promise<void> {
		if (!id) {
			throw new Error("ID da Fonte não fornecido");
		} else if (isNaN(id)) {
			throw new Error("ID da Fonte inválido");
		}
		const existingFonte = await this.getFonteById(id);
		if (!existingFonte) {
			throw new Error("Fonte não encontrada");
		}
		await this.fonteRepository.delete(id);
	}
}
