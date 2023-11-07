import {Via} from "../../models/Via";

export interface IColecaoEscaladas {

    registrarEscalada(via: Via, data: Date): void;

    getDatasEscalada(viaId: number): Date[];

}