import { Imagem } from 'src/models/Imagem';
import { IUsuario, Usuario } from 'src/models/IUsuario';

export interface IColecao {
  id: number;
  nome: string;
  descricao?: string;
  usuario: IUsuario;
  /** Capa salva manualmente (opcional). */
  imagem?: Imagem;
  /** URL resolvida no backend: capa própria ou primeira foto da primeira via (data_adicao). */
  imagemCapa?: Imagem;
  capaPersonalizada?: boolean;
  viaColecoes?: any | null;
}

export class Colecao implements IColecao {
  id = 0;
  nome = '';
  descricao?: string = '';
  usuario: IUsuario = new Usuario();
  imagem?: Imagem;
  imagemCapa?: Imagem;
  capaPersonalizada?: boolean;
  viaColecoes?: any | null = null;

  constructor (init?: Partial<Colecao>) {
    Object.assign(this, init); // Atribui propriedades de `init` se fornecidas
  }
}
