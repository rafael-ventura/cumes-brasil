// Importação das interfaces necessárias.
import {IMontanha} from "../interfaces/models/IMontanha";
import {Via} from "./Via";
import {Face} from "./Face";

/**
 * Classe Montanha que implementa a interface IMontanha.
 * Esta classe representa uma montanha com suas propriedades e métodos.
 */
export class Montanha implements IMontanha {
    id: number;
    nome: string;
    localizacao: string;
    altura: number;
    faces: Face[]; // Supondo que uma montanha possa ter várias faces.
    vias: Via[]; // Supondo que uma montanha possa ter várias vias.

    constructor(id: number, nome: string, localizacao: string, altura: number) {
        this.id = id;
        this.nome = nome;
        this.localizacao = localizacao;
        this.altura = altura;
        this.faces = [];
        this.vias = [];
    }


    getAltura(): number {
        return this.altura;
    }

    getVias(): Via[] {
        return this.vias;
    }

    getFaces(): Face[] {
        return this.faces;
    }

    /**
     * Método que associa uma via à montanha.
     * @param {Via} via - A via a ser associada.
     */
    associarVia(via: Via): void {
        this.vias.push(via);
    }

    /**
     * Método que associa uma face à montanha.
     * @param {Face} face - A face a ser associada.
     */
    associarFace(face: Face): void {
        this.faces.push(face);
    }


}