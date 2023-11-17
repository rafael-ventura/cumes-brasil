import {Via} from "../../models/Via";
import {Montanha} from "../../models/Montanha";

export interface IMontanha {
    id?: number;
    nome?: string;
    localizacao?: string;
    altura?: number;
    vias?: Via[];


    getAltura?(): number;
    getVias?(): Via[];
}