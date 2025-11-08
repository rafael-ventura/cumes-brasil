import { Face } from "../../../Domain/entities/Face";

export class FaceDTO {
    id: number;
    nome: string;
    fantasia?: string;

    constructor(entity: Face) {
        this.id = entity.id;
        this.nome = entity.nome;
        this.fantasia = entity.fantasia;
    }
}

