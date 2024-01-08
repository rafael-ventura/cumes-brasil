import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Via } from './Via'; // Certifique-se de importar corretamente a entidade Via

@Entity()
export class Croqui {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column()
    imagemUrl: string;

    @Column()
    autor: string;

    @Column({ nullable: true })
    descricao: string | null | undefined;

    @ManyToOne(() => Via, (via: Via) => via.id_fonte)
    via: Via | undefined | null;

    constructor(imagemUrl: string, autor: string, descricao?: string | null | undefined) {
        this.imagemUrl = imagemUrl;
        this.autor = autor;
        this.descricao = descricao;
    }

    /**
     * Método para obter a imagem do Croqui.
     */
    getImagem(): string {
        return this.imagemUrl;
    }

    /**
     * Método para definir a imagem do Croqui.
     * @param imagemUrl
     */
    setImagem(imagemUrl: string): void {
        this.imagemUrl = imagemUrl;
    }

    /**
     * Método para obter o autor do Croqui.
     * @returns string
     */
    getAutor(): string {
        return this.autor;
    }

    /**
     * Método para adicionar uma Via ao Croqui.
     * @param via
     */
    adicionarVia(via: Via): void {
        this.via = via;
    }

    /**
     * Método para remover uma Via do Croqui.
     */
    removerVia(): void {
        this.via = null;
    }

    toString(): string {
        return `Croqui: ${this.id} - ${this.autor} - ${this.imagemUrl} - ${this.descricao}`;
    }
}
