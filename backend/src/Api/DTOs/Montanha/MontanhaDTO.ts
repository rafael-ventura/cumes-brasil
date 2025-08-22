import {ImagemDTO} from "../Imagem/ImagemDTO";
import {Montanha} from "../../../Domain/entities/Montanha";

export class MontanhaDTO {
    id: number;
    nome: string;
    bairro?: string;
    altura?: number;
    imagem?: ImagemDTO;

    constructor(entity: Montanha) {
        this.id = entity.id;
        this.nome = entity.nome;
        this.bairro = entity.bairro;
        this.altura = entity.altura;

        this.imagem = entity.imagem
            ? new ImagemDTO(entity.imagem as any)
            : undefined;
    }
}
