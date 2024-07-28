import { Montanha } from 'src/models/Montanha';
import { Fonte } from 'src/models/Fonte';

export interface Face {
  id: number;
  nome: string;
  montanha: Montanha;
  fonte: Fonte;
}
