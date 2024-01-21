import {Database} from 'sqlite3';
import {Face} from '../../Domain/models/Face';

export class FaceRepository {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }


    async getFaceById(id: number): Promise<Face | null> {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM Face WHERE id = ?`, [id], (err, row: Face) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row) {
                    const face = new Face(
                        row.id,
                        row.nome,
                        row.montanhaId,
                        row.fonteId
                    );
                    resolve(face);
                } else {
                    resolve(null);
                }
            });
        });
    }


    async getFaces(): Promise<Face[] | null> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Face`, (err, rows: Face[]) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows) {
                    const faces = rows.map((row) => new Face(
                        row.id,
                        row.nome,
                        row.montanhaId,
                        row.fonteId
                    ));
                    resolve(faces);
                } else {
                    resolve(null);
                }
            });
        });

    }

    async createFace(face: Face): Promise<void> {
        return new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO Face (nome, montanhaId, fonteId) VALUES (?,?,?)`,
                    [face.nome, face.montanhaId, face.fonteId],
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

    async updateFace(face: Face): Promise<void> {
        return new Promise((resolve, reject) => {
                this.db.run(`UPDATE Face SET nome = ?, montanhaId = ?, fonteId = ? WHERE id = ?`,
                    [face.nome, face.montanhaId, face.fonteId, face.id],
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

    async deleteFace(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Face WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });

    }

}
