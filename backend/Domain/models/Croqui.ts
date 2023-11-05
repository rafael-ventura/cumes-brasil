import {ICroqui} from "../interfaces/ICroqui";
import {Via} from "./Via";

/**
 * Classe Croqui que implementa a interface ICroqui.
 * Esta classe representa um croqui de uma via de escalada.
 */
export class Croqui implements ICroqui {
    id: number;
    private imagemUrl: string;
    autor: string;
    descricao: string;
    vias: Via[];

    constructor(
        id: number,
        imagemUrl: string,
        autor: string,
        descricao: string,
        vias: Via[]
    ) {
        this.id = id;
        this.autor = autor;
        this.imagemUrl = imagemUrl;
        this.descricao = descricao;
        this.vias = vias;
        this.vias.map(via => via.associarCroqui(this));
    }

    /**
     * Método para obter a imagem do Croqui.
     */
    getImagem(): string {
        return this.imagemUrl;
    }

    /**
     * Método para definir a imagem do Croqui.
     * @param imagemUrl
     */
    setImagem(imagemUrl: string): void {
        this.imagemUrl = imagemUrl;
    }

    /**
     * Método para obter o autor do Croqui.
     * @returns string
     * @returns void
     */
    getAutor(): string {
        return this.autor;
    }

    /**
     * Método para adicionar uma Via ao Croqui.
     * @param via
     * @returns void
     */
    adicionarVia(via: Via): void {
        this.vias.push(via);
    }

    /**
     * Método para remover uma Via do Croqui.
     * @param via
     * @returns void
     */
    getVias(): Via[] {
        return this.vias;
    }


    toString(): string {
        return `Croqui: ${this.id} - ${this.autor} - ${this.imagemUrl} - ${this.descricao}`;
    }
}