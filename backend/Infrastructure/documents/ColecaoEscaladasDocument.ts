import {UsuarioDocument} from "./UsuarioDocument";
import {ViaDocument} from "./ViaDocument";
import {ColecaoBaseDocument} from "./ColecaoBaseDocument";

export interface ColecaoEscaladasDocument extends ColecaoBaseDocument {
    DataEscalada: Date;

}
