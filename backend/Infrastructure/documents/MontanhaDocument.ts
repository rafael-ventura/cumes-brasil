import {ViaDocument} from "./ViaDocument";

export interface MontanhaDocument {
    '@metadata': {
        '@collection': 'Montanhas'
    };
    Id?: number | null;
    Nome?: string | null;
    Altura?: number | null;
    Localizacao?: string | null;
}
