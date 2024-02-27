"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MontanhaRepository = void 0;
const Montanha_1 = require("../../Domain/models/Montanha");
class MontanhaRepository {
    constructor(db) {
        this.db = db;
    }
    async getMontanhaById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM Montanha WHERE id = ?`, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row) {
                    const montanha = new Montanha_1.Montanha(row.id, row.nome, row.localizacao, row.altura, row.fonte_id);
                    resolve(montanha);
                }
                else {
                    resolve(null);
                }
            });
        });
    }
    async getMontanhas() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Montanha`, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows) {
                    const montanhas = rows.map((row) => new Montanha_1.Montanha(row.id, row.nome, row.localizacao, row.altura, row.fonte_id));
                    resolve(montanhas);
                }
                else {
                    resolve(null);
                }
            });
        });
    }
    async createMontanha(montanha) {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO Montanha (nome, localizacao, altura, fonte_id) VALUES (?,?,?,?)`, [montanha.nome, montanha.localizacao, montanha.altura, montanha.fonte_id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    async updateMontanha(montanha) {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE Montanha SET nome = ?, localizacao = ?, altura = ?, fonte_id = ? WHERE id = ?`, [montanha.nome, montanha.localizacao, montanha.altura, montanha.fonte_id, montanha.id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    async deleteMontanha(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Montanha WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}
exports.MontanhaRepository = MontanhaRepository;
