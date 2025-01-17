// import { Via } from "src/models/Via";
// import { Usuario } from "src/models/Usuario";
import { Participante } from './Participante';

export interface Escalada {
  usuario: number;
  via: number;
  data: Date;
  id?: number;
  observacao?: string;
  participantes: Participante[];
}
