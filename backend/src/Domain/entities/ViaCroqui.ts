import {CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Via} from './Via';
import {Croqui} from './Croqui';
import { BaseEntityWithTimestamps } from './BaseEntityWithTimestamps';

@Entity()
export class ViaCroqui extends BaseEntityWithTimestamps {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Via, via => via.viaCroquis)
    @JoinColumn({name: 'via_id'})
    via: Via;

    @ManyToOne(() => Croqui, croqui => croqui.viaCroquis)
    @JoinColumn({name: 'croqui_id'})
    croqui: Croqui;

    @CreateDateColumn()
    data_adicao: Date;
}
