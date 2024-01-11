import {Via} from "../../entities/Via";
import {Montanha} from "../../entities/Montanha";

export interface IMontanha {
    id?: number;
    nome?: string;
    localizacao?: string;
    altura?: number;
    vias?: Via[];


    getAltura?(): number;
    getVias?(): Via[];
}