import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Via } from './Via';
import { Imagem } from './Imagem';
import { BaseEntityWithTimestamps } from './BaseEntityWithTimestamps';

@Entity('via_imagem')
export class ViaImagem extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Via, { onDelete: 'CASCADE' })
  via: Via;

  @ManyToOne(() => Imagem, { onDelete: 'CASCADE' })
  imagem: Imagem;
}
