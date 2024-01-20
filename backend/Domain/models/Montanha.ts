// models/Montanha.ts

import {Face} from "./Face";

export class Montanha {
    id: number;
    nome: string;
    localizacao: string;
    altura: number | undefined;
    faces: Face[] | undefined; // Assumindo que você terá uma model para Face

    constructor(id: number, nome: string, localizacao: string, altura: number | undefined, faces: Face[] | undefined) {
        this.id = id;
        this.nome = nome;
        this.localizacao = localizacao;
        this.altura = altura;
        this.faces = faces;
    }
}
