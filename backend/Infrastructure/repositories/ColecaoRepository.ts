import {Database} from "sqlite3";
import {Colecao} from "../../Domain/models/Colecao";

export class ColecaoRepository {
    private db: Database;

    constructor(
        db: Database,
    ) {
        this.db = db;
    }

    async getColecaoById(id: number): Promise<Colecao | null> {
        const query = `
        SELECT Colecao.*, GROUP_CONCAT(ViasColecoes.via_id) as vias_ids
        FROM Colecao
        LEFT JOIN ViasColecoes ON Colecao.id = ViasColecoes.colecao_id
        WHERE Colecao.id = ?
        GROUP BY Colecao.id
    `;
        return new Promise((resolve, reject) => {
            this.db.get(query, [id], async (err, row: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!row) {
                    resolve(null);
                    return;
                }

                const colecao = new Colecao(
                    row.id,
                    row.nome,
                    row.usuario_id,
                    row.descricao,
                    []
                );

                resolve(colecao);
            });
        });
    }

    async getColecoes(): Promise<Colecao[] | null> {
        return new Promise((resolve, reject) => {
            this.db.all(
                `
                SELECT Colecao.*, GROUP_CONCAT(ViasColecoes.via_id) as vias_ids
                FROM Colecao
                LEFT JOIN ViasColecoes ON Colecao.id = ViasColecoes.colecao_id
                GROUP BY Colecao.id
            `,
                async (err, rows: any[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (rows) {
                        const colecoes = rows.map((row) => {
                            const viasIds = row.vias_ids
                                ? row.vias_ids.split(",").map((id: string) => parseInt(id))
                                : [];
                            return new Colecao(
                                row.id,
                                row.nome,
                                row.usuario_id,
                                row.descricao,
                                viasIds
                            );
                        });
                        resolve(colecoes);
                    }
                }
            );
        });
    }


    async createColecao(colecao: Colecao): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO Colecao (nome, usuario_id, descricao) VALUES (?,?,?)`,
                [colecao.nome, colecao.usuario_id, colecao.descricao],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                }
            );
        });
    }

    async updateColecao(colecao: Colecao): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(
                `UPDATE Colecao SET nome = ?, usuario_id = ?, descricao = ? WHERE id = ?`,
                [colecao.nome, colecao.usuario_id, colecao.descricao, colecao.id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                }
            );
        });
    }

    async deleteColecao(id: number): Promise<void> {
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

    async getColecaoFavorito(nome: string): Promise<Colecao | null> {
        return new Promise((resolve, reject) => {
            this.db.get(
                `SELECT * FROM Colecao WHERE nome = ?`,
                [nome],
                (err, row: Colecao) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    if (row) {
                        const colecaoFavoritos = new Colecao(
                            row.id,
                            row.nome,
                            row.usuario_id!,
                            row.descricao ?? "",
                        );
                        resolve(colecaoFavoritos);
                    } else {
                        resolve(null);
                    }
                }
            );
        });
    }

    //TODO: Criar logica para que não permita criação de nova coleção FAVORITO
    //TODO: Ao criar um novo usuario rodar o metodo createColecaoFavorito para criar uma coleção favorita para o usuario
    //TODO: Talvez seja necessário passar essa responsabilidade para ColecaoService ou UsuarioService.
    async createColecaoFavorito(usuario_id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO Colecao (nome, descricao, usuario_id) VALUES (?,?,?)`,
                ["Favorito", "Coleção de Favoritadas", usuario_id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                }
            );
        });
    }

    //DEVE SER POSSIVEL ADICIONAR UMA NOVA VIA A COLECAO A PARTIR DE UMA TABELA REALCIONAO
    //TABALE RELACIONAL "VIA_COLECOES" QUE TEM UM FK_VIA E FK_COLECAO
    async addVia(via_id: number, colecao_id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(
                `INSERT INTO ViasColecoes (via_id, colecao_id) VALUES (?,?)`,
                [via_id, colecao_id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                }
            );
        });
    }

    async removeVia(via_id: number, colecao_id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(
                `DELETE FROM ViasColecoes WHERE via_id = ? AND colecao_id = ?`,
                [via_id, colecao_id],
                (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                }
            );
        });
    }

    async getViasIdsByColecaoId(colecaoId: number): Promise<{ via_id: number }[] | null> {
        return new Promise<{ via_id: number }[]>((resolve, reject) => {
            this.db.all(
                `SELECT via_id FROM ViasColecoes WHERE colecao_id = ?`,
                [colecaoId],
                (err, rows: { via_id: number }[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(rows);
                }
            );
        });
    }
    
    
}
