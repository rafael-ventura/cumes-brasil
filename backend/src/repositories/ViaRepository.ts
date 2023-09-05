import { EntityRepository, Repository } from "typeorm";
import { Via } from "../entities/Via";

@EntityRepository(Via)
export class ViaRepository extends Repository<Via> {

    // Se você precisar de operações customizadas que não são fornecidas pelo Repository do TypeORM,
    // você pode definir aqui. Por exemplo:

    async findById(id: number): Promise<Via | null> {
        return this.findOne(id as any);
    }

    async findAll(take = 10, skip = 0): Promise<Via[]> {
        return this.find({ take, skip });
    }


    // Qualquer outra operação específica relacionada a `Via` que você queira adicionar.
}
