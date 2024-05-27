"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaceService = void 0;
class FaceService {
    constructor(faceRepository, fonteService, montanhaService) {
        this.faceRepository = faceRepository;
        this.fonteService = fonteService;
        this.montanhaService = montanhaService;
    }
    async getFaceById(id) {
        if (!id) {
            throw new Error("ID da Face não fornecido");
        }
        else if (isNaN(id)) {
            throw new Error("ID da Face inválido");
        }
        return this.faceRepository.getById(id);
    }
    async getFaces() {
        return this.faceRepository.getAll();
    }
    async createFace(face) {
        if (!face) {
            throw new Error("Face inválida");
        }
        const fonteExiste = await this.fonteService.getFonteById(face.fonte);
        if (!fonteExiste) {
            throw new Error("É necessário existir uma Fonte antes da criação da via");
        }
        const montanhaExiste = await this.montanhaService.getMontanhaById(face.montanha);
        if (!montanhaExiste) {
            throw new Error("É necessário existir uma montanha antes da criação da via");
        }
        return this.faceRepository.create(face);
    }
    async updateFace(id, face) {
        if (!id) {
            throw new Error("ID da Face não fornecido");
        }
        else if (isNaN(id)) {
            throw new Error("ID da Face inválido");
        }
        const existingFace = await this.getFaceById(id);
        if (!existingFace) {
            throw new Error("Face não encontrada");
        }
        return this.faceRepository.update(id, face);
    }
    async deleteFace(id) {
        if (!id) {
            throw new Error("ID da Face não fornecido");
        }
        else if (isNaN(id)) {
            throw new Error("ID da Face inválido");
        }
        const existingFace = await this.getFaceById(id);
        if (!existingFace) {
            throw new Error("Face não encontrada");
        }
        return this.faceRepository.delete(id);
    }
}
exports.FaceService = FaceService;
