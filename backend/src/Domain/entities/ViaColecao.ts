import {
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Via } from './Via';
import { Colecao } from './Colecao';
import { BaseEntityWithTimestamps } from './BaseEntityWithTimestamps';

@Entity()
@Index(['via'])
@Index(['colecao'])
@Index(['via', 'colecao'], { unique: true })
export class ViaColecao extends BaseEntityWithTimestamps {
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
