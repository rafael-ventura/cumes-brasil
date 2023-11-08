import {ViaDocument} from "./ViaDocument";

export interface MontanhaDocument {
    '@metadata': {
        '@collection': 'Montanhas'
    };
    Id: number;
    Nome: string;
    Altura: number;
    Localizacao: string;
}
