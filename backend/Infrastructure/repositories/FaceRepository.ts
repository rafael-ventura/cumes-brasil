import { Face } from "../../Domain/entities/Face";
import { AppDataSource } from "../config/db";

export class FaceRepository {
    private repository = AppDataSource.getRepository(Face);

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

    async create (face: Partial<Face>): Promise<void> {
        await this.repository.insert(face);
    }

    async update (id: number, faceData: Partial<Face>): Promise<void> {
        await this.repository.update(id as any, faceData);
    }

    async delete (id: number): Promise<void> {
        await this.repository.delete(id as any);
    }
}
