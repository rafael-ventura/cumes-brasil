import { Colecao } from "../../../Domain/entities/Colecao";
import { ImagemDTO } from "../Imagem/ImagemDTO";
import { resolverImagemCapaExibicao } from "../../../Application/helpers/colecaoImagemCapaHelper";

export class ColecaoDTO {
    id: number;
    nome: string;
    descricao?: string;
    /** Imagem salva explicitamente como capa (pode ser null no front = só fallback). */
    imagem?: ImagemDTO;
    /** Sempre a URL a mostrar: capa própria ou primeira foto da primeira via (por data_adicao). */
    imagemCapa?: ImagemDTO;
    capaPersonalizada: boolean;
    viaColecoes?: any[];

    constructor(entity: Colecao) {
        this.id = entity.id;
        this.nome = entity.nome;
        this.descricao = entity.descricao;

        this.imagem = entity.imagem ? new ImagemDTO(entity.imagem as any) : undefined;
        this.capaPersonalizada = !!entity.imagem;

        const capa = resolverImagemCapaExibicao(entity);
        this.imagemCapa = capa ? new ImagemDTO(capa as any) : undefined;

        this.viaColecoes = entity.viaColecoes || [];
    }
}
