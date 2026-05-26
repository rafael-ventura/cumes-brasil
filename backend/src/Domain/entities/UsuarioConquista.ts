import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityWithTimestamps } from './BaseEntityWithTimestamps';
import { Usuario } from './Usuario';

export type ConquistaTier = 'NENHUM' | 'BRONZE' | 'PRATA' | 'OURO' | 'PLATINA';

@Entity('usuario_conquistas')
export class UsuarioConquista extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column({ type: 'varchar', nullable: false })
  tipo: string;

  @Column({ type: 'integer', nullable: false, default: 0 })
  valorAtual: number;

  @Column({ type: 'varchar', nullable: false })
  tier: ConquistaTier;
}

