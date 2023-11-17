import {ICroqui} from "../interfaces/models/ICroqui";
import {Via} from "./Via";

/**
 * Classe Croqui que implementa a interface ICroqui.
 * Esta classe representa um croqui de uma via de escalada.
 */
export class Croqui implements ICroqui {
    id: number;
    imagemUrl: string;
    autor: string;
    descricao?: string | null | undefined;


    constructor(
        id: number,
        imagemUrl: string,
        autor: string,
        descricao?: string | null | undefined
    ) {
        this.id = id;
        this.autor = autor;
        this.imagemUrl = imagemUrl;
        this.descricao = descricao;
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

    /**
     * Método para remover uma Via do Croqui.
     * @param via
     * @returns void
     */


    toString(): string {
        return `Croqui: ${this.id} - ${this.autor} - ${this.imagemUrl} - ${this.descricao}`;
    }
}