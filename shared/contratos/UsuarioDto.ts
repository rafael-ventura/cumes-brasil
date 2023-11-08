import {ViaDto} from "./ViaDto";

export interface UsuarioDTO {
    Id: number; // Formato "usuario/U-1"
    nome: string;
    email: string;
    colecoes: ColecaoDTO[];
    historico: HistoricoDTO[];
    favoritos: FavoritoDTO[];

}

export interface ColecaoDTO {
    Id: number;
    Nome: string;
    Descricao: string;
    Vias: ViaDto[];
}

export interface HistoricoDTO extends ColecaoDTO {
    data: Date;
}

export interface FavoritoDTO extends ColecaoDTO {}



