import {IVia} from "./IVia";

export interface IColecaoBase {
    id: number;
    nome: string;
    descricao: string;
    vias: IVia[];

    adicionarVia(via: IVia): void;

    removerVia(via: IVia): void;

    getViaById(id: number): IVia | undefined;
}