// ViaRepository.ts
import {DocumentStore} from 'ravendb';
import {ViaAdapter} from '../adapters/ViaAdapter';
import {Via} from '../../Domain/models/Via';
import {ViaDocument} from "../documents/ViaDocument";
import store from "../config/db";
import {Montanha} from "../../Domain/models/Montanha";
import {MontanhaDocument} from "../documents/MontanhaDocument";
import {MontanhaAdapter} from "../adapters/MontanhaAdapter";
import {Face} from "../../Domain/models/Face";
import {Fonte} from "../../Domain/models/Fonte";

export class ViaRepository {


    constructor(store: DocumentStore) {

    }

    async getMontanhaById(id_montanha: number): Promise<Montanha> {
        const session = store.openSession();
        try {
            const documents = await session.query({collection: 'Montanhas'}).whereEquals('Id', id_montanha).all();
            if (documents.length === 0) {
                throw new Error('Montanha não encontrada');
            }
            // Assegura que o objeto é do tipo Montanha antes de passar para o adaptador
            const montanhaDocument = documents[0] as MontanhaDocument;
            return MontanhaAdapter.fromRavenDBDocument(montanhaDocument);
        } finally {
            await session.dispose();
        }
    }

    async getFaceById(id_face: number): Promise<Face> {
        const session = store.openSession();
        try {
            const documents = await session.query({collection: 'Faces'}).whereEquals('Id', id_face).all();
            if (documents.length === 0) {
                throw new Error('Face não encontrada');
            }
            // Assegura que o objeto é do tipo Face antes de passar para o adaptador
            const faceDocument = documents[0] as Face;
            return faceDocument;
        } finally {
            await session.dispose();
        }
    }

    async getFonteById(id_fonte: number): Promise<Fonte> {
        const session = store.openSession();
        try {
            const documents = await session.query({collection: 'Fontes'}).whereEquals('Id', id_fonte).all();
            if (documents.length === 0) {
                throw new Error('Fonte não encontrada');
            }
            // Assegura que o objeto é do tipo Fonte antes de passar para o adaptador
            const fonteDocument = documents[0] as Fonte;
            return fonteDocument;
        } finally {
            await session.dispose();
        }
    }

    async createVia(via: ViaDocument): Promise<void> {
        const session = store.openSession();
        try {
            await session.store(via);
            await session.saveChanges();
        } finally {
            await session.dispose();
        }
    }

    async updateVia(via: ViaDocument): Promise<void> {
        const session = store.openSession();
        try {
            await session.store(via);
            await session.saveChanges();
        } finally {
            await session.dispose();
        }
    }

    async getAll(): Promise<Via[]> {
        const session = store.openSession();
        try {
            const documents = await session.query({collection: 'Vias'}).all();
            if (documents.length === 0) {
                throw new Error('Nenhuma via encontrada');
            }
            // Assegura que todos os objetos são do tipo ViaDocument antes de passar para o adaptador
            const viaDocuments = documents as ViaDocument[];
            return viaDocuments.map(viaDocument => ViaAdapter.fromRavenDBDocument(viaDocument));
        } finally {
            await session.dispose();
        }

    }

    async getViaById(id: any): Promise<Via> {
        const session = store.openSession();
        try {
            const documents = await session.query({collection: 'Vias'}).whereEquals('Id', id).all();
            if (documents.length === 0) {
                throw new Error('Via não encontrada');
            }
            // Assegura que o objeto é do tipo ViaDocument antes de passar para o adaptador
            const viaDocument = documents[0] as ViaDocument;
            return ViaAdapter.fromRavenDBDocument(viaDocument);
        } finally {
            await session.dispose();
        }
    }

    async deleteVia(id: number): Promise<void> {
        const session = store.openSession();
        try {
            const documents = await session.query({collection: 'Vias'}).whereEquals('Id', id).all();
            if (documents.length === 0) {
                throw new Error('Via não encontrada');
            }
            // Assegura que o objeto é do tipo ViaDocument antes de passar para o adaptador
            const viaDocument = documents[0] as ViaDocument;
            await session.delete(viaDocument);
            await session.saveChanges();
        } finally {
            await session.dispose();
        }
    }

}
