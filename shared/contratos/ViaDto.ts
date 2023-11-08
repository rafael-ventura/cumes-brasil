export interface ViaDto {
    id: number;
    nome: string;
    grau?: string | null | undefined;
    crux?: string | null | undefined;
    artificial?: string | null | undefined;
    duracao?: string | null | undefined;
    exposicao?: string | null | undefined;
    extensao?: number | null | undefined;
    conquistadores?: string[] | null | undefined;
    detalhes?: string | null | undefined;
    data?: Date | null | undefined;
    montanha?: number | null | undefined;
    face?: number | null | undefined;
    fonte?: number | null | undefined;
    croquis: CroquiDTO[];
    id_via_principal?: number | null | undefined;
}


export interface FonteDto {
    id: number;
    referencia: string;
}

export interface VarianteDTO {
    fk_variante: number; // Formato "via/V-2"
}

export interface MontanhaDTO {
    id: number; // Formato "montanha/M-1"
    nome: string;
    altitude: number;
}

export interface FaceDTO {
    id: number; // Formato "face/F-1"
    nome: string;
    altitude: number;
}

export interface CroquiDTO {
    id: number; // Formato "croqui/C-1"
    caminho_imagem: string;
    autor: string;
    descricao: string;
}
