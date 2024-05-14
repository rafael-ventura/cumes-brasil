import { AppDataSource } from "../config/db";
import { Croqui } from "../../Domain/entities/Croqui";
import { In, ObjectLiteral } from "typeorm";

export class CroquiRepository {
  private repository = AppDataSource.getRepository(Croqui);

  async getById (id: number): Promise<Croqui | null> {
    return this.repository.findOne({ where: { id: id }, relations: ["fonte"] });
  }

  async getByIds (ids: number[]): Promise<Croqui[]> {
    return this.repository.findBy({ id: In(ids) });
  }

  async getAll (): Promise<Croqui[]> {
    return this.repository.find({relations: ["fonte"]});
  }

  async create (croqui: Partial<Croqui>): Promise<void> {
    await this.repository.insert(croqui);
  }

  async update (id: number, croquiData: Partial<Croqui>): Promise<void> {
    await this.repository.update(id as any, croquiData);
  }

  async delete (id: number): Promise<void> {
    await this.repository.delete(id as any);
  }

  async getIdsByViaId (via_id: number): Promise<number[] | null> {
    return this.repository.createQueryBuilder("croqui")
      .leftJoin("croqui.vias", "via")
      .where("via.id = :via_id", { via_id })
      .select("croqui.id")
      .getRawMany()
      .then((croquis) => croquis.map(croqui => croqui.id));
  }

  async getByViaId (via_id: number): Promise<ObjectLiteral[]> {
    return this.repository.createQueryBuilder("croqui")
        .leftJoin("croqui.vias", "via")
        .where("via.id = :via_id", { via_id })
        .getRawMany();
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

