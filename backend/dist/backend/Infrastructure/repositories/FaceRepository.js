"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaceRepository = void 0;
const Face_1 = require("../../Domain/models/Face");
class FaceRepository {
    constructor(db) {
        this.db = db;
    }
    async getFaceById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM Face WHERE id = ?`, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row) {
                    const face = new Face_1.Face(row.id, row.nome, row.montanha_id, row.fonte_id);
                    resolve(face);
                }
                else {
                    resolve(null);
                }
            });
        });
    }
    async getFaces() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Face`, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows) {
                    const faces = rows.map((row) => new Face_1.Face(row.id, row.nome, row.montanha_id, row.fonte_id));
                    resolve(faces);
                }
                else {
                    resolve(null);
                }
            });
        });
    }
    async createFace(face) {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO Face (nome, montanha_id, fonte_id) VALUES (?,?,?)`, [face.nome, face.montanha_id, face.fonte_id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    async updateFace(face) {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE Face SET nome = ?, montanha_id = ?, fonte_id = ? WHERE id = ?`, [face.nome, face.montanha_id, face.fonte_id, face.id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    async deleteFace(id) {
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
exports.FaceRepository = FaceRepository;
