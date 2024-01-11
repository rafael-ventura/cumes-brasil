import {Via} from "../../entities/Via";

export interface IFace {
    id: number;
    nome: string;
    vias: Via[];


    getVias(): Via[];
}