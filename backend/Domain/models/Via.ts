// Importação da interface IVia.
import {IVia} from "../interfaces/models/IVia";
import {Croqui} from "./Croqui";

/**
 * Classe Via que implementa a interface IVia.
 * Esta classe representa uma via de escalada com suas propriedades e métodos.
 */
export class Via implements IVia {
    /**
     * Construtor da classe Via.
     * @param {number} [id] - O identificador único da via (opcional).
     * @param {string} nome - O nome da via.
     * @param {number} id_montanha - O identificador da montanha à qual a via pertence.
     * @param {Croqui[]} croquis - Os croquis da via.
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
     * @param {number} [id_variante?] - O identificador da variante da via (opcional).
     **/
    constructor(
        public id: number,
        public nome: string,
        public id_montanha: number,
        public croquis: Croqui[],
        public grau?: string | null | undefined,
        public crux?: string | null | undefined,
        public artificial?: boolean | null | undefined,
        public duracao?: number | null | undefined,
        public exposicao?: string | null | undefined,
        public extensao?: number | null | undefined,
        public conquistadores?: string[] | null | undefined,
        public data?: Date | null | undefined,
        public id_face?: number | null | undefined,
        public id_fonte?: number | null | undefined,
        public id_variante?: number | null | undefined,
    ) {
        this.nome = nome;
        this.id_montanha = id_montanha;
        this.id = id;
        this.croquis = croquis;
        if (grau) this.grau = grau;
        if (crux) this.crux = crux;
        if (artificial) this.artificial = artificial;
        if (duracao) this.duracao = duracao;
        if (exposicao) this.exposicao = exposicao;
        if (extensao) this.extensao = extensao;
        if (conquistadores) this.conquistadores = conquistadores;
        if (data) this.data = data;
        if (id_face) this.id_face = id_face;
        if (id_fonte) this.id_fonte = id_fonte;
        if (id_variante) this.id_variante = id_variante;
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
        return this.artificial ?? false;
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


