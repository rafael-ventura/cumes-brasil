import {DocumentStore} from "ravendb";
import {IColecaoBase} from "../../Domain/interfaces/models/IColecaoBase";

export class ColecaoRepository {
    private store: DocumentStore;
    constructor(store: DocumentStore) {
        this.store = store;
    }
    async createColecao(colecao: IColecaoBase ) {
        const session = this.store.openSession();
        try {
            await session.store(colecao);
            await session.saveChanges();
        }
        finally {
            session.dispose();
        }
    }
    async getColecao(id: number) {
        const session = this.store.openSession();
        try {
            return await session.load(id.toString());
        }
        finally {
            session.dispose();
        }
    }
    async updateColecao(colecao: IColecaoBase) {
        const session = this.store.openSession();
        try {
            await session.store(colecao);
            await session.saveChanges();
        }
        finally {
            session.dispose();
        }
    }
    async deleteColecao(id: number) {
        const session = this.store.openSession();
        try {
            await session.delete(id.toString());
            await session.saveChanges();
        }
        finally {
            session.dispose();
        }
    }
}