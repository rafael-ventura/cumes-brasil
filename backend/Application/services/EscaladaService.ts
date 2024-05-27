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

	async getById (id: number): Promise<Escalada | null> {
		if (!id) {
			throw new Error("ID da Fonte não fornecido");
		} else if (isNaN(id)) {
			throw new Error("ID da Fonte inválido");
		}
		return this.repository.getById(id);

	}

	async get (): Promise<Escalada[]> {
		return this.repository.getAll();
	}

	async create (escalada: Escalada): Promise<void> {
		return this.repository.create(escalada);
	}

	async update(escalada: Escalada): Promise<void> {
		const escaladaExiste = await this.repository.getById(escalada.id);
		if (!escaladaExiste) {
			throw new Error("Escalada não encontrada");
		}
		return this.repository.update(escalada.id, escalada);
	}

	async delete(id: number): Promise<void> {
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
		return this.repository.getByUserId(usuario_id);
	}

	async getEscaladasDaVia (via_id: number): Promise<ObjectLiteral[]> {
		if (!via_id) {
			throw new Error("ID da via não fornecido");
		} else if (isNaN(via_id)) {
			throw new Error("ID da via inválido");
		}
		return this.repository.getByViaId(via_id);
	}
}
