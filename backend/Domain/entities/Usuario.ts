import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ColecaoEscaladas } from "./ColecaoEscaladas";
import { ColecaoFavoritos } from "./ColecaoFavoritos";
import {ColecaoBase} from "./ColecaoBase";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    fotoPerfil: string;

    @OneToMany(() => ColecaoBase, colecao => colecao.usuario, { cascade: true, eager: true })
    colecoesPersonalizadas: ColecaoBase[];

    @OneToMany(() => ColecaoEscaladas, colecaoEscaladas => colecaoEscaladas.usuario, { cascade: true, eager: true })
    historicoEscaladas: ColecaoEscaladas[];

    @OneToMany(() => ColecaoFavoritos, colecaoFavoritos => colecaoFavoritos.usuario, { cascade: true, eager: true })
    favoritos: ColecaoFavoritos[];
}