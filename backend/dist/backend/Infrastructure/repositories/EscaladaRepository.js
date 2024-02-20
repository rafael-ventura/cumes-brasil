"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscaladaRepository = void 0;
const Escalada_1 = require("../../Domain/models/Escalada");
class EscaladaRepository {
    constructor(db) {
        this.db = db;
    }
    async getEscaladaById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM Escaladas WHERE id = ?`, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row) {
                    const escaladas = new Escalada_1.Escalada(row.id, row.nome, row.data, row.descricao, row.observacao, row.usuario_id, row.via_id);
                    resolve(escaladas);
                }
                else {
                    resolve(null);
                }
            });
        });
    }
    async getEscaladas() {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Escalada`, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows) {
                    const Escaladas = rows.map((row) => new Escalada_1.Escalada(row.id, row.nome, row.data, row.descricao, row.observacao, row.usuario_id, row.via_id));
                    resolve(Escaladas);
                }
                else {
                    resolve(null);
                }
            });
        });
    }
    async getEscaladasDoUsuario(usuarioId) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM Escalada WHERE usuario_id = ?`, [usuarioId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows) {
                    const escaladas = rows.map((row) => new Escalada_1.Escalada(row.id, row.nome, row.data, row.descricao, row.observacao, row.usuario_id, row.via_id));
                    resolve(escaladas);
                }
                else {
                    resolve(null);
                }
            });
        });
    }
    async createEscalada(escalada) {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO Escalada (nome, data, descricao, observacao, via_id, usuario_id) VALUES (?,?,?,?,?,?)`, [escalada.nome, escalada.data, escalada.descricao, escalada.observacao, escalada.usuario_id, escalada.via_id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    async updateEscalada(escalada) {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE Escalada SET nome = ?, data = ?, descricao = ?, observacao = ?, usuario_id = ?, via_id = ? WHERE id = ?`, [escalada.nome, escalada.data, escalada.descricao, escalada.observacao, escalada.usuario_id, escalada.via_id, escalada.id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    async deleteEscalada(id) {
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
exports.EscaladaRepository = EscaladaRepository;
