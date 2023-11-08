import {ViaDocument} from "./ViaDocument";

export interface ColecaoBaseDocument {
    Id: number;
    Nome: string;
    Descricao: string;
    Vias: ViaDocument[];
}