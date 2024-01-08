import { Entity, Column, ManyToMany } from 'typeorm';
import { Via } from './Via';
import { ColecaoBase } from './ColecaoBase';

@Entity()
export class ColecaoFavoritos extends ColecaoBase {
    @ManyToMany(() => Via, via => via.colecoesFavoritas)
    viasFavoritas: Via[];

    constructor() {
        super('Favoritos');
        this.descricaoFormated('');
        this.viasFavoritas = [];
    }

    public descricaoFormated(descricao: string): string {
        return `${super.descricaoMethod(descricao)} ${this.quantidadeVias}`;
    }

    // Pode adicionar mais métodos conforme necessário
}
