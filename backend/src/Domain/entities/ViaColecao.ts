import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Via } from './Via';
import { Colecao } from './Colecao';

@Entity()
export class Via_Colecao {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Via, via => via.colecoes)
    via: Via;

    @ManyToOne(() => Colecao, colecao => colecao.vias)
    colecao: Colecao;

    @CreateDateColumn()
    data_adicao: Date;
}