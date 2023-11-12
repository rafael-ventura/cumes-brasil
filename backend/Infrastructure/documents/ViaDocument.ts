import {MontanhaDocument} from "./MontanhaDocument";
import {FonteDocument} from "./Fonte";
import {FaceDocument} from "./FaceDocument";
import {CroquiDocument} from "./CroquiDocument";
import {IMontanha} from "../../Domain/interfaces/models/IMontanha";

export interface ViaDocument {
    '@metadata': {
        '@collection': 'Vias'
    };
    Id: number | null | undefined;
    Nome: string | null | undefined;
    Grau?: string | null | undefined;
    Crux?: string | null | undefined;
    Artificial?: string | null | undefined;
    Duracao?: string | null | undefined;
    Exposicao?: string | null | undefined;
    Extensao?: number | null | undefined;
    Conquistadores?: string[] | null | undefined;
    Detalhes?: string | null | undefined;
    Data?: Date | null | undefined;
    Montanha?: MontanhaDocument | null | undefined;
    Face?: FaceDocument;
    Fonte?: FonteDocument;
    Croquis?: CroquiDocument[] | null | undefined;
    Id_Via_Principal?: number | null | undefined;
}
