"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaceService = void 0;
class FaceService {
    constructor(faceRepository) {
        this.faceRepository = faceRepository;
    }
    async getFaceById(id) {
        return this.faceRepository.getFaceById(id);
    }
    async getFaces() {
        return this.faceRepository.getFaces();
    }
    async createFace(face) {
        return this.faceRepository.createFace(face);
    }
    async updateFace(face) {
        return this.faceRepository.updateFace(face);
    }
    async deleteFace(id) {
        return this.faceRepository.deleteFace(id);
    }
}
exports.FaceService = FaceService;
