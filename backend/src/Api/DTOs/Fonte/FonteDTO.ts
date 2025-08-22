import { ImagemDTO } from "../Imagem/ImagemDTO";
import {Fonte} from "../../../Domain/entities/Fonte";

export class FonteDTO {
    id: number;
    autor: string;
    referencia: string;
    imagens?: ImagemDTO[];

    constructor(entity: Fonte) {
        this.id = entity.id;
        this.autor = entity.autor;
        this.referencia = entity.referencia;

        this.imagens = entity.imagens
            ? entity.imagens.map(img => new ImagemDTO(img))
            : undefined;
    }
}
