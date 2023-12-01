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
    private viaAdapter: ViaAdapter;
    private montanhaAdapter: MontanhaAdapter;

    constructor() {
        this.viaAdapter = new ViaAdapter();
        this.montanhaAdapter = new MontanhaAdapter();
    }

    async getMontanhaById(id_montanha: number): Promise<Montanha> {
        const session = store.openSession();
        try {
            const documents = await session.query({collection: 'Montanhas'}).whereEquals('Id', id_montanha).all();
            if (documents.length === 0) {
                throw new Error('Montanha não encontrada');
            }
            // Assegura que o objeto é do tipo Montanha antes de passar para o adaptador
            const montanha = documents[0] as Montanha;
            return montanha;
        } finally {
            session.dispose();
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
            session.dispose();
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
            session.dispose();
        }
    }

    async createVia(via: ViaDocument): Promise<void> {
        const session = store.openSession();
        try {
            await session.store(via);
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }

    async updateVia(viaDocument: Via): Promise<void> {
        const session = store.openSession();
        try {
            // Buscar o documento pelo ID interno
            const documents = await session.query({collection: 'Vias'})
                .whereEquals('Id', viaDocument.id)
                .all();

            if (documents.length === 0) {
                throw new Error('Via não encontrada');
            }

            // Atualizar o documento diretamente
            const documentToUpdate = documents[0];

            Object.assign(documentToUpdate, viaDocument);

            // Salve as mudanças no banco de dados
            await session.saveChanges();
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            session.dispose();
        }
    }


    async getAll(): Promise<any> {
        const session = store.openSession();
        try {
            const documents = await session.query({collection: 'Vias'}).all();
            if (documents.length === 0) {
                throw new Error('Nenhuma via encontrada');
            }
            return documents;

        } catch (err) {
            console.log(err)
        } finally {
            session.dispose();
        }

    }

    async getViaById(id: any): Promise<any> {
        const session = store.openSession();
        console.log("chamando a porra do db")
        try {
            const documents = await session.query({collection: 'Vias'}).whereEquals('Id', id).all();

            if (documents.length === 0) {
                throw new Error('Via não encontrada');
            }
            return documents[0];

        } catch (err) {
            console.log(err)
        } finally {
            session.dispose();
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
            session.dispose();
        }
    }


}
