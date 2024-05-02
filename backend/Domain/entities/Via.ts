import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Croqui } from "./Croqui";
import { Montanha } from "./Montanha";
import { Fonte } from "./Fonte";

@Entity()
export class Via extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  grau: string;

  @Column({ nullable: true })
  crux: string;

  @Column({ nullable: true })
  artificial: string;

  @Column({ nullable: true })
  duracao: string;

  @Column({ nullable: true })
  exposicao: string;

  @Column({ type: 'int', nullable: true })
  extensao: number;

  @Column({ type: 'simple-array', nullable: true })
  conquistadores: string[];

  @Column({ nullable: true })
  detalhes: string;

  @Column({
    type: "date",
    nullable: true
  })
  data: Date;

  @ManyToOne(() => Montanha)
  @JoinColumn({ name: "montanha_id" })
  montanha: Montanha;

  @Column()
  montanha_id: number;

  @ManyToOne(() => Via, via => via.variantes)
  @JoinColumn({ name: "via_principal_id" })
  viaPrincipal: Via; // Referência à via principal se for uma variante

  @OneToMany(() => Via, via => via.viaPrincipal)
  variantes: Via[]; // Variantes desta via

  @Column({ nullable: true })
  via_principal_id: number;

  @ManyToOne(() => Fonte, fonte => fonte.vias)
  @JoinColumn({ name: "fonte_id" })
  fonte: Fonte;

  @Column()
  fonte_id: number;

  @ManyToMany(() => Croqui, croqui => croqui.vias)
  @JoinTable({
    name: "via_croqui", // Nome da tabela de junção
    joinColumn: {
      name: "via_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "croqui_id",
      referencedColumnName: "id"
    }
  })
  croquis: Croqui[];
}
