
import { Database } from 'sqlite3';
import { Escalada } from '../../Domain/models/Escalada';

export class EscaladasRepository {
    private db: Database;

    constructor(db: Database){
        this.db = db;
    }

    async getEscaladaById(id: number): Promise<Escalada | null> {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM ColecaoEscaladas WHERE id = ?`, [id], (err, row: Escalada) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (row) {
                        const colecaoEscaladas = new Escalada(
                            row.id,
                            row.nome,
                            row.data,
                            row.descricao,
                            row.observacao,
                            row.usuario_id!,
                            row.via_id
                        );
                        resolve(colecaoEscaladas);
                    } else {
                        resolve(null);
                    }
                });
            });
    }

    async getEscaladas(): Promise<Escalada[] | null> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM ColecaoEscaladas`, (err, rows: Escalada[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (rows) {
                        const Escaladas = rows.map((row) => new Escalada(
                            row.id,
                            row.nome,
                            row.data,
                            row.descricao,
                            row.observacao,
                            row.usuario_id!,
                            row.via_id
                        ));
                        resolve(Escaladas);
                    } else {
                        resolve(null);
                    }
                });
            });
    }


    async createColecaoEscaladas(Escalada: Escalada): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO ColecaoEscaladas (nome, data, descricao, observacao, via_id, usuario_id) VALUES (?,?,?,?,?,?)`,
                    [Escalada.nome, Escalada.data, Escalada.descricao, Escalada.observacao, Escalada.usuario_id, Escalada.via_id],
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
            });
    }

    async updateEscalada(Escalada: Escalada): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE ColecaoEscaladas SET nome = ?, data = ?, descricao = ? observacao = ?, usuario_id = ?, via_id = ?,  WHERE id = ?`,
                    [Escalada.id, Escalada.nome, Escalada.data, Escalada.descricao, Escalada.observacao, Escalada.usuario_id, Escalada.via_id],
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
