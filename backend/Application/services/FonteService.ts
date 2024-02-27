import { FonteRepository } from "../../Infrastructure/repositories/FonteRepository";
import { Fonte } from "../../Domain/models/Fonte";

export class FonteService {
	private fonteRepository: FonteRepository;

	constructor(fonteRepository: FonteRepository) {
		this.fonteRepository = fonteRepository;
	}

	async getFonteById(id: number): Promise<Fonte | null> {
		if (!id) {
			throw new Error("ID da fonte não fornecido");
		} else if (isNaN(id)) {
			throw new Error("ID da fonte inválido");
		}
		const response = await this.fonteRepository.getFonteById(id);
		if (!response) {
			throw new Error("Fonte não encontrada");
		}
		return response;
	}

	async getFontes(): Promise<Fonte[] | null> {
		const fontes = await this.fonteRepository.getFontes();
		if (!fontes) {
			throw new Error("Nenhuma fonte encontrada");
		}
		return fontes;
	}

	async createFonte(fonte: Fonte): Promise<void> {
		// Adicione suas regras de validação aqui antes de criar a fonte
		return this.fonteRepository.createFonte(fonte);
	}

	async updateFonte(fonte: Fonte): Promise<void> {
		if (!fonte.id) {
			throw new Error("ID da fonte não fornecido");
		}
		const existingFonte = await this.getFonteById(fonte.id);
		if (!existingFonte) {
			throw new Error("Fonte não encontrada");
		}
		// Adicione suas regras de validação aqui antes de atualizar a fonte
		return this.fonteRepository.updateFonte(fonte);
	}

	async deleteFonte(id: number): Promise<void> {
		if (!id) {
			throw new Error("ID da fonte não fornecido");
		} else if (isNaN(id)) {
			throw new Error("ID da fonte inválido");
		}
		const existingFonte = await this.getFonteById(id);
		if (!existingFonte) {
			throw new Error("Fonte não encontrada");
		}
		const result = await this.fonteRepository.deleteFonte(id);
		if (result === null) {
			throw new Error("Erro ao deletar Fonte");
		}
		return result;
	}
}
