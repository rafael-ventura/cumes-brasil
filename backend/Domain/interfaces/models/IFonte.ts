import {IVia} from "./IVia";

export interface IFonte {
    id: number;
    referencia: string;

    getViaById(id: number): IVia | undefined;

    getVias(): IVia[];

    adicionarVia(via: IVia): void;

    removerVia(via: IVia): void;

    getReferencia(): string;
}