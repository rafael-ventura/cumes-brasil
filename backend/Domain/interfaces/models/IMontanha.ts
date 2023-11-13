import {Via} from "../../models/Via";

export interface IMontanha {
    id: number;
    nome: string;
    localizacao: string;
    altura: number;
    vias: Via[];

    getAltura(): number;

    getVias(): Via[];
}