// models/Face.ts


export class Face {
    id: number;
    nome: string;
    montanha_id: number;
    fonte_id?: number;

    constructor(id: number, nome: string, montanhaId: number, fonteId?: number) {
        this.id = id;
        this.nome = nome;
        this.montanha_id = montanhaId;
        this.fonte_id = fonteId;
    }
}
