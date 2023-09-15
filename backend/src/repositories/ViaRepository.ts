import pool from '../config/db';
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

export default new ViaRepository();
