/**
 * Interface IVia que define a estrutura de uma via de escalada.
 * Deve refletir todos os atributos e métodos públicos da classe Via.
 */
import {Croqui} from "../../models/Croqui";

export interface IVia {
    id: number;
    nome: string;
    id_montanha: number;
    croquis: Croqui[];
    grau?: string | null | undefined;
    crux?: string | null | undefined;
    artificial?: boolean | null | undefined;
    duracao?: number | null | undefined;
    exposicao?: string | null | undefined;
    extensao?: number | null | undefined;
    conquistadores?: string[] | null | undefined;
    data?: Date | null | undefined;
    id_face?: number | null | undefined;
    id_fonte?: number | null | undefined;
    id_variante?: number | null | undefined;

    getId(): number;
    getNome(): string;
    isArtificial(): boolean;
    associarCroqui(croqui: Croqui): void;
    toString(): string;



}
