import { Entity, Column, ManyToMany } from 'typeorm';
import { Via } from './Via';
import { ColecaoBase } from './ColecaoBase';

@Entity()
export class ColecaoFavoritos extends ColecaoBase {
    @ManyToMany(() => Via, via => via.colecoesFavoritas)
    viasFavoritas: Via[];

    constructor() {
        super('Favoritos');
        this.descricaoFormatada();
        this.viasFavoritas = [];
    }
}
