import { Escalada } from "../../Domain/entities/Escalada";
import EscaladaValidation from "../../Domain/interfaces/validations/EscaladaValidation";
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

	async getById(id: number): Promise<Escalada | null> {
		if (!id) {
			throw new Error("ID da Fonte não fornecido");
		} else if (isNaN(id)) {
			throw new Error("ID da Fonte inválido");
		}
		return await this.repository.getById(id);
	}

	async get(): Promise<Escalada[]> {
		return await this.repository.getAll();
	}

	async create(escalada: Escalada): Promise<void> {
		EscaladaValidation.valida(escalada);
		return this.repository.createOrUpdate(escalada);
	}

	async update(escalada: Escalada): Promise<void> {
		const escaladaExiste = await this.repository.getById(escalada.id);
		if (!escaladaExiste) {
			throw new Error("Escalada não encontrada");
		}
		// Atualizar valores de escaladaExiste com valores dentro de escalada
		escaladaExiste.data = escalada.data;
		escaladaExiste.observacao = escalada.observacao;

		// Muito importante remover os participantes anteriores, pois senão continuaram existindo na tabela com escalaId = NULL
		escaladaExiste.participantes.forEach(participante => participante.remove());
		escaladaExiste.participantes = escalada.participantes;

		return this.repository.createOrUpdate(escaladaExiste);
	}

	async delete(id: number): Promise<void> {
		const escaladaExiste = await this.repository.getById(id);
		if (!escaladaExiste) {
			throw new Error("Escalada não encontrada");
		}
		return this.repository.remove(escaladaExiste);
	}

	async getEscaladasDoUsuario(usuario_id: number): Promise<ObjectLiteral[]> {
		if (!usuario_id) {
			throw new Error("ID do usuário não fornecido");
		} else if (isNaN(usuario_id)) {
			throw new Error("ID do usuário inválido");
		}
		return this.repository.getByUserId(usuario_id);
	}

	async getEscaladasDaVia(via_id: number): Promise<ObjectLiteral[]> {
		if (!via_id) {
			throw new Error("ID da via não fornecido");
		} else if (isNaN(via_id)) {
			throw new Error("ID da via inválido");
		}
		return this.repository.getByViaId(via_id);
	}
}
