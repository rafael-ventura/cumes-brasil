import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Via } from './Via';
import { Colecao } from './Colecao';

@Entity()
export class ViaColecao extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Via, via => via.viaColecoes)
    via: Via;

    @ManyToOne(() => Colecao, colecao => colecao.viaColecoes)
    colecao: Colecao;

    @CreateDateColumn()
    data_adicao: Date;
}
