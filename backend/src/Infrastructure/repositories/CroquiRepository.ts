import { Croqui } from "../../Domain/entities/Croqui";
import BaseRepository from "./BaseRepository";
import { ICrudRepository } from "../../Domain/interfaces/repositories/ICrudRepository";

export class CroquiRepository extends BaseRepository<Croqui> implements ICrudRepository<Croqui> {
  constructor() {
    super(Croqui);
  }

  async getById (id: number, relations?: string[]): Promise<Croqui | null> {
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

  async getIdsByViaId (via_id: number): Promise<number[] | null> {
    return this.repository.createQueryBuilder("croqui")
      .leftJoin("croqui.viaCroquis", "viaCroquis")
      .leftJoin("viaCroquis.via", "via")
      .where("via.id = :via_id", { via_id })
      .select("croqui.id")
      .getRawMany()
      .then((croquis) => croquis.map(croqui => croqui.id));
  }

  async getByViaId(via_id: number): Promise<Croqui[]> {
    return this.repository.createQueryBuilder("croqui")
        .leftJoinAndSelect("croqui.fonte", "fonte")
        .leftJoinAndSelect("croqui.imagem", "imagem")
        .leftJoin("croqui.viaCroquis", "viaCroquis")
        .leftJoin("viaCroquis.via", "via")
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

