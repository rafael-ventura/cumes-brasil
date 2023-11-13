export interface ViaDto {
    id: number; // Formato "via/V-1"
    nome: string;
    grau: string;
    crux: string;
    artificial: boolean;
    duracao: number;
    exposicao: string;
    extensao: number;
    conquistadores: string[];
    detalhes: string;
    fonte: FonteDto;
    variante: VarianteDTO;
    montanha: MontanhaDTO;
    face: FaceDTO;
    data: Date;
    croqui: CroquiDTO[];
}


export interface FonteDto {
    id: number;
    referencia: string;
}

export interface VarianteDTO {
    id: number; // Formato "variante/VA-1"
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
