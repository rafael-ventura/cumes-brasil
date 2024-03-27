
import { Database } from 'sqlite3';
import { Escalada } from '../../Domain/models/Escalada';

export class EscaladaRepository {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    async getEscaladaById(id: number): Promise<Escalada | null> {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM Escalada WHERE id = ?`, [id], (err, row: Escalada) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row) {
                    const escaladas = new Escalada(
                        row.id,
                        row.nome,
                        row.data,
                        row.observacao,
                        row.usuario_id!,
                        row.via_id
                    );
                    resolve(escaladas);
                } else {
                    resolve(null);
                }
            });
        });
    }

    async getEscaladas(): Promise<Escalada[] | null> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Escalada`, (err, rows: Escalada[]) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows) {
                    const Escaladas = rows.map((row) => new Escalada(
                        row.id,
                        row.nome,
                        row.data,
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

    async getEscaladasDoUsuario(usuarioId: number): Promise<Escalada[] | null> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Escalada WHERE usuario_id = ?`, [usuarioId], (err, rows: Escalada[]) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows) {
                    const escaladas = rows.map((row) => new Escalada(
                        row.id,
                        row.nome,
                        row.data,
                        row.observacao,
                        row.usuario_id!,
                        row.via_id
                    ));
                    resolve(escaladas);
                } else {
                    resolve(null);
                }
            });
        });
    }



    async createEscalada(escalada: Escalada): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO Escalada (nome, data, observacao, via_id, usuario_id) VALUES (?,?,?,?,?)`,
                [escalada.nome, escalada.data, escalada.observacao, escalada.usuario_id, escalada.via_id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
        });
    }

    async updateEscalada(escalada: Escalada): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE Escalada SET nome = ?, data = ?, observacao = ?, usuario_id = ?, via_id = ? WHERE id = ?`,
                [escalada.nome, escalada.data, escalada.observacao, escalada.usuario_id, escalada.via_id, escalada.id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
        });
    }

    async deleteEscalada(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Escalada WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

}
