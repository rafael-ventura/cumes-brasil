import {Croqui} from "../../Domain/models/Croqui";

export interface ViaDocument {
    '@metadata': {
        '@collection': 'Vias'
    };
    Id: number;
    Nome: string;
    Id_Montanha: number;
    Croquis: Croqui[];
    Grau?: string | null;
    Crux?: string | null;
    Artificial?: boolean | null;
    Duracao?: number | null;
    Exposicao?: string | null;
    Extensao?: number | null;
    Conquistadores?: string[] | null;
    Data?: Date | null; // Data no formato ISO para compatibilidade
    Id_Face?: number | null;
    Id_Fonte?: number | null;
    Id_Variante?: number | null;

}

