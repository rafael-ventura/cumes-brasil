
import { Database } from 'sqlite3';
import { ColecaoEscaladas } from '../../Domain/models/ColecaoEscaladas';

export class ColecaoEscaladasRepository {
    private db: Database;

    constructor(db: Database){
        this.db = db;
    }

    async getColecaoEscaladasById(id: number): Promise<ColecaoEscaladas | null> {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM ColecaoEscaladas WHERE id = ?`, [id], (err, row: ColecaoEscaladas) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (row) {
                        const colecaoEscaladas = new ColecaoEscaladas(
                            row.id,
                            row.nome,
                            row.descricao??"",
                            row.usuario_id!,
                            row.via_id,
                            row.data,
                            row.observacao
                        );
                        resolve(colecaoEscaladas);
                    } else {
                        resolve(null);
                    }
                });
            });
    }

    async getColecoesEscaladas(): Promise<ColecaoEscaladas[] | null> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM ColecaoEscaladas`, (err, rows: ColecaoEscaladas[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (rows) {
                        const colecoesEscaladas = rows.map((row) => new ColecaoEscaladas(
                            row.id,
                            row.nome,
                            row.descricao??"",
                            row.usuario_id!,
                            row.via_id,
                            row.data,
                            row.observacao
                        ));
                        resolve(colecoesEscaladas);
                    } else {
                        resolve(null);
                    }
                });
            });
    }


    async createColecaoEscaladas(colecaoEscaladas: ColecaoEscaladas): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO ColecaoEscaladas (nome, descricao, usuario_id, via_id, data, observacao ) VALUES (?,?,?,?,?,?)`,
                    [colecaoEscaladas.nome, colecaoEscaladas.descricao, colecaoEscaladas.usuario_id, colecaoEscaladas.via_id, colecaoEscaladas.data, colecaoEscaladas.observacao],
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
            });
    }

    async updateColecaoEscaladas(colecaoEscaladas: ColecaoEscaladas): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE ColecaoEscaladas SET nome = ?, descricao = ?, usuario_id = ?, via_id = ?, data = ?, observacao = ?, WHERE id = ?`,
                    [colecaoEscaladas.id, colecaoEscaladas.nome, colecaoEscaladas.descricao, colecaoEscaladas.usuario_id, colecaoEscaladas.via_id, colecaoEscaladas.data, colecaoEscaladas.observacao],
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
            });
    }

    async deleteColecaoEscaladas(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM ColecaoEscaladas WHERE id = ?`, [id], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
    }

}
