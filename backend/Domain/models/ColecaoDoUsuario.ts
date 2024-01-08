import { Entity } from 'typeorm';
import { ColecaoBase } from './ColecaoBase';

@Entity()
export class ColecaoDoUsuario extends ColecaoBase {
    constructor(nome: string, descricao: string) {
        super(nome, descricao);
    }
}
