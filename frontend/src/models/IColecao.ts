import { Imagem } from 'src/models/Imagem';
import { IUsuario, Usuario } from 'src/models/IUsuario';

export interface IColecao {
  id: number;
  nome: string;
  descricao?: string;
  usuario: IUsuario;
  imagem?: Imagem;
  viaColecoes?: any | null;
}

export class Colecao implements IColecao {
  id = 0;
  nome = '';
  descricao?: string = '';
  usuario: IUsuario = new Usuario();
  imagem?: Imagem;
  viaColecoes?: any | null = null;

  constructor (init?: Partial<Colecao>) {
    Object.assign(this, init); // Atribui propriedades de `init` se fornecidas
  }
}
