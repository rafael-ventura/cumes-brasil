import {MontanhaDocument} from "./MontanhaDocument";
import {FonteDocument} from "./Fonte";
import {FaceDocument} from "./FaceDocument";
import {CroquiDocument} from "./CroquiDocument";

export interface ViaDocument {
    '@metadata': {
        '@collection': 'Vias'
    };
    Id: number;
    Nome: string;
    Grau?: string | null | undefined;
    Crux?: string | null | undefined;
    Artificial?: string | null | undefined;
    Duracao?: string | null | undefined;
    Exposicao?: string | null | undefined;
    Extensao?: number | null | undefined;
    Conquistadores?: string[] | null | undefined;
    Detalhes?: string | null | undefined;
    Data?: Date | null | undefined;
    Montanha: MontanhaDocument;
    Face: FaceDocument;
    Fonte: FonteDocument;
    Croquis: CroquiDocument[];
    Id_Via_Principal?: number | null | undefined;
}
