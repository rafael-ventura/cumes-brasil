// Importação da interface IVia.
import {IVia} from "../interfaces/models/IVia";
import {Croqui} from "./Croqui";
import {Montanha} from "./Montanha";
import {IMontanha} from "../interfaces/models/IMontanha";

/**
 * Classe Via que implementa a interface IVia.
 * Esta classe representa uma via de escalada com suas propriedades e métodos.
 */
export class Via implements IVia {
    public id: number;
    public nome: string;
    public croquis?: Croqui[] | null | undefined;
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
     * @param montanha
     * @param grau
     * @param crux
     * @param artificial
     * @param duracao
     * @param exposicao
     * @param extensao
     * @param conquistadores
     * @param detalhes
     * @param data
     * @param id_face
     * @param id_fonte
     * @param id_variante
     **/
    constructor(
        id: number,
        nome: string,
        croquis?: Croqui[] | null | undefined,
        montanha?: number | null | undefined,
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
        if (montanha) this.id_montanha = montanha;
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


    getNome(): string | null | undefined {
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
        if (!this.croquis) {
            this.croquis = [];
        }
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


