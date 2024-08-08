import { AppDataSource } from "../config/db";
import { Croqui } from "../../Domain/entities/Croqui";
import { ObjectLiteral } from "typeorm";

export class CroquiRepository {
  private repository = AppDataSource.getRepository(Croqui);

  async getById (id: number): Promise<Croqui | null> {
    return this.repository.createQueryBuilder("croqui")
      .leftJoinAndSelect("croqui.fonte", "fonte")
      .leftJoinAndSelect("croqui.imagem", "imagem")
      .where("croqui.id = :id", { id })
      .getOne();
    }
  async getByIds (ids: number[]): Promise<Croqui[]> {
    return this.repository.createQueryBuilder("croqui")
      .leftJoinAndSelect("croqui.fonte", "fonte")
      .leftJoinAndSelect("croqui.imagem", "imagem")
      .where("croqui.id IN (:...ids)", { ids })
      .getMany();
  }

  async getAll (): Promise<Croqui[]> {
    return this.repository.createQueryBuilder("croqui")
      .leftJoinAndSelect("croqui.fonte", "fonte")
      .leftJoinAndSelect("croqui.imagem", "imagem")
      .getMany();
  }

  async create (croqui: Partial<Croqui>): Promise<void> {
    await this.repository.insert(croqui);
  }

  async update (id: number, croquiData: Partial<Croqui>): Promise<void> {
    await this.repository.update(id, croquiData);
  }

  async delete (id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getIdsByViaId (via_id: number): Promise<number[] | null> {
    return this.repository.createQueryBuilder("croqui")
      .leftJoin("croqui.vias", "via")
      .where("via.id = :via_id", { via_id })
      .select("croqui.id")
      .getRawMany()
      .then((croquis) => croquis.map(croqui => croqui.id));
  }

  async getByViaId(via_id: number): Promise<Croqui[]> {
    return this.repository.createQueryBuilder("croqui")
        .leftJoinAndSelect("croqui.fonte", "fonte")
        .leftJoinAndSelect("croqui.imagem", "imagem")
        .leftJoin("croqui.vias", "via")
        .where("via.id = :via_id", { via_id })
        .getMany();
  }

  async associarVia (croqui_id: number, via_id: number): Promise<void> {
    return this.repository.createQueryBuilder()
      .relation(Croqui, "vias")
      .of(croqui_id)
      .add(via_id);
  }

  async desassociarVia (croqui_id: number, via_id: number): Promise<void> {
    return this.repository.createQueryBuilder()
      .relation(Croqui, "vias")
      .of(croqui_id)
      .remove(via_id);
  }
}

