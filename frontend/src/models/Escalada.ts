import { Via } from "src/models/Via";
import { Usuario } from "src/models/Usuario";

export interface Escalada {
  usuario: Usuario;
  Via: Via;
  data: string;
  id: number;
  observacao?: string;
}
