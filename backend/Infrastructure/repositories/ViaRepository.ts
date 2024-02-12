import { Database } from "sqlite3";
import { Via } from "../../Domain/models/Via";
import { Croqui } from "../../Domain/models/Croqui";
import { CroquiRepository } from "./CroquiRepository";

export class ViaRepository {
  private db: Database;
  private croquiRepository;

  constructor(db: Database, croquiRepository: CroquiRepository) {
    this.db = db;
    this.croquiRepository = croquiRepository;
  }

  async getViaById(id: number): Promise<Via | null> {
    const query = `SELECT * FROM Via WHERE id = ?`;
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

        const croquis_ids: number[] = row.croquis_ids
          ? row.croquis_ids.split(",").map(Number)
          : [];

        const via = new Via(
          row.id,
          row.nome,
          row.grau,
          row.crux,
          row.artificial,
          row.duracao,
          row.exposicao,
          row.extensao,
          JSON.parse(row.conquistadores), // Converte a string JSON para array de string
          row.detalhes,
          row.data,
          row.montanha_id,
          row.face_id,
          row.via_principal_id,
          row.fonte_id
        );

        // Obtenha os croquis associados a esta via
        const croquisIds = await this.croquiRepository.getCroquisIdsByViaId(
          id
        );

        if (croquisIds) {
          const croquisPromises = croquisIds.map(
            async (croquiId: number) => {
              return await this.croquiRepository.getCroquiById(croquiId);
            }
          );
          const croquis = await Promise.all(croquisPromises);
          via.croquis = croquis.filter((croqui) => croqui !== null) as Croqui[];
        } else {
          via.croquis = [];
        }
        
        resolve(via);
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
          const vias = rows.map(
            (row) =>
              new Via(
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
                row.montanha_id,
                row.face_id,
                row.via_principal_id,
                row.fonte_id
              )
          );
          resolve(vias);
        } else {
          resolve(null);
        }
      });
    });
  }

  async createVia(via: Via): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO Via (nome, grau, crux, artificial, duracao, exposicao, extensao, conquistadores, detalhes, data, montanha_id, face_id, via_principal_id, fonte_id) 
            VALUES (?, ? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,?)`,
        [
          via.nome,
          via.grau,
          via.crux,
          via.artificial,
          via.duracao,
          via.exposicao,
          via.extensao,
          JSON.stringify(via.conquistadores),
          via.detalhes,
          via.data,
          via.montanha_id,
          via.face_id,
          via.via_principal_id,
          via.fonte_id,
        ],
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

  async updateVia(via: Via): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE Via SET nome = ?, grau = ?, crux = ?, artificial = ?, duracao = ?, exposicao = ?, extensao = ?, conquistadores = ?, detalhes = ?, data = ?, montanha_id = ?, face_id = ?, via_principal_id = ?, fonte_id = ? WHERE id = ?`,
        [
          via.nome,
          via.grau,
          via.crux,
          via.artificial,
          via.duracao,
          via.exposicao,
          via.extensao,
          JSON.stringify(via.conquistadores),
          via.detalhes,
          via.data,
          via.montanha_id,
          via.face_id,
          via.via_principal_id,
          via.fonte_id,
          via.id,
        ],
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

  async deleteVia(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM Via WHERE id = ?`, [id], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  public async getCroquisByViaId(viaId: number): Promise<Croqui[] | null> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT c.* FROM Croqui c
                INNER JOIN ViasCroquis vc ON c.id = vc.croqui_id
                WHERE vc.via_id = ?`,
        [viaId],
        (err, rows: Croqui[]) => {
          if (err) {
            reject(err);
            return;
          }
          if (rows) {
            const croquis = rows.map(
              (row) =>
                new Croqui(
                  row.id,
                  row.nome,
                  row.imagemUrl,
                  row.autor,
                  row.descricao,
                  row.fonte_id
                )
            );
            resolve(croquis);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  public async getCroquiIdsByViaId(viaId: number): Promise<number[] | null> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT croqui_id FROM ViasCroquis WHERE via_id = ?`,
        [viaId],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }

          if (rows) {
            const croquiIds = (rows as { croqui_id: number }[]).map(
              (row) => row.croqui_id
            );
            resolve(croquiIds);
          } else {
            resolve(null);
          }
        }
      );
    });
  }
}
