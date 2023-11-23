import {MontanhaAdapter} from "../adapters/MontanhaAdapter";
import {ViaAdapter} from "../adapters/ViaAdapter";
import {ViaRepository} from "./ViaRepository";
import {Fonte} from "../../Domain/models/Fonte";
import store from "../config/db";

export class FonteRepository {


    private viaAdapter: ViaAdapter;
    private montanhaAdapter: MontanhaAdapter;
    private _viaRepository: ViaRepository;


    constructor(viaRepository: ViaRepository) {
        this.viaAdapter = new ViaAdapter();
        this.montanhaAdapter = new MontanhaAdapter();
        this._viaRepository = viaRepository;
    }

    async createFonte(fonte: Fonte) {
        const session = store.openSession();
        try {
            await session.store(fonte);
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }

    async updateFonte(fonte: Fonte) {
        const session = store.openSession();
        try {
            await session.store(fonte);
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }

    async deleteFonte(fonte: Fonte) {
        const session = store.openSession();
        try {
            await session.delete(fonte);
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }

    async getAllFontes(): Promise<Fonte[]> {
        const session = store.openSession();
        try {
            const documents = await session.query({collection: 'Fontes'}).all();
            // Assegura que o objeto é do tipo Fonte antes de passar para o adaptador
            const fontes = documents.map(document => document as Fonte);
            return fontes;
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
            const fonte = documents[0] as Fonte;
            return fonte;
        } finally {
            session.dispose();
        }
    }

    async associarFonteVia(fonte: Fonte, id_via: number) {
        const session = store.openSession();
        try {
            const via = await this._viaRepository.getViaById(id_via);
            fonte.adicionarVia(via);
            await session.saveChanges();
        } finally {
            session.dispose();
        }
    }
}