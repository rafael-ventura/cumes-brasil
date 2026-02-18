import { Escalada } from '../../Domain/entities/Escalada';
import EscaladaValidation from '../validations/EscaladaValidation';
import { EscaladaRepository } from '../../Infrastructure/repositories/EscaladaRepository';
import { UsuarioService } from './UsuarioService';
import { ViaService } from './ViaService';
import { LoadStrategy } from '../../Domain/enum/ELoadStrategy';
import { ObjectLiteral } from 'typeorm';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import { Participante } from '../../Domain/entities/Participante';
import { Service } from 'typedi';

@Service()
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
		} else if (Number.isNaN(id)) {
			throw new BadRequestError("ID da Escalada inválido");
		}
		return await this.repository.getById(id, { strategy: LoadStrategy.DETAIL });
	}

    /**
     * @param limit - Número máximo de resultados (opcional)
     * @returns Lista de escaladas ordenadas por data DESC
     */
	async getAll(limit?: number | undefined): Promise<Escalada[] | null> {
		const escaladas = await this.repository.getAll({ strategy: LoadStrategy.LIST });
		
		if (limit && escaladas.length > limit) {
			return escaladas.slice(0, limit);
		}
		
		return escaladas;
	}

	async create(escalada: Escalada): Promise<Escalada> {
		EscaladaValidation.valida(escalada);
		
		const participantesData = escalada.participantes?.map(p => {
			const participante = new Participante();
			participante.nome = p.nome;
			participante.tipo = p.tipo;
			if (p.email) {
				participante.email = p.email;
			}
			return participante;
		}) || [];
		
		const novaEscalada = new Escalada();
		novaEscalada.data = escalada.data;
		novaEscalada.observacao = escalada.observacao;
		novaEscalada.usuario = { id: escalada.usuario } as any;
		novaEscalada.via = { id: escalada.via } as any;
		novaEscalada.participantes = participantesData;
		
		return await this.repository.save(novaEscalada);
	}

	async update(escalada: Escalada): Promise<void> {
		const escaladaExiste = await this.repository.getById(escalada.id, { strategy: LoadStrategy.MINIMAL });
		if (!escaladaExiste) {
			throw new NotFoundError("Escalada não encontrada");
		}

		escaladaExiste.participantes.forEach(participante => participante.remove());
		
		const participantesData = escalada.participantes?.map(p => {
			const participante = new Participante();
			participante.nome = p.nome;
			participante.tipo = p.tipo;
			if (p.email) {
				participante.email = p.email;
			}
			return participante;
		}) || [];

		escaladaExiste.data = escalada.data;
		escaladaExiste.observacao = escalada.observacao;
		escaladaExiste.participantes = participantesData;

		await this.repository.save(escaladaExiste);
	}

	async delete(id: number): Promise<void> {
		const escaladaExiste = await this.repository.getById(id, { strategy: LoadStrategy.MINIMAL });
		if (!escaladaExiste) {
			throw new NotFoundError("Escalada não encontrada");
		}
		return this.repository.remove(escaladaExiste);
	}

	async getEscaladasDoUsuario(usuario_id: number): Promise<ObjectLiteral[]> {
		if (!usuario_id) {
			throw new BadRequestError("ID do usuário não fornecido");
		} else if (Number.isNaN(usuario_id)) {
			throw new BadRequestError("ID do usuário inválido");
		}
		return this.repository.getByUsuarioId(usuario_id, { strategy: LoadStrategy.LIST });
	}

	async getEscaladasDaVia(via_id: number, limit?: number): Promise<ObjectLiteral[]> {
		if (!via_id) {
			throw new BadRequestError("ID da via não fornecido");
		} else if (Number.isNaN(via_id)) {
			throw new BadRequestError("ID da via inválido");
		}
		return this.repository.getByViaId(via_id, limit, { strategy: LoadStrategy.LIST });
	}

	async getEscaladasDaViaDoUsuario(usuario_id: number, via_id: number, limit?: number): Promise<ObjectLiteral[]> {
		if (!via_id) {
			throw new BadRequestError("ID da via não fornecido");
		} else if (Number.isNaN(via_id)) {
			throw new BadRequestError("ID da via inválido");
		} else if (!usuario_id) {
			throw new BadRequestError("ID do usuário não fornecido");
		} else if (Number.isNaN(usuario_id)) {
			throw new BadRequestError("ID do usuário inválido");
		}
		return this.repository.getByViaIdAndByUser(usuario_id, via_id, limit, { strategy: LoadStrategy.LIST });
	}
}
