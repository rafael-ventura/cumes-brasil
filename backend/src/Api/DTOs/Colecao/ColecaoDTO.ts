import { Colecao } from "../../../Domain/entities/Colecao";
import { ImagemDTO } from "../Imagem/ImagemDTO";

/**
 * DTO de Coleção para listagens.
 */
export class ColecaoDTO {
    id: number;
    nome: string;
    descricao?: string;
    imagem?: ImagemDTO;
    viaColecoes?: any[];
    totalVias: number;

    constructor(entity: Colecao) {
        this.id = entity.id;
        this.nome = entity.nome;
        this.descricao = entity.descricao;

        this.imagem = entity.imagem ? new ImagemDTO(entity.imagem as any) : undefined;
        this.viaColecoes = entity.viaColecoes || [];
        
        this.totalVias = entity.viaColecoes?.length || 0;
    }
}
