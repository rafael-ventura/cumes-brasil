import { Escalada } from '../../Domain/entities/Escalada';
import EscaladaValidation from '../validations/EscaladaValidation';
import { EscaladaRepository } from '../../Infrastructure/repositories/EscaladaRepository';
import { UsuarioService } from './UsuarioService';
import { ViaService } from './ViaService';
import { ObjectLiteral } from 'typeorm';

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

	async getAll(limit?: number | undefined): Promise<Escalada[] | null> {
		return await this.repository.getAll(limit);
	}

	async create(escalada: Escalada): Promise<void> {
		EscaladaValidation.valida(escalada);
		return this.repository.save(escalada);
	}

	async update(escalada: Escalada): Promise<void> {
		const escaladaExiste = await this.repository.getById(escalada.id);
		if (!escaladaExiste) {
			throw new Error("Escalada não encontrada");
		}

		escaladaExiste.data = escalada.data;
		escaladaExiste.observacao = escalada.observacao;
		escaladaExiste.participantes.forEach(participante => participante.remove());
		escaladaExiste.participantes = escalada.participantes;

		return this.repository.save(escaladaExiste);
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

	async getEscaladasDaVia(via_id: number, limit?: number): Promise<ObjectLiteral[]> {
		if (!via_id) {
			throw new Error("ID da via não fornecido");
		} else if (isNaN(via_id)) {
			throw new Error("ID da via inválido");
		}
		return this.repository.getByViaId(via_id, limit);
	}

	async getEscaladasDaViaDoUsuario(usuario_id: number, via_id: number, limit?: number): Promise<ObjectLiteral[]> {
		if (!via_id) {
			throw new Error("ID da via não fornecido");
		} else if (isNaN(via_id)) {
			throw new Error("ID da via inválido");
		} else if (!usuario_id) {
			throw new Error("ID do usuário não fornecido");
		} else if (isNaN(usuario_id)) {
			throw new Error("ID do usuário inválido");
		}
		return this.repository.getByViaIdAndByUser(usuario_id, via_id, limit);
	}
}
