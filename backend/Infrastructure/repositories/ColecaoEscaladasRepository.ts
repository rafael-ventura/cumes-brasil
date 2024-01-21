/*
import { Database } from 'sqlite3';
import { ColecaoEscaladas } from '../../Domain/models/ColecaoEscaladas';

export class ColecaoEscaladasRepository {
    private db: Promise<Database>;

    constructor(db: Promise<Database>) /!**!/{
        this.db = db;
    }

    async getColecaoEscaladasById(id: number): Promise<ColecaoEscaladas | null> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.get(`SELECT * FROM ColecaoEscaladas WHERE id = ?`, [id], (err, row: ColecaoEscaladas) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (row) {
                        const colecaoEscaladas = new ColecaoEscaladas(
                            row.id,
                            row.nome,
                            row.descricao,
                            row.usuarioId
                        );
                        resolve(colecaoEscaladas);
                    } else {
                        resolve(null);
                    }
                });
            });
        });
    }

    async getColecoesEscaladas(): Promise<ColecaoEscaladas[] | null> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.all(`SELECT * FROM ColecaoEscaladas`, (err, rows: ColecaoEscaladas[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (rows) {
                        const colecoesEscaladas = rows.map((row) => new ColecaoEscaladas(
                            row.id,
                            row.nome,
                            row.descricao,
                            row.usuarioId
                        ));
                        resolve(colecoesEscaladas);
                    } else {
                        resolve(null);
                    }
                });
            });
        });
    }


    async createColecaoEscaladas(colecaoEscaladas: ColecaoEscaladas): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.run(`INSERT INTO ColecaoEscaladas (nome, descricao, usuarioId) VALUES (?,?,?)`,
                    [colecaoEscaladas.nome, colecaoEscaladas.descricao, colecaoEscaladas.usuarioId],
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
            });
        });
    }

    async updateColecaoEscaladas(colecaoEscaladas: ColecaoEscaladas): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.run(`UPDATE ColecaoEscaladas SET nome = ?, descricao = ?, usuarioId = ? WHERE id = ?`,
                    [colecaoEscaladas.nome, colecaoEscaladas.descricao, colecaoEscaladas.usuarioId, colecaoEscaladas.id],
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
            });
        });
    }

    async deleteColecaoEscaladas(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.then((db) => {
                db.run(`DELETE FROM ColecaoEscaladas WHERE id = ?`, [id], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }

}*/
