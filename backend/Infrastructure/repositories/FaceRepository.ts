import {Face} from "../../Domain/models/Face";
import store from "../config/db";
import {ViaRepository} from "./ViaRepository";


export class FaceRepository {
    private viaRepository: ViaRepository;

    constructor(viaRepository: ViaRepository) {
        this.viaRepository = viaRepository;

    }

    async createFace(face: Face) {
        const session = store.openSession();
        try {
            await session.store(face);
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }

    async getFace(id: number) {
        const session = store.openSession();
        try {
            return await session.load(id.toString());
        } finally {
            session.dispose();
        }
    }

    async updateFace(face: Face) {
        const session = store.openSession();
        try {
            await session.store(face);
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }

    async deleteFace(id: number) {
        const session = store.openSession();
        try {
            await session.delete(id.toString());
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }

    async getAllFaces(): Promise<Face[]> {
        const session = store.openSession();
        try {
            const documents = await session.query({collection: 'Faces'}).all();
            // Assegura que o objeto é do tipo Face antes de passar para o adaptador
            const faces = documents.map(document => document as Face);
            return faces;
        } finally {
            session.dispose();
        }
    }

    async associarFaceVia(face: Face, id_via: number) {
        const session = store.openSession();
        try {
            const via = await this.viaRepository.getViaById(id_via);
            face.adicionarVia(via);
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }


}