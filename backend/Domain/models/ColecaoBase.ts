import {Via} from "./Via";
import {IColecaoBase} from "../interfaces/models/IColecaoBase";

export class ColecaoBase implements IColecaoBase {
    id: number;
    nome: string;
    descricao: string;
    private _vias: Via[];

    constructor(nome: string = '', descricao: string = '', vias: Via[] = []) {
        this.id = this.generateId();
        this.nome = nome || '';
        this.descricao = descricao;
        this._vias = vias;
    }

    get quantidadeVias(): number {
        return this._vias.length;
    }

    descricaoMethod(descricao: string) {
         this.descricao = descricao;
    }

    get vias(): Via[] {
        return this._vias;
    }

    set vias(value: Via[]) {
        this._vias = value;
    }

    private generateId(): number {
        return Math.random();
    }

    public adicionarVia(via: Via): void {
        this._vias.push(via);
    }

    public removerVia(via: Via): void {
        this._vias = this._vias.filter(v => v.id !== via.id);
    }

    public getViaById(id: number): Via | undefined {
        return this._vias.find(via => via.id === id);
    }
}
