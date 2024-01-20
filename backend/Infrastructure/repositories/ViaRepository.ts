import {Database} from 'sqlite3';
import {Via} from '../../Domain/models/Via';

export class ViaRepository {
    private db: Promise<Database>;

    constructor(db: Promise<Database>) {
        this.db = db;
    }

    async getViaById(id: number): Promise<Via | null> {
        const db = await this.db;

        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM Via WHERE id = ?`, [id], (err, row: Via) => {
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
                        row.fonteId,
                        row.croquiId,
                        row.variantes
                    );
                    resolve(via);
                } else {
                    resolve(null);
                }
            });
        });
    }

    async getVias(): Promise<Via[] | null> {
        const db = await this.db;

        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Via`, (err, rows: Via[]) => {
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
                        row.fonteId,
                        row.croquiId,
                        row.variantes
                    ));
                    resolve(vias);
                } else {
                    resolve(null);
                }
            });
        });

    }

    async createVia(via: Via): Promise<void> {
        const db = await this.db;

        return new Promise((resolve, reject) => {
                db.run(`INSERT INTO Via (nome, grau, crux, artificial, duracao, exposicao, extensao, conquistadores, detalhes, data, montanhaId, faceId, viaPrincipalId, fonteId, croquiId, variantes) 
            VALUES (?, ? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,?)`,
                    [via.nome, via.grau, via.crux, via.artificial, via.duracao, via.exposicao, via.extensao, via.conquistadores, via.detalhes, via.data, via.montanhaId, via.faceId, via.viaPrincipalId, via.fonteId, via.croquiId, via.variantes],
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
        const db = await this.db;

        return new Promise((resolve, reject) => {
                db.run(`UPDATE Via SET nome = ?, grau = ?, crux = ?, artificial = ?, duracao = ?, exposicao = ?, extensao = ?, conquistadores = ?, detalhes = ?, data = ?, montanhaId = ?, faceId = ?, viaPrincipalId = ?, fonteId = ?, croquiId = ?, variantes = ? WHERE id = ?`,
                    [via.nome, via.grau, via.crux, via.artificial, via.duracao, via.exposicao, via.extensao, via.conquistadores, via.detalhes, via.data, via.montanhaId, via.faceId, via.viaPrincipalId, via.fonteId, via.croquiId, via.variantes, via.id],
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
        const db = await this.db;

        return new Promise((resolve, reject) => {
                db.run(`DELETE FROM Via WHERE id = ?`,
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

    async getMontanhaById(id: number): Promise<Via | null> {
        const db = await this.db;

        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM Via WHERE id = ?`, [id], (err, row: Via) => {
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
                        row.fonteId,
                        row.croquiId,
                        row.variantes
                    );
                    resolve(via);
                } else {
                    resolve(null);
                }
            });
        });
    }

    async getFaceById(id: number): Promise<Via | null> {
        const db = await this.db;

        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM Via WHERE id = ?`, [id], (err, row: Via) => {
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
                        row.fonteId,
                        row.croquiId,
                        row.variantes
                    );
                    resolve(via);
                } else {
                    resolve(null);
                }
            });
        });
    }

    async getFonteById(id: number): Promise<Via | null> {
        const db = await this.db;

        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM Via WHERE id = ?`, [id], (err, row: Via) => {
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
                        row.fonteId,
                        row.croquiId,
                        row.variantes
                    );
                    resolve(via);
                } else {
                    resolve(null);
                }
            });
        });
    }



}
