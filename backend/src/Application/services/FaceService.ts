import { FaceRepository } from "../../Infrastructure/repositories/FaceRepository";
import { Face } from "../../Domain/entities/Face";
import { MontanhaService } from "./MontanhaService";
import { FonteService } from "./FonteService";
import { LoadStrategy } from "../../Domain/enum/ELoadStrategy";
import BadRequestError from "../errors/BadRequestError";
import NotFoundError from "../errors/NotFoundError";
import BaseService from "./BaseService";
import { Service } from 'typedi';

@Service()
export class FaceService extends BaseService<Face, FaceRepository> {
    private fonteService: FonteService;
    private montanhaService: MontanhaService;

    constructor(
        faceRepository: FaceRepository,
        fonteService: FonteService,
        montanhaService: MontanhaService
    ) {
        super(faceRepository);
        this.fonteService = fonteService;
        this.montanhaService = montanhaService;
    }

    async getFaceById (id: number): Promise<Face | null> {
        if (!id) {
            throw new BadRequestError("ID da Face não fornecido");
        } else if (Number.isNaN(id)) {
            throw new BadRequestError("ID da Face inválido");
        }
        return this.repository.getById(id, { strategy: LoadStrategy.DETAIL });
    }

    async getFaces(): Promise<Face[] | null> {
        return this.repository.getAll({ strategy: LoadStrategy.LIST });
    }

    async createFace(face: Face): Promise<void> {
        if (!face) {
            throw new BadRequestError("Face inválida");
        }
        // Extrai ID da fonte (pode vir como número ou objeto)
        const fonteId = typeof face.fonte === 'number' ? face.fonte : (face.fonte as any)?.id;
        const fonteExiste = await this.fonteService.getFonteById(fonteId);
        if (!fonteExiste) {
            throw new BadRequestError("É necessário existir uma Fonte antes da criação da via");
        }
        // Extrai ID da montanha (pode vir como número ou objeto)
        const montanhaId = typeof face.montanha === 'number' ? face.montanha : (face.montanha as any)?.id;
        const montanhaExiste = await this.montanhaService.getMontanhaById(montanhaId);
        if (!montanhaExiste) {
            throw new BadRequestError(
              "É necessário existir uma montanha antes da criação da via");
        }
        await this.repository.create(face);
    }

    async updateFace (id: number, face: Partial<Face>): Promise<void> {
        if (!id) {
            throw new BadRequestError("ID da Face não fornecido");
        } else if (Number.isNaN(id)) {
            throw new BadRequestError("ID da Face inválido");
        }
        this.ensureExists(await this.getFaceById(id), "Face não encontrada");
        return this.repository.update(id, face);
    }

    async deleteFace (id: number): Promise<void> {
        if (!id) {
            throw new BadRequestError("ID da Face não fornecido");
        } else if (Number.isNaN(id)) {
            throw new BadRequestError("ID da Face inválido");
        }
        this.ensureExists(await this.getFaceById(id), "Face não encontrada");
        return this.repository.delete(id);
    }
}
