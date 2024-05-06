import { Escalada } from "../../Domain/entities/Escalada";
import { EscaladaRepository } from "../../Infrastructure/repositories/EscaladaRepository";
import { UsuarioService } from "./UsuarioService";
import { ViaService } from "./ViaService";
import { ObjectLiteral } from "typeorm";

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

	async getEscaladaById (id: number): Promise<Escalada | null> {
		if (!id) {
			throw new Error("ID da fonte não fornecido");
		} else if (isNaN(id)) {
			throw new Error("ID da fonte inválido");
		}
		return this.repository.getById(id);

	}

	async getEscaladas (): Promise<Escalada[]> {
		return this.repository.getAll();
	}

	async createEscalada (escalada: Escalada): Promise<void> {
		return this.repository.create(escalada);
	}

	async updateEscalada(escalada: Escalada): Promise<void> {
		const escaladaExiste = await this.repository.getById(escalada.id);
		if (!escaladaExiste) {
			throw new Error("Escalada não encontrada");
		}
		return this.repository.update(escalada.id, escalada);
	}

	async deleteEscalada(id: number): Promise<void> {
		const escaladaExiste = await this.repository.getById(id);
		if (!escaladaExiste) {
			throw new Error("Escalada não encontrada");
		}
		return this.repository.delete(id);
	}

	async getEscaladasDoUsuario (usuario_id: number): Promise<ObjectLiteral[]> {
		if (!usuario_id) {
			throw new Error("ID do usuário não fornecido");
		} else if (isNaN(usuario_id)) {
			throw new Error("ID do usuário inválido");
		}
		return this.repository.getEscaladasByUserId(usuario_id);
	}

	async getEscaladasDaVia (via_id: number): Promise<ObjectLiteral[]> {
		if (!via_id) {
			throw new Error("ID da via não fornecido");
		} else if (isNaN(via_id)) {
			throw new Error("ID da via inválido");
		}
		return this.repository.getEscaladasByViaId(via_id);
	}
}
