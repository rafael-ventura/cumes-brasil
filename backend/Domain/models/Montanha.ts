

export class Montanha {
    id: number;
    nome: string;
    localizacao: string;
    altura: number;
    fonte_id: number;

    constructor(id: number, nome: string, localizacao: string, altura: number, fonteId: number) {

        this.id = id;
        this.nome = nome;
        this.localizacao = localizacao;
        this.altura = altura;
        this.fonte_id = fonteId;
    }
}
