import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, BaseEntity } from 'typeorm';
import { Croqui } from './Croqui';
import { Montanha } from './Montanha';
import { Fonte } from './Fonte';

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

  @Column({ type: 'date', nullable: true })
  data: Date;

  @Column()
  montanha_id: number;

  @ManyToOne(() => Montanha)
  @JoinColumn({ name: 'montanha_id' })
  montanha: Montanha;

  @Column()
  face_id: number;

  @Column({ nullable: true })
  via_principal_id: number;

  @Column()
  fonte_id: number;

  @ManyToOne(() => Fonte, fonte => fonte.vias)
  @JoinColumn({ name: 'fonte_id' })
  fonte: Fonte;

  @OneToMany(() => Croqui, croqui => croqui.via)
  croquis: Croqui[];

  public popularCroqui(croqui: Croqui): void {
    if (!this.croquis) {
      this.croquis = [];
    }
    this.croquis.push(croqui);
  }
}
