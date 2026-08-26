import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Colecao } from "./Colecao";
import { Imagem } from "./Imagem";
import { Escalada } from "./Escalada";
import { Via } from "./Via";
import { BaseEntityWithTimestamps } from "./BaseEntityWithTimestamps";
import { PapelUsuario } from "../enum/EPapelUsuario";

@Entity()
export class Usuario extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  idade: number;

  @Column({ nullable: false })
  password_hash: string;

  @Column({ nullable: true })
  data_atividade: string;

  @Column({ nullable: true })
  clube_organizacao: string;

  @Column({ nullable: true })
  localizacao: string;

  @Column({ nullable: true })
  biografia: string;

  @Column({ nullable: true })
  link_externo?: string;

  @Column({ default: true })
  perfil_publico: boolean;

  @Column({ default: true })
  conquistas_publico: boolean;

  @Column({ type: "enum", enum: PapelUsuario, default: PapelUsuario.Usuario })
  role: PapelUsuario;

  /**
   * Compatibilidade: `is_admin` é derivado de `role` (não é coluna).
   * `role` é a única fonte de verdade da autorização. Mantido para o front
   * (DTO/login) que ainda consome `is_admin` como dica de UI.
   */
  get is_admin(): boolean {
    return this.role === PapelUsuario.Admin;
  }

  @ManyToOne(() => Via, { nullable: true })
  @JoinColumn({ name: "via_preferida" })
  via_preferida: Via;

  @ManyToOne(() => Imagem, imagem => imagem.usuarios)
  @JoinColumn({ name: "foto_perfilId" })
  foto_perfil: Imagem;

  @OneToMany(() => Colecao, colecao => colecao.usuario)
  colecoes: Colecao[];

  @OneToMany(() => Escalada, escalada => escalada.usuario)
  escaladas: Escalada[];

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordUrl: string;
}
