import { ImagemDTO } from '../Imagem/ImagemDTO';
import {Croqui} from "../../../Domain/entities/Croqui";

export class CroquiDTO {
    id: number;
    nome: string;
    imagem?: ImagemDTO;

    constructor(entity: Croqui) {
        this.id = entity.id;
        this.nome = entity.nome;

        this.imagem = entity.imagem ? new ImagemDTO(entity.imagem as any) : undefined;
    }
}
