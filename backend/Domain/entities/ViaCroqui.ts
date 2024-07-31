import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { Via } from './Via';
import { Croqui } from './Croqui';

@Entity('via_croqui')
@Unique(['via', 'croqui'])
export class ViaCroqui {
  @PrimaryColumn()
  via_id: number;

  @PrimaryColumn()
  croqui_id: number;

  @ManyToOne(() => Via, via => via.croquis, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'via_id' })
  via: Via;

  @ManyToOne(() => Croqui, croqui => croqui.vias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'colecao_id' })
  croqui: Croqui;
}
