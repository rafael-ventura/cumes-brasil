import { ImagemDTO } from "../Imagem/ImagemDTO";
import {Via} from "../../../Domain/entities/Via";

export class ViaDTO {
    id: number;
    nome: string;
    grau?: string;
    extensao?: number;
    conquistadores?: string;
    detalhes?: string;
    data?: string;

    imagem?: ImagemDTO;
    montanhaId?: number;
    faceId?: number;

    constructor(entity: Via) {
        this.id = entity.id;
        this.nome = entity.nome;
        this.grau = entity.grau;
        this.extensao = entity.extensao ? Number(entity.extensao) : undefined;
        this.conquistadores = entity.conquistadores;
        this.detalhes = entity.detalhes;
        this.data = entity.data;

        // imagem (transforma para URL final)
        this.imagem = entity.imagem
            ? new ImagemDTO(entity.imagem as any)
            : undefined;

        // se quiser simplificar as relações (não trazer objeto inteiro)
        this.montanhaId = (entity.montanha as any)?.id ?? entity.montanha;
        this.faceId = (entity.face as any)?.id ?? entity.face;
    }
}
