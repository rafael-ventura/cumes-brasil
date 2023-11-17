import {ColecaoEscaladasDocument} from "./ColecaoEscaladasDocument";
import {ColecaoFavoritosDocument} from "./ColecaoFavoritosDocument";
import {ColecaoBaseDocument} from "./ColecaoBaseDocument";

export interface UsuarioDocument {
    '@metadata': {
        '@collection': 'Usuarios'
    };
    Id: number;
    Nome: string;
    Email: string;
    Colecoes: ColecaoBaseDocument[];
    ColecoesFavoritos: ColecaoFavoritosDocument[];
    ColecoesEscaladas: ColecaoEscaladasDocument[];

}
