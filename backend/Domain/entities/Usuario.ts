import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column({ nullable: true })
  fotoPerfil?: string;

  public atualizarFotoPerfil(novaFoto: string) {
    this.fotoPerfil = novaFoto;
  }

  public atualizarEmail(novoEmail: string) {
    this.email = novoEmail;
  }
}
