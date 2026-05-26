import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Usuario } from './Usuario';
import { BaseEntityWithTimestamps } from './BaseEntityWithTimestamps';

@Entity('usuario_seguindo')
export class UsuarioSeguindo extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seguidorId' })
  seguidor: Usuario;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seguidoId' })
  seguido: Usuario;

  // Conveniência para querybuilder sem carregar as entidades completas.
  @RelationId((us: UsuarioSeguindo) => us.seguidor)
  seguidorId: number;

  @RelationId((us: UsuarioSeguindo) => us.seguido)
  seguidoId: number;
}

