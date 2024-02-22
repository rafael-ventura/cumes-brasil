import { FaceRepository } from "../../Infrastructure/repositories/FaceRepository";
import { Face } from "../../Domain/models/Face";
import { FonteService } from "./FonteService";
import { MontanhaService } from "./MontanhaService";

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

    async getFaceById(id: number): Promise<Face | null> {
        if (!id) {
            throw new Error("ID da face não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da face inválido");
        }
        const response = await this.faceRepository.getFaceById(id);
        if (!response) {
            throw new Error("Face não encontrada");
        }
        return response;
    }

    async getFaces(): Promise<Face[] | null> {
        const faces = await this.faceRepository.getFaces();
        if (!faces) {
            throw new Error("Nenhuma face encontrada");
        }
        return faces;
    }

    async createFace(face: Face): Promise<void> {
        const fonteExiste = await this.fonteService.getFonteById(face.fonte_id);
        if (!fonteExiste) {
            throw new Error("É necessário existir uma fonte antes da criação da via");
        }
        const montanhaExiste = await this.montanhaService.getMontanhaById(
            face.montanha_id
        );
        if (!montanhaExiste) {
            throw new Error(
                "É necessário existir uma montanha antes da criação da via"
            );
        }
        const response = await this.faceRepository.createFace(face);
        if (response === null) {
            throw new Error("Erro ao criar face");
        }
        return response;
    }

    async updateFace(face: Face): Promise<void> {
        if (!face.id) {
            throw new Error("ID da face não fornecido");
        }
        const existingFace = await this.faceRepository.getFaceById(face.id);
        if (!existingFace) {
            throw new Error("Face não encontrada");
        }
        const fonteExiste = await this.fonteService.getFonteById(face.fonte_id);
        if (!fonteExiste) {
            throw new Error("É necessário existir uma fonte antes da criação da via");
        }
        const montanhaExiste = await this.montanhaService.getMontanhaById(
            face.montanha_id
        );
        if (!montanhaExiste) {
            throw new Error(
                "É necessário existir uma montanha antes da criação da via"
            );
        }
        const resposta = await this.faceRepository.updateFace(face);
        if (resposta === null) {
            throw new Error("Erro ao atualizar face");
        }
        return resposta;
    }

    async deleteFace(id: number): Promise<void> {
        if (!id) {
            throw new Error("ID da face não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da face inválido");
        }
        const existingFace = await this.faceRepository.getFaceById(id);
        if (!existingFace) {
            throw new Error("Face não encontrada");
        }
        return this.faceRepository.deleteFace(id);
    }
}
