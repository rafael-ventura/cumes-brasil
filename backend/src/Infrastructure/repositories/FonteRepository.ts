import { Fonte } from "../../Domain/entities/Fonte";
import BaseRepository from "./BaseRepository";

export class FonteRepository extends BaseRepository<Fonte> {
    constructor() {
        super(Fonte);
    }

    // Sem métodos específicos além do CRUD por enquanto
}
