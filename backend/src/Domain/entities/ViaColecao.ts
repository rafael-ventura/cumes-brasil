import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    ObjectLiteral,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Via } from './Via';
import { Colecao } from './Colecao';

@Entity()
export class ViaColecao extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Via, via => via.viaColecoes)
    @JoinColumn({ name: 'viaId' })
    via: Via;

    @ManyToOne(() => Colecao, colecao => colecao.viaColecoes)
    @JoinColumn({ name: 'colecaoId' })
    colecao: Colecao;

    @CreateDateColumn()
    data_adicao: Date;
}
