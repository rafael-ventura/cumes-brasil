import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Via } from './Via';
import { Imagem } from './Imagem';
import { Usuario } from './Usuario';
import { BaseEntityWithTimestamps } from './BaseEntityWithTimestamps';

export type StatusSugestao = 'pendente' | 'aprovada' | 'rejeitada';

@Entity('via_image_sugestao')
export class ViaImageSugestao extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Via, { onDelete: 'CASCADE', nullable: false })
  via: Via;

  @ManyToOne(() => Imagem, { onDelete: 'CASCADE', nullable: false })
  imagem: Imagem;

  @ManyToOne(() => Usuario, { onDelete: 'SET NULL', nullable: true })
  usuario: Usuario | null;

  @Column({ default: 'pendente' })
  status: StatusSugestao;

  @Column({ nullable: true, length: 255 })
  creditos: string | null;

  @Column({ nullable: true, length: 500 })
  motivo_rejeicao: string | null;

  @ManyToOne(() => Usuario, { onDelete: 'SET NULL', nullable: true })
  admin_revisor: Usuario | null;

  @Column({ type: 'timestamp', nullable: true })
  reviewed_at: Date | null;
}
