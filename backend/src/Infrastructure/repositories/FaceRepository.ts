import { Face } from "../../Domain/entities/Face";
import BaseRepository from "./BaseRepository";

export class FaceRepository extends BaseRepository<Face> {
    constructor() {
        super(Face);
    }

    async getById (id: number): Promise<Face | null> {
        return this.repository.createQueryBuilder("face")
          .leftJoinAndSelect("face.montanha", "montanha")
          .leftJoinAndSelect("face.fonte", "fonte")
          .where("face.id = :id", { id })
          .getOne();

    }

    async getAll (): Promise<Face[]> {
        return this.repository.createQueryBuilder("face")
          .leftJoinAndSelect("face.montanha", "montanha")
          .leftJoinAndSelect("face.fonte", "fonte")
          .getMany();
    }

    // create/update/delete herdados do BaseRepository
}
