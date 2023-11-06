/**
 * Interface IVia que define a estrutura de uma via de escalada.
 * Deve refletir todos os atributos e métodos públicos da classe Via.
 */
import {Croqui} from "../models/Croqui";

export interface IVia {
    id: number;
    nome: string;
    grau?: string;
    crux?: string;
    artificial?: boolean;
    duracao?: number;
    exposicao?: string;
    extensao?: number;
    conquistadores?: string[];
    data?: Date;
    id_montanha: number;
    id_face?: number;
    id_fonte?: number;
    id_variante?: number;
    croquis: Croqui[];

    getId(): number;
    getNome(): string;
    isArtificial(): boolean;
    associarCroqui(croqui: Croqui): void;
    toString(): string;



}
