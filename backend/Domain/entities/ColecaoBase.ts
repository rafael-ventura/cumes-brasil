import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Via } from './Via';
import { Usuario } from './Usuario';

@Entity()
export class ColecaoBase {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome: string | undefined;

    @Column()
    descricao: string | undefined;

    @ManyToOne(() => Usuario, usuario => usuario.colecoesPersonalizadas)
    usuario: Usuario | undefined;

    @ManyToMany(() => Via, via => via.colecoes)
    @JoinTable()
    vias: Via[] | undefined;
}

