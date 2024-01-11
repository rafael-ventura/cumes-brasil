import {Via} from "../../entities/Via";

export interface IColecaoEscaladas {

    registrarEscalada?(via: Via, data: Date): void;

    getDatasEscalada?(viaId: number): Date[];

}