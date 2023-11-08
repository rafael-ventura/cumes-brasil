// Importação das interfaces necessárias.
import { IMontanha } from "../interfaces/models/IMontanha";
import { Via } from "./Via";

/**
 * Classe Montanha que implementa a interface IMontanha.
 * Esta classe representa uma montanha com suas propriedades e métodos.
 */
export class Montanha implements IMontanha {
    id: number;
    nome: string;
    localizacao: string;
    altura: number;
    vias: Via[]; // Supondo que uma montanha possa ter várias vias.

    constructor(id: number, nome: string, localizacao: string, altura: number) {
        this.id = id;
        this.nome = nome;
        this.localizacao = localizacao;
        this.altura = altura;
        this.vias = [];
    }


    getAltura(): number {
        return this.altura;
    }

    getVias(): Via[] {
        return this.vias;
    }

}