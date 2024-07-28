// import { Via } from "src/models/Via";
import { Usuario } from "src/models/Usuario";
import { Participante } from "./Participante";

export interface Escalada {
  // usuario: Usuario;
  viaId: number;
  data: string;
  id?: number;
  observacao?: string;
  participantes: Participante[];
}
