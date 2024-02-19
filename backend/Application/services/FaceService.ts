import { FaceRepository } from "../../Infrastructure/repositories/FaceRepository";
import { Face } from "../../Domain/models/Face";

export class FaceService {
    private faceRepository: FaceRepository;

    constructor(faceRepository: FaceRepository) {
        this.faceRepository = faceRepository;
    }

    async getFaceById(id: number): Promise<Face | null> {
        if (!id) {
            throw new Error("ID da face não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da face inválido");
        }

        try {
            const face = await this.faceRepository.getFaceById(id);
            return face;
        } catch (error) {
            // Se a face não for encontrada, retornar null em vez de lançar uma exceção
            if ((error as Error).message === "Face não encontrada") {
                return null;
            }
            // Se ocorrer outro tipo de erro, relançar a exceção
            throw error;
        }
    }

    async getFaces(): Promise<Face[] | null> {
        const faces = await this.faceRepository.getFaces();
        if (!faces) {
            throw new Error("Nenhuma face encontrada");
        }
        return faces;
    }

    async createFace(face: Face): Promise<void> {
        // Adicione suas regras de validação aqui antes de criar a face
        return this.faceRepository.createFace(face);
    }

    async updateFace(face: Face): Promise<void> {
        if (!face.id) {
            throw new Error("ID da face não fornecido");
        }
        const existingFace = await this.faceRepository.getFaceById(face.id);
        if (!existingFace) {
            throw new Error("Face não encontrada");
        }
        // Adicione suas regras de validação aqui antes de atualizar a face
        return this.faceRepository.updateFace(face);
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
