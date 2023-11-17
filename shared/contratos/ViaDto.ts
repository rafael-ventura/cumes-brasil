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
    montanha?: MontanhaDTO | null | undefined;
    face?: FaceDTO | null | undefined;
    fonte?: FonteDto | null | undefined;
    croquis: CroquiDTO[];
    id_via_principal?: number | null | undefined;
}

export interface FonteDto {
    id: number | null | undefined;
    referencia: string;
}

export interface MontanhaDTO {
    id: number | null | undefined;
    nome: string;
    localizacao: string;
    altura: number;
}

export interface FaceDTO {
    id: number | null | undefined;
    nome: string;
}

export interface CroquiDTO {
    id: number | null | undefined;
    imagemUrl: string;
    autor: string;
    descricao?: string | null | undefined;
}
