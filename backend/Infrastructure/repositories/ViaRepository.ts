// ViaRepository.ts
import {DocumentStore} from 'ravendb';
import {ViaAdapter} from '../adapters/ViaAdapter';
import {Via} from '../../Domain/models/Via';
import {ViaDocument} from "../documents/ViaDocument";

export class ViaRepository {
    private store: DocumentStore;

    constructor(store: DocumentStore) {
        this.store = store;
    }

    async createVia(via: ViaDocument): Promise<void> {
        const session = this.store.openSession();
        try {
            await session.store(via);
            await session.saveChanges();
        } finally {
            await session.dispose();
        }
    }

    async updateVia(via: ViaDocument): Promise<void> {
        const session = this.store.openSession();
        try {
            await session.store(via);
            await session.saveChanges();
        } finally {
            await session.dispose();
        }
    }

    async getAll(): Promise<Via[]> {
        const session = this.store.openSession();
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

    async getViaById(id: string): Promise<Via> {
        const session = this.store.openSession();
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


    async deleteVia(id: string): Promise<void> {
        const session = this.store.openSession();
        try {
            await session.delete(id);
            await session.saveChanges();
        } finally {
            await session.dispose();
        }
    }


}
