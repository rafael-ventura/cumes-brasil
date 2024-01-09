import { Entity, OneToMany, ManyToOne, JoinTable } from 'typeorm';
import { Via } from './Via';
import { ColecaoBase } from './ColecaoBase';

@Entity()
export class ColecaoEscaladas extends ColecaoBase {
    //TODO: revisar
    @OneToMany(() => Via, via => via.colecaoEscaladas)
    @JoinTable() // Adiciona isso se não estiver usando TypeORM com reflect-metadata
    viasEscaladas: Via[];

    // Utilizando um Map para armazenar as datas associadas a cada via
    datasEscalada: Map<number, Date[]> = new Map();

    constructor() {
        super('Histórico', 'Minhas vias escaladas');
        this.descricaoFormatada();
        this.viasEscaladas = [];
    }

    public registrarEscalada(via: Via, data: Date): void {
        if (!this.viasEscaladas.includes(via)) {
            this.adicionarVia(via);
        }

        let datas = this.datasEscalada.get(via.id) || [];
        datas.push(data);
        this.datasEscalada.set(via.id, datas);
    }
}
