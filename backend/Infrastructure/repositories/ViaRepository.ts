import {Database} from 'sqlite3';
import {Via} from '../../Domain/models/Via';

export class ViaRepository {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    async getViaById(id: number): Promise<Via | null> {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM Via WHERE id = ?`, [id], (err, row: Via) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row) {

                    const via = new Via(
                        row.id,
                        row.nome,
                        row.grau,
                        row.crux,
                        row.artificial,
                        row.duracao,
                        row.exposicao,
                        row.extensao,
                        row.conquistadores,
                        row.detalhes,
                        row.data,
                        row.montanhaId,
                        row.faceId,
                        row.viaPrincipalId,
                        row.fonteId
                    );
                    resolve(via);
                } else {
                    resolve(null);
                }
            });
        });
    }

    async getVias(): Promise<Via[] | null> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Via`, (err, rows: Via[]) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows) {
                    const vias = rows.map((row) => new Via(
                        row.id,
                        row.nome,
                        row.grau,
                        row.crux,
                        row.artificial,
                        row.duracao,
                        row.exposicao,
                        row.extensao,
                        row.conquistadores,
                        row.detalhes,
                        row.data,
                        row.montanhaId,
                        row.faceId,
                        row.viaPrincipalId,
                        row.fonteId
                    ));
                    resolve(vias);
                } else {
                    resolve(null);
                }
            });
        });

    }

    async createVia(via: Via): Promise<void> {

        return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO Via (nome, grau, crux, artificial, duracao, exposicao, extensao, conquistadores, detalhes, data, montanha_id, face_id, via_principal_id, fonte_id) 
            VALUES (?, ? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,?)`,
                    [via.nome, via.grau, via.crux, via.artificial, via.duracao, via.exposicao, via.extensao, JSON.stringify(via.conquistadores), via.detalhes, via.data, via.montanhaId, via.faceId, via.viaPrincipalId, via.fonteId],
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
            }
        );

    }

    async updateVia(via: Via): Promise<void> {

        return new Promise((resolve, reject) => {
                this.db.run(`UPDATE Via SET nome = ?, grau = ?, crux = ?, artificial = ?, duracao = ?, exposicao = ?, extensao = ?, conquistadores = ?, detalhes = ?, data = ?, montanha_id = ?, face_id = ?, via_principal_id = ?, fonte_id = ? WHERE id = ?`,
                    [via.nome, via.grau, via.crux, via.artificial, via.duracao, via.exposicao, via.extensao, JSON.stringify(via.conquistadores), via.detalhes, via.data, via.montanhaId, via.faceId, via.viaPrincipalId, via.fonteId, via.id],
                    (err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve();
                    });
            }
        );
    }

    async deleteVia(id: number): Promise<void> {

        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Via WHERE id = ?`,
                [id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            }
        );
    }
}
