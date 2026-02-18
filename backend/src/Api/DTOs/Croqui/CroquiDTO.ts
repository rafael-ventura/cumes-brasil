import { ImagemDTO } from '../Imagem/ImagemDTO';
import {Croqui} from "../../../Domain/entities/Croqui";

export class CroquiDTO {
    id: number;
    nome: string;
    legenda?: string;
    imagem?: ImagemDTO;

    constructor(entity: Croqui) {
        this.id = entity.id;
        this.nome = entity.nome;
        this.legenda = entity.legenda;
        this.imagem = entity.imagem ? new ImagemDTO(entity.imagem as any) : undefined;
    }
}
