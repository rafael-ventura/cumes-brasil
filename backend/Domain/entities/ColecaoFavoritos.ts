import { Entity, ManyToMany, JoinTable } from 'typeorm';
import { Via } from './Via';
import { ColecaoBase } from './ColecaoBase';

@Entity()
export class ColecaoFavoritos extends ColecaoBase {
    @ManyToMany(() => Via)
    @JoinTable()
    viasFavoritas: Via[];
}

