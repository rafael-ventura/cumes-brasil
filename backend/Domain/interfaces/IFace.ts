import {Via} from "../models/Via";

export interface IFace {
    id: number;
    nome: string;
    vias: Via[];


    getVias(): Via[];
}