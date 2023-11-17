import {ViaDocument} from "./ViaDocument";

export interface ColecaoBaseDocument {
    '@metadata': {
        '@collection': 'ColecaoBase'
    };
    Id: number;
    Nome: string;
    Descricao: string;
    Vias: ViaDocument[];
}