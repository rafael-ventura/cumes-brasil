/*import pool from '../config/db';
import {IVia} from "../models/IVia";

class ViaRepository {
    async findAll(): Promise<IVia[]> {
        const [rows] = await pool.query<IVia[]>('SELECT * FROM vias');
        return rows as IVia[];
    }

    async findById(id: number): Promise<IVia | null> {
        const [rows] = await pool.query<IVia[]>('SELECT * FROM vias WHERE id = ?', [id]);
        return rows[0] as IVia || null;
    }

    async findDetailedById(id: number): Promise<IVia | null> {
        const query =
            `
            SELECT * 
            FROM vias 
            LEFT JOIN outra_tabela ON vias.some_id = outra_tabela.some_id
            WHERE vias.id = ?
        `;
        const [rows] = await pool.query<IVia[]>(query, [id]);
        return rows[0] as IVia || null;
    }
}

export default new ViaRepository();*/

/*  TODO: ver se vamos manter o viaRepo acima com sql  */

/* INIT -------------------- new via Repo  ---------------------------*/
import { DocumentStore, IDocumentSession } from 'ravendb';
import { IVia, Via } from '../models/IVia';

export class ViaRepository {
    private session: IDocumentSession;

    constructor(store: DocumentStore) {
        this.session = store.openSession();
    }

    async create(route: IVia): Promise<IVia> {
        await this.session.store(route);
        await this.session.saveChanges();
        return route;
    }

    async getById(id: string): Promise<IVia | null> {
        return await this.session.load<IVia>(id);
    }

    async getAll(): Promise<IVia[]> {
        return await this.session.query<IVia>({ collection: 'vias' }).all();
    }

    async update(id: string, updatedRoute: IVia): Promise<IVia | null> {
        const route = await this.session.load<IVia>(id);
        if (!route) return null;

        Object.assign(route, updatedRoute);
        await this.session.saveChanges();
        return route;
    }

    async delete(id: string): Promise<void> {
        const route = await this.session.load<IVia>(id);
        if (route) {
            await this.session.delete(route);
            await this.session.saveChanges();
        }
    }
}
