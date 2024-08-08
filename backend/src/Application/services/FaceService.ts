import { FaceRepository } from "../../Infrastructure/repositories/FaceRepository";
import { Face } from "../../Domain/entities/Face";
import { MontanhaService } from "./MontanhaService";
import { FonteService } from "./FonteService";

export class FaceService {
    private faceRepository: FaceRepository;
    private fonteService: FonteService;
    private montanhaService: MontanhaService;

    constructor(
        faceRepository: FaceRepository,
        fonteService: FonteService,
        montanhaService: MontanhaService
    ) {
        this.faceRepository = faceRepository;
        this.fonteService = fonteService;
        this.montanhaService = montanhaService;
    }

    async getFaceById (id: number): Promise<Face | null> {
        if (!id) {
            throw new Error("ID da Face não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da Face inválido");
        }
        return this.faceRepository.getById(id);
    }

    async getFaces(): Promise<Face[] | null> {
        return this.faceRepository.getAll();
    }

    async createFace(face: Face): Promise<void> {
        if (!face) {
            throw new Error("Face inválida");
        }
        const fonteExiste = await this.fonteService.getFonteById(face.fonte);
        if (!fonteExiste) {
            throw new Error("É necessário existir uma Fonte antes da criação da via");
        }
        const montanhaExiste = await this.montanhaService.getMontanhaById(face.montanha);
        if (!montanhaExiste) {
            throw new Error(
              "É necessário existir uma montanha antes da criação da via");
        }
        return this.faceRepository.create(face);
    }

    async updateFace (id: number, face: Partial<Face>): Promise<void> {
        if (!id) {
            throw new Error("ID da Face não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da Face inválido");
        }
        const existingFace = await this.getFaceById(id);
        if (!existingFace) {
            throw new Error("Face não encontrada");
        }
        return this.faceRepository.update(id, face);
    }

    async deleteFace (id: number): Promise<void> {
        if (!id) {
            throw new Error("ID da Face não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da Face inválido");
        }
        const existingFace = await this.getFaceById(id);
        if (!existingFace) {
            throw new Error("Face não encontrada");
        }
        return this.faceRepository.delete(id);
    }
}
