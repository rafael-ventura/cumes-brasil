import {Via} from "./Via";
import {ColecaoBase} from "./ColecaoBase";
import {IColecaoFavoritos} from "../interfaces/IColecaoFavoritos";

export class ColecaoFavoritos extends ColecaoBase implements IColecaoFavoritos {
    constructor() {
        super('Favoritos', 'Minhas vias favoritas');
    }


}
