"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColecaoRepository = void 0;
const Colecao_1 = require("../../Domain/models/Colecao");
class ColecaoRepository {
    constructor(db, viaRepository, croquiRepository) {
        this.db = db;
        this.viaRepository = viaRepository;
        this.croquiRepository = croquiRepository;
    }
    async getColecaoById(id) {
        const query = `
        SELECT Colecao.*, GROUP_CONCAT(ViasColecoes.via_id) as vias_ids
        FROM Colecao
        LEFT JOIN ViasColecoes ON Colecao.id = ViasColecoes.colecao_id
        WHERE Colecao.id = ?
        GROUP BY Colecao.id
    `;
        return new Promise((resolve, reject) => {
            this.db.get(query, [id], async (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) {
                    resolve(null);
                    return;
                }
                const vias_ids = row.vias_ids
                    ? row.vias_ids.split(",").map(Number)
                    : [];
                const colecao = new Colecao_1.Colecao(row.id, row.nome, row.descricao, row.usuario_id, []);
                const viasPromises = vias_ids.map(async (via_id) => {
                    const via = await this.viaRepository.getViaById(via_id);
                    if (via) {
                        // Recuperar os croquis da via
                        return via;
                    }
                });
                const vias = await Promise.all(viasPromises);
                colecao.vias = vias.filter((via) => via !== null);
                resolve(colecao);
            });
        });
    }
    async getColecoes() {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT Colecao.*, GROUP_CONCAT(ViasColecoes.via_id) as vias_ids
                FROM Colecao
                LEFT JOIN ViasColecoes ON Colecao.id = ViasColecoes.colecao_id
                GROUP BY Colecao.id
            `, async (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows) {
                    const colecoes = rows.map(async (row) => {
                        const vias_ids = row.vias_ids
                            ? row.vias_ids.split(",").map(Number)
                            : [];
                        const colecao = new Colecao_1.Colecao(row.id, row.nome, row.descricao, row.usuario_id);
                        // Faz um getViaById pelo viaRepository
                        const viasPromises = vias_ids.map(async (via_id) => {
                            const via = await this.viaRepository.getViaById(via_id);
                            if (via) {
                                // Recuperar os croquis da via
                                if (via.croquis) {
                                    const croquisPromises = via.croquis.map(async (croqui) => {
                                        return await this.croquiRepository.getCroquiById(croqui.id);
                                    });
                                    const croquis = await Promise.all(croquisPromises);
                                    via.croquis = croquis.filter((croqui) => croqui !== null);
                                }
                            }
                            return via;
                        });
                        const vias = await Promise.all(viasPromises);
                        // Popula Vias à coleção
                        vias.forEach((via) => {
                            if (via) {
                                colecao.popularVia(via);
                            }
                        });
                        return colecao;
                    });
                    Promise.all(colecoes).then((colecoesResolved) => {
                        resolve(colecoesResolved);
                    });
                }
                else {
                    resolve(null);
                }
            });
        });
    }
    async getColecoesByUsuarioId(usuarioId) {
        return new Promise(async (resolve, reject) => {
            try {
                const colecoes = await this.getColecoes();
                if (colecoes) {
                    const colecoesDoUsuario = colecoes.filter(colecao => colecao.usuario_id === usuarioId);
                    resolve(colecoesDoUsuario);
                }
                else {
                    resolve(null);
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async createColecao(colecao) {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO Colecao (nome, descricao, usuario_id) VALUES (?,?,?)`, [colecao.nome, colecao.descricao, colecao.usuario_id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    async updateColecao(colecao) {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE Colecao SET nome = ?, descricao = ?, usuario_id = ? WHERE id = ?`, [colecao.nome, colecao.descricao, colecao.usuario_id, colecao.id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    async deleteColecao(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM Colecao WHERE id = ?`, [id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    async getColecaoFavorito(nome) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM Colecao WHERE nome = ?`, [nome], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (row) {
                    const colecaoFavoritos = new Colecao_1.Colecao(row.id, row.nome, row.descricao ?? "", row.usuario_id);
                    resolve(colecaoFavoritos);
                }
                else {
                    resolve(null);
                }
            });
        });
    }
    //TODO: Criar logica para que não permita criação de nova coleção FAVORITO
    async createColecaoFavorito(usuario_id) {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO Colecao (nome, descricao, usuario_id) VALUES (?,?,?)`, ["Favorito", "Coleção de Favoritadas", usuario_id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    //DEVE SER POSSIVEL ADICIONAR UMA NOVA VIA A COLECAO A PARTIR DE UMA TABELA REALCIONAO
    //TABALE RELACIONAL "VIA_COLECOES" QUE TEM UM FK_VIA E FK_COLECAO
    async addVia(via_id, colecao_id) {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO ViasColecoes (via_id, colecao_id) VALUES (?,?)`, [via_id, colecao_id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    async removeVia(via_id, colecao_id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM ViasColecoes WHERE via_id = ? AND colecao_id = ?`, [via_id, colecao_id], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
    async getViasIdsByColecaoId(colecaoId) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT via_id FROM ViasColecoes WHERE colecao_id = ?`, [colecaoId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows) {
                    const ViasIds = rows.map((row) => row.via_id);
                    resolve(ViasIds);
                }
                else {
                    resolve(null);
                }
            });
        });
    }
}
exports.ColecaoRepository = ColecaoRepository;
