import {Via} from "./Via";

export class Fonte {
    id: number;
    private vias: Via[];
    referencia: string;

    constructor(id: number ,vias: Via[], referencia: string) {
        this.id = id;
        this.vias = vias;
        this.referencia = referencia;
    }

    public getViaById(id: number): Via | undefined {
        return this.vias.find(via => via.getId() === id);
    }

    public getVias(): Via[] {
        return this.vias;
    }

    public adicionarVia(via: Via): void {
        this.vias.push(via);
    }

    public removerVia(via: Via): void {
        this.vias = this.vias.filter(v => v.getId() !== via.getId());
    }

    public getReferencia(): string {
        return this.referencia;
    }

    // Pode adicionar métodos para atualizar, deletar, e adicionar vias conforme a necessidade
}
