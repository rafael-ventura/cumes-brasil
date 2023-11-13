// Importação das interfaces necessárias.
import {IFace} from "../interfaces/models/IFace";
import {Via} from "./Via";

/**
 * Classe Face que implementa a interface IFace.
 * Esta classe representa uma face de montanha com suas propriedades e métodos.
 */
export class Face implements IFace {
    id: number;
    nome: string;
    vias: Via[];

    constructor(id: number, nome: string, vias: Via[]) {
        this.id = id;
        this.nome = nome;
        this.vias = vias;
    }

    getVias(): Via[] {
        return this.vias;
    }

    toString(): string {
        return this.nome;
    }
}