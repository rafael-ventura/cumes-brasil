// Importação da interface IVia.
import {IVia} from "../interfaces/models/IVia";
import {Croqui} from "./Croqui";
import {Montanha} from "./Montanha";

/**
 * Classe Via que implementa a interface IVia.
 * Esta classe representa uma via de escalada com suas propriedades e métodos.
 */
export class Via implements IVia {
    public id: number;
    public nome: string;
    public croquis: Croqui[];
    public id_montanha?: number | null | undefined;
    public grau?: string | null | undefined;
    public crux?: string | null | undefined;
    public artificial?: string | null | undefined;
    public duracao?: string | null | undefined;
    public exposicao?: string | null | undefined;
    public extensao?: number | null | undefined;
    public conquistadores?: string[] | null | undefined;
    public detalhes?: string | null | undefined;
    public data?: Date | null | undefined;
    public id_face?: number | null | undefined;
    public id_fonte?: number | null | undefined;
    public id_viaPrincipal?: number | null | undefined;

    /**
     * Construtor da classe Via.
     * @param {number} id - O identificador único da via
     * @param {string} nome - O nome da via.
     * @param {Croqui[]} croquis - Os croquis da via.
     * @param {number} [id_montanha?] - O identificador da montanha à qual a via pertence (opcional).
     * @param {string} [grau?] - O grau de dificuldade da via (opcional).
     * @param {string} [crux?] - O crux da via (opcional).
     * @param {boolean} [artificial?] - Se a via é artificial ou não (opcional).
     * @param {number} [duracao?] - A duração da via (opcional).
     * @param {string} [exposicao?] - A exposição da via (opcional).
     * @param {number} [extensao?] - A extensão da via (opcional).
     * @param {string[]} [conquistadores?] - Os conquistadores da via (opcional).
     * @param {Date} [data?] - A data de conquista da via (opcional).
     * @param {number} [id_face?] - O identificador da face da montanha à qual a via pertence (opcional).
     * @param {number} [id_fonte?] - O identificador da fonte da via (opcional).
     * @param {number} [id_variante?] - O identificador da via principal da via (opcional). So vai existir se a via for variante.
     **/
    constructor(
        id: number,
        nome: string,
        croquis: Croqui[],
        id_montanha?: number | null | undefined,
        grau?: string | null | undefined,
        crux?: string | null | undefined,
        artificial?: string | null | undefined,
        duracao?: string | null | undefined,
        exposicao?: string | null | undefined,
        extensao?: number | null | undefined,
        conquistadores?: string[] | null | undefined,
        detalhes?: string | null | undefined,
        data?: Date | null | undefined,
        id_face?: number | null | undefined,
        id_fonte?: number | null | undefined,
        id_variante?: number | null | undefined,
    ) {
        this.id = id;
        this.nome = nome;
        this.croquis = croquis;
        if (id_montanha) this.id_montanha = id_montanha;
        if (grau) this.grau = grau;
        if (crux) this.crux = crux;
        if (artificial) this.artificial = artificial;
        if (duracao) this.duracao = duracao;
        if (exposicao) this.exposicao = exposicao;
        if (extensao) this.extensao = extensao;
        if (conquistadores) this.conquistadores = conquistadores;
        if (detalhes) this.detalhes = detalhes;
        if (data) this.data = data;
        if (id_face) this.id_face = id_face;
        if (id_fonte) this.id_fonte = id_fonte;
        if (id_variante) this.id_viaPrincipal = id_variante;
    }

    // Getters e Setters para cada atributo, se necessário.

    /**
     * Getter para o identificador da via.
     * @return {number} O identificador da via.
     */
    getId(): number {
        return this.id;
    }

    /**
     * Getter para o nome da via.
     * @return {string} O nome da via.

     */


    getNome(): string {
        return this.nome;
    }

    /**
     * Setter para o nome da via.
     * @param value
     */

    isArtificial(): boolean {
        return this.artificial === "true";
    }

    /**
     * Associa um croqui à via.
     * @param croqui
     * @return {void}
     */
    associarCroqui(croqui: Croqui): void {
        this.croquis.push(croqui);
    }

    /**
     * Método para representar a instância da classe como uma string.(Útil para logging ou representações simples.)
     * @return {string} Representação da via como string.
     */
    toString(): string {
        return `Via ${this.nome} (ID: ${this.id}, Grau: ${this.grau})`;
    }


}


