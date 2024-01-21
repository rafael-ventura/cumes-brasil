
import {ColecaoBase} from "./ColecaoBase";
import {Via} from "./Via";

export class ColecaoFavoritos extends ColecaoBase {

    constructor(id: number, nome: string, descricao: string, usuarioId: number) {
        super(id, nome, descricao, usuarioId);

    }
}
