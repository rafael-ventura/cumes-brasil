// import { Via } from "src/models/Via";
// import { Usuario } from "src/models/Usuario";
import { Participante } from './Participante';
import { Usuario } from 'src/models/IUsuario';

export interface Escalada {
  usuario: number;
  via: number;
  data: Date;
  id?: number;
  observacao?: string;
  participantes: Participante[];
}
