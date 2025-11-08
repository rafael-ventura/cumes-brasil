import { ImagemDTO } from "../Imagem/ImagemDTO";
import {Fonte} from "../../../Domain/entities/Fonte";

export class FonteDTO {
    id: number;
    autor: string;
    referencia: string;
    imagens?: ImagemDTO[];

    constructor(entity: Fonte, includeImages: boolean = false) {
        this.id = entity.id;
        this.autor = entity.autor;
        this.referencia = entity.referencia;

        // Incluir imagens apenas quando necessário (evita payload pesado)
        if (includeImages && entity.imagens) {
            this.imagens = entity.imagens.map(img => new ImagemDTO(img));
        }
    }
}
