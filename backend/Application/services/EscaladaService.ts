import { Escalada } from "../../Domain/models/Escalada";
import { EscaladaRepository } from "../../Infrastructure/repositories/EscaladaRepository";
import { UsuarioService } from "./UsuarioService";
import { ViaService } from "./ViaService";

export class EscaladaService {
	private repository: EscaladaRepository;
	private usuarioService: UsuarioService;
	private viaService: ViaService;

	constructor(
		repository: EscaladaRepository,
		usuarioService: UsuarioService,
		viaService: ViaService
	) {
		this.repository = repository;
		this.usuarioService = usuarioService;
		this.viaService = viaService;
	}

	async getEscaladaById(id: number): Promise<Escalada | null> {
		if (!id) {
			throw new Error("ID da fonte não fornecido");
		} else if (isNaN(id)) {
			throw new Error("ID da fonte inválido");
		}
		const response = await this.repository.getEscaladaById(id);
		if (!response) {
			throw new Error("Escalada não encontrada");
		}
		return response;

	}

	async getEscaladas(): Promise<Escalada[] | null> {
		const response = await this.repository.getEscaladas();
		if (!response) {
			throw new Error("Nenhuma escalada encontrada");
		}
		return response;
	}

	async createEscalada(escalada: Escalada): Promise<void> {
		const viaExiste = await this.viaService.getViaById(escalada.via_id);
		if (!viaExiste) {
			throw new Error(
				"É necessário informar uma via válida para criar uma escalada"
			);
		}
		const usuarioExiste = await this.usuarioService.getUsuarioById(
			escalada.usuario_id
		);
		if (!usuarioExiste) {
			throw new Error(
				"É necessário informar um usuário válido para criar uma escalada"
			);
		}
		const response = await this.repository.createEscalada(escalada);
		if (response === null) {
			throw new Error("Erro ao criar Escalada");
		}
		return response;
	}

	async updateEscalada(escalada: Escalada): Promise<void> {
		const escaladaExiste = await this.repository.getEscaladaById(escalada.id);
		if (!escaladaExiste) {
			throw new Error("Escalada não encontrada");
		}
		const viaExiste = await this.viaService.getViaById(escalada.via_id);
		if (!viaExiste) {
			throw new Error(
				"É necessário informar uma via válida para criar uma escalada"
			);
		}
		const usuarioExiste = await this.usuarioService.getUsuarioById(
			escalada.usuario_id
		);
		if (!usuarioExiste) {
			throw new Error(
				"É necessário informar um usuário válido para criar uma escalada"
			);
		}
		const response = await this.repository.updateEscalada(escalada);
		if (response === null) {
			throw new Error("Erro ao atualizar Escalada");
		}
		return response;

	}

	async deleteEscalada(id: number): Promise<void> {
		const escaladaExiste = await this.repository.getEscaladaById(id);
		if (!escaladaExiste) {
			throw new Error("Escalada não encontrada");
		}
		const response = await this.repository.deleteEscalada(id);
		if (response === null) {
			throw new Error("Erro ao deletar Escalada");
		}
		return response;
	}

	async getEscaladasDoUsuario(usuario_id: number): Promise<Escalada[] | null> {
		if (!usuario_id) {
			throw new Error("ID do usuário não fornecido");
		} else if (isNaN(usuario_id)) {
			throw new Error("ID do usuário inválido");
		}
		const escaladas = await this.repository.getEscaladasDoUsuario(usuario_id);
		if (!escaladas) {
			throw new Error("Nenhuma escalada encontrada para este usuário");
		}
		return escaladas;
	}
}
