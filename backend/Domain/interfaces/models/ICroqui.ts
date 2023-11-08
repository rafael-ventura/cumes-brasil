import {Via} from "../../models/Via";

export interface ICroqui {
    id: number;
    imagemUrl: string;
    autor: string;
    descricao?: string | null | undefined;

    getImagem(): string;

    setImagem(imagemUrl: string): void;

    getAutor(): string;

}