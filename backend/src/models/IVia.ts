export interface IVia {
    id?: number;
    nome?: string;
    grau?: string | null;
    crux?: string | null;
    artificial?: string | null;
    duracao?: string | null;
    exposicao?: string | null;
    extensao?: string | null;
    conquistadores?: string | null;
    data?: Date | null;
    id_montanha?: number;
    id_face?: number | null;
    id_fonte?: number;
    id_variante?: number | null;
    id_croqui?: number | null;
}
export class Via implements IVia {
    id?: number;
    nome?: string;
    grau?: string | null;
    crux?: string | null;
    artificial?: string | null;
    duracao?: string | null;
    exposicao?: string | null;
    extensao?: string | null;
    conquistadores?: string | null;
    data?: Date | null;
    id_montanha?: number;
    id_face?: number | null;
    id_fonte?: number;
    id_variante?: number | null;
    id_croqui?: number | null;
    constructor() {}
}
