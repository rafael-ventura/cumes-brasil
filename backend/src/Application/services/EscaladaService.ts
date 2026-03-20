import { Escalada } from '../../Domain/entities/Escalada';
import EscaladaValidation from '../validations/EscaladaValidation';
import { EscaladaRepository } from '../../Infrastructure/repositories/EscaladaRepository';
import { UsuarioService } from './UsuarioService';
import { ViaService } from './ViaService';
import { ObjectLiteral } from 'typeorm';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';

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
			throw new BadRequestError("ID da Escalada não fornecido");
		} else if (isNaN(id)) {
			throw new BadRequestError("ID da Escalada inválido");
		}
		return await this.repository.getById(id);
	}

	async getAll(limit: number | undefined, usuarioIdObservador: number): Promise<Escalada[] | null> {
		return await this.repository.getAll(limit, usuarioIdObservador);
	}

	async create(escalada: Escalada): Promise<Escalada> {
		EscaladaValidation.valida(escalada);
		
		// Importa as entidades necessárias
		const { Participante } = await import('../../Domain/entities/Participante');
		
		// Prepara os participantes
		const participantesData = escalada.participantes?.map(p => {
			const participante = new Participante();
			participante.nome = p.nome;
			participante.tipo = p.tipo;
			if (p.email) {
				participante.email = p.email;
			}
			if ((p as any).username) {
				participante.username = (p as any).username;
			}
			return participante;
		}) || [];
		
		// Cria a entidade Escalada
		const novaEscalada = new Escalada();
		novaEscalada.data = escalada.data;
		novaEscalada.observacao = escalada.observacao;
		novaEscalada.usuario = { id: escalada.usuario } as any;
		novaEscalada.via = { id: escalada.via } as any;
		novaEscalada.participantes = participantesData;
		
		return await this.repository.save(novaEscalada);
	}

	async update(escalada: Escalada): Promise<void> {
		const escaladaExiste = await this.repository.getById(escalada.id);
		if (!escaladaExiste) {
			throw new NotFoundError("Escalada não encontrada");
		}

		// Importa a entidade Participante
		const { Participante } = await import('../../Domain/entities/Participante');
		
		// Remove participantes existentes
		escaladaExiste.participantes.forEach(participante => participante.remove());
		
		// Prepara os novos participantes
		const participantesData = escalada.participantes?.map(p => {
			const participante = new Participante();
			participante.nome = p.nome;
			participante.tipo = p.tipo;
			if (p.email) {
				participante.email = p.email;
			}
			if ((p as any).username) {
				participante.username = (p as any).username;
			}
			return participante;
		}) || [];

		escaladaExiste.data = escalada.data;
		escaladaExiste.observacao = escalada.observacao;
		escaladaExiste.participantes = participantesData;

		await this.repository.save(escaladaExiste);
	}

	async delete(id: number): Promise<void> {
		const escaladaExiste = await this.repository.getById(id);
		if (!escaladaExiste) {
			throw new NotFoundError("Escalada não encontrada");
		}
		return this.repository.remove(escaladaExiste);
	}

	async getEscaladasDoUsuario(usuario_id: number): Promise<ObjectLiteral[]> {
		if (!usuario_id) {
			throw new BadRequestError("ID do usuário não fornecido");
		} else if (isNaN(usuario_id)) {
			throw new BadRequestError("ID do usuário inválido");
		}
		return this.repository.getByUsuarioId(usuario_id);
	}

	async getEscaladasDaVia(via_id: number, limit: number | undefined, usuarioIdObservador: number): Promise<ObjectLiteral[]> {
		if (!via_id) {
			throw new BadRequestError("ID da via não fornecido");
		} else if (isNaN(via_id)) {
			throw new BadRequestError("ID da via inválido");
		}
		return this.repository.getByViaId(via_id, limit, usuarioIdObservador);
	}

	/** Escaladas de um usuário: dono vê tudo; terceiros só se o alvo for perfil público. */
	async getEscaladasDoUsuarioParaObservador(usuarioAlvoId: number, usuarioObservadorId: number): Promise<ObjectLiteral[]> {
		if (String(usuarioAlvoId) === String(usuarioObservadorId)) {
			return this.repository.getByUsuarioId(usuarioAlvoId);
		}
		const alvo = await this.usuarioService.getUsuarioById(usuarioAlvoId);
		if (!alvo?.perfil_publico) {
			return [];
		}
		return this.repository.getByUsuarioId(usuarioAlvoId);
	}

	async getEscaladasDaViaDoUsuarioParaObservador(
		usuarioAlvoId: number,
		via_id: number,
		limit: number | undefined,
		usuarioObservadorId: number
	): Promise<ObjectLiteral[]> {
		if (String(usuarioAlvoId) === String(usuarioObservadorId)) {
			return this.repository.getByViaIdAndByUser(usuarioAlvoId, via_id, limit);
		}
		const alvo = await this.usuarioService.getUsuarioById(usuarioAlvoId);
		if (!alvo?.perfil_publico) {
			return [];
		}
		return this.repository.getByViaIdAndByUser(usuarioAlvoId, via_id, limit);
	}

	async getEscaladasDaViaDoUsuario(usuario_id: number, via_id: number, limit?: number): Promise<ObjectLiteral[]> {
		if (!via_id) {
			throw new BadRequestError("ID da via não fornecido");
		} else if (isNaN(via_id)) {
			throw new BadRequestError("ID da via inválido");
		} else if (!usuario_id) {
			throw new BadRequestError("ID do usuário não fornecido");
		} else if (isNaN(usuario_id)) {
			throw new BadRequestError("ID do usuário inválido");
		}
		return this.repository.getByViaIdAndByUser(usuario_id, via_id, limit);
	}

	/**
	 * Registros de terceiros em que o usuário alvo foi marcado na cordada (por username), em qualquer papel (guia, participante, misto).
	 * Mesma regra de privacidade do perfil que getEscaladasDoUsuarioParaObservador.
	 */
	async getEscaladasOndeUsuarioFoiMarcadoParaObservador (
		usuarioAlvoId: number,
		usuarioObservadorId: number
	): Promise<ObjectLiteral[]> {
		const alvo = await this.usuarioService.getUsuarioById(usuarioAlvoId);
		if (!alvo) {
			return [];
		}
		if (String(usuarioAlvoId) !== String(usuarioObservadorId) && !alvo.perfil_publico) {
			return [];
		}
		if (!alvo.username?.trim()) {
			return [];
		}
		return this.repository.getOndeUsuarioFoiMarcado(usuarioAlvoId, alvo.username, usuarioObservadorId);
	}

	async getFeed(pagina: number, itensPorPagina: number): Promise<{ items: Escalada[]; totalPages: number; totalItems: number }> {
		return this.repository.getFeed(pagina, itensPorPagina);
	}
}
