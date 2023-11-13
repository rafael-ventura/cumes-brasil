export interface UsuarioDTO {
    id: string; // Formato "usuario/U-1"
    nome: string;
    email: string;
    colecoes: ColecaoDTO[];
}

export interface ColecaoDTO {
    nome: string;
    tipo_colecao: string;
    vias: string[]; // Array de IDs no formato "vias/V-1"
}
