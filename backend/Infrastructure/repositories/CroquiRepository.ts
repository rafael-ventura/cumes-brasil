import {Croqui} from "../../Domain/entities/Croqui";
import {Via} from "../../Domain/entities/Via";
import {MontanhaAdapter} from "../adapters/MontanhaAdapter";
import {ViaAdapter} from "../adapters/ViaAdapter";
import store from "../config/db";


export class CroquiRepository {
    private viaAdapter: ViaAdapter;
    private montanhaAdapter: MontanhaAdapter;

    constructor() {
        this.viaAdapter = new ViaAdapter();
        this.montanhaAdapter = new MontanhaAdapter();
    }

    async getCroquiById(id: number): Promise<Croqui> {
        const session = store.openSession();
        try {
            const documents = await session.query({collection: 'Croquis'}).whereEquals('Id', id).all();
            if (documents.length === 0) {
                throw new Error('Croqui não encontrado');
            }
            // Assegura que o objeto é do tipo Croqui antes de passar para o adaptador
            const croqui = documents[0] as Croqui;
            return croqui;

        } finally {
            session.dispose();
        }
    }

    async createCroqui(croqui: Croqui) {
        const session = store.openSession();
        try {
            await session.store(croqui);
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }

    async updateCroqui(croqui: Croqui) {
        const session = store.openSession();
        try {
            await session.store(croqui);
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }

    async deleteCroqui(croqui: Croqui) {
        const session = store.openSession();
        try {
            await session.delete(croqui);
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }

    async getAllCroquis(): Promise<Croqui[]> {
        const session = store.openSession();
        try {
            const documents = await session.query({collection: 'Croquis'}).all();
            // Assegura que o objeto é do tipo Croqui antes de passar para o adaptador
            const croquis = documents.map(document => document as Croqui);
            return croquis;
        } finally {
            session.dispose();
        }
    }

}