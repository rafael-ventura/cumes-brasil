"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FonteRepository = void 0;
const Fonte_1 = require("../../Domain/models/Fonte");
class FonteRepository {
    constructor(db) {
        this.db = db;
    }
    async getFonteById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM Fonte WHERE id = ?`, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row) {
                    const fonte = new Fonte_1.Fonte(row.id, row.autor, row.referencia);
                    resolve(fonte);
                }
                else {
                    resolve(null);
                }
            });
        });
    }
    async getFontes() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Fonte`, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows) {
                    const fontes = rows.map((row) => new Fonte_1.Fonte(row.id, row.autor, row.referencia));
                    resolve(fontes);
                }
                else {
                    resolve(null);
                }
            });
        });
    }
    async createFonte(fonte) {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO Fonte (autor, referencia) VALUES (?,?)`, [fonte.autor, fonte.referencia], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    async updateFonte(fonte) {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE Fonte SET autor = ?, referencia = ? WHERE id = ?`, [fonte.autor, fonte.referencia, fonte.id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    async deleteFonte(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Fonte WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}
exports.FonteRepository = FonteRepository;
