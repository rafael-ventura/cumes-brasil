import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Via } from "./Via";

@Entity()
export class Colecao extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  usuario_id: number;

  @Column({ nullable: true })
  descricao?: string;

  @ManyToMany(() => Via)
  @JoinTable({
    name: "colecao_via",
    joinColumn: {
      name: "colecao_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "via_id",
      referencedColumnName: "id"
    }
  })
  vias: Via[];

  public popularVia (via: Via): void {
    this.vias.push(via);
  }
}
