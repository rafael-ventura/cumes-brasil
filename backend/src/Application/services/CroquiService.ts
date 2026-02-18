import {Croqui} from "../../Domain/entities/Croqui";
import {CroquiRepository} from "../../Infrastructure/repositories/CroquiRepository";
import {ViaRepository} from "../../Infrastructure/repositories/ViaRepository";
import {ViaCroquiRepository} from "../../Infrastructure/repositories/ViaCroquiRepository";
import { LoadStrategy } from "../../Domain/enum/ELoadStrategy";
import BadRequestError from "../errors/BadRequestError";
import NotFoundError from "../errors/NotFoundError";
import BaseService from "./BaseService";
import { Service } from 'typedi';

@Service()
export class CroquiService extends BaseService<Croqui, CroquiRepository> {
    private viaRepository: ViaRepository;
    private viaCroquiRepository: ViaCroquiRepository;

    constructor(croquiRepository: CroquiRepository, viaRepository: ViaRepository, viaCroquiRepository: ViaCroquiRepository) {
        super(croquiRepository);
        this.viaRepository = viaRepository;
        this.viaCroquiRepository = viaCroquiRepository;
    }

    async getCroquiById (id: number): Promise<Croqui | null> {
        const croqui = await this.repository.getById(id, { strategy: LoadStrategy.DETAIL });
        if (!id) {
            throw new BadRequestError("ID do Croqui não fornecido");
        } else if (Number.isNaN(id)) {
            throw new BadRequestError("ID do Croqui inválido");
        }
        return croqui;
    }

    async getCroquis (): Promise<Croqui[]> {
        return this.repository.getAll({ strategy: LoadStrategy.LIST });
    }

    async createCroqui (croqui: Croqui): Promise<void> {
        if (!croqui) {
            throw new BadRequestError("Croqui inválido");
        }
        await this.repository.create(croqui);
    }

    async updateCroqui (id: number, croquiData: Partial<Croqui>): Promise<void> {
        if (!id) {
            throw new BadRequestError("ID do croqui não fornecido");
        } else if (isNaN(id)) {
            throw new BadRequestError("ID do croqui inválido");
        }
        const existingCroqui = await this.getCroquiById(id);
        if (!existingCroqui) {
            throw new NotFoundError("Croqui não encontrado");
        }
        await this.repository.update(id, croquiData);
    }

    async deleteCroqui (id: number): Promise<void> {
        if (!id) {
            throw new BadRequestError("ID do croqui não fornecido");
        } else if (isNaN(id)) {
            throw new BadRequestError("ID do croqui inválido");
        }
        const existingCroqui = await this.getCroquiById(id);
        if (!existingCroqui) {
            throw new NotFoundError("Croqui não encontrado");
        }
        await this.repository.delete(id);
    }

    async associarCroquiEmVia (croquiId: number, viaId: number): Promise<void> {
        return this.viaCroquiRepository.associar({croqui: {id: croquiId}, via: {id: viaId}});
    }

    async desassociarCroquiEmVia (croquiId: number, viaId: number): Promise<void> {
        return this.viaCroquiRepository.desassociar(croquiId, viaId);
    }

    async getCroquisByViaId (id: number): Promise<Croqui[]> {
        return this.repository.getByViaId(id, { strategy: LoadStrategy.LIST });
    }

}
