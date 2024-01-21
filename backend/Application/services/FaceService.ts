import {FaceRepository} from "../../Infrastructure/repositories/FaceRepository";
import {Face} from "../../Domain/models/Face";

export class FaceService {
    private faceRepository: FaceRepository;

    constructor(faceRepository: FaceRepository) {
        this.faceRepository = faceRepository;
    }

    async getFaceById(id: number): Promise<Face | null> {
        return this.faceRepository.getFaceById(id);
    }

    async getFaces(): Promise<Face[] | null> {
        return this.faceRepository.getFaces();
    }

    async createFace(face: Face): Promise<void> {
        return this.faceRepository.createFace(face);
    }

    async updateFace(face: Face): Promise<void> {
        return this.faceRepository.updateFace(face);
    }

    async deleteFace(id: number): Promise<void> {
        return this.faceRepository.deleteFace(id);
    }
}