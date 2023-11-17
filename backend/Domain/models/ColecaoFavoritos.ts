import {Via} from "./Via";
import {ColecaoBase} from "./ColecaoBase";
import {IColecaoFavoritos} from "../interfaces/models/IColecaoFavoritos";

export class ColecaoFavoritos extends ColecaoBase implements IColecaoFavoritos {

    constructor() {
        super('Favoritos');
        this.descricaoFormated('');
    }

    public descricaoFormated(descricao: string): string {
        return `${super.descricaoMethod(descricao)} ${this.quantidadeVias}`;
    }


    /*
    *
    * front ( envia uma lista de Vias )
    *
    * back- recebe essa lista e
    * Ao salvar usuario, criar 2 colecoes vazias (escaldas e favoritos)
    * */

}
