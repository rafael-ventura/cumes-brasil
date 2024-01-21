

export class Montanha {
    id: number;
    nome: string;
    localizacao: string;
    altura: number | undefined;
    fonteId: number | undefined;

    constructor(id: number, nome: string, localizacao: string, altura: number | undefined, fonteId: number | undefined) {

        this.id = id;
        this.nome = nome;
        this.localizacao = localizacao;
        this.altura = altura;
        this.fonteId = fonteId;
    }
}
