import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Via } from './Via';

@Entity()
export class ColecaoBase {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column()
    nome: string;

    @Column()
    descricao: string;

    @OneToMany(() => Via, via => via.colecaoBase)
    vias: Via[];

    constructor(nome: string = '', descricao: string = '') {
        this.nome = nome;
        this.descricao = descricao;
        this.vias = [];
    }

    public get quantidadeVias(): string {
        return `(${this.vias.length} vias)`;
    }

    public descricaoFormatada(): string {
        return `${this.descricao} ${this.quantidadeVias}`;
    }


    public adicionarVia(via: Via): void {
        this.vias.push(via);
    }

    public removerVia(via: Via): void {
        this.vias = this.vias.filter(v => v.id !== via.id);
    }

    public getViaById(id: number): Via | undefined {
        return this.vias.find(via => via.id === id);
    }
}
