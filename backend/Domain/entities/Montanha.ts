import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Fonte } from "./Fonte";

@Entity()
export class Montanha extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: true })
  bairro: string;

  @Column("int", { nullable: true })
  altura: number;

  @ManyToOne(() => Fonte)
  @JoinColumn({ name: "fonte_id" })
  fonte: Fonte;

  @Column({ nullable: false })
  fonte_id: number;
}
