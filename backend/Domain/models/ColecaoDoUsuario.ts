import {Via} from "./Via";
import {ColecaoBase} from "./ColecaoBase";
import {IColecaoDoUsuario} from "../interfaces/IColecaoUsuario";

export class ColecaoDoUsuario extends ColecaoBase implements IColecaoDoUsuario {
    constructor(nome: string, descricao: string) {
        super(nome, descricao);
    }

}
