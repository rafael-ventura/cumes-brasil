import {ViaAdapter} from "../adapters/ViaAdapter";
import {MontanhaAdapter} from "../adapters/MontanhaAdapter";
import {Montanha} from "../../Domain/models/Montanha";
import store from "../config/db";
import {Via} from "../../Domain/models/Via";

export class MontanhaRepository {
    private viaAdapter: ViaAdapter;
    private montanhaAdapter: MontanhaAdapter;

    constructor() {
        this.viaAdapter = new ViaAdapter();
        this.montanhaAdapter = new MontanhaAdapter();
    }

    async getAllMontanhas(): Promise<Montanha[]> {
        const session = store.openSession();
        try {
            const documents = await session.query({collection: 'Montanhas'}).all();
            // Assegura que o objeto é do tipo Montanha antes de passar para o adaptador
            const montanhas = documents.map(document => document as Montanha);
            return montanhas;
        } finally {
            session.dispose();
        }
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

    async createMontanha(montanha: Montanha) {
        const session = store.openSession();
        try {
            const montanhaDocument = this.montanhaAdapter.toDocument(montanha);
            await session.store(montanhaDocument);
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }

    async updateMontanha(montanha: Montanha) {
        const session = store.openSession();
        try {
            const montanhaDocument = this.montanhaAdapter.toDocument(montanha);
            await session.store(montanhaDocument);
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }

    async deleteMontanha(id_montanha: number) {
        const session = store.openSession();
        try {
            await session.delete(id_montanha.toString());
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }

    async getVias(id_montanha: number) {
        const session = store.openSession();
        try {
            const documents = await session.query({collection: 'Vias'}).whereEquals('IdMontanha', id_montanha).all();
            // Assegura que todos os objetos são do tipo Via antes de passar para o adaptador
            const vias = documents.map(document => document as Via);
            return vias;
        } finally {
            session.dispose();
        }
    }

}