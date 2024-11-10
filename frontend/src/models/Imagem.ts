import { Fonte } from 'src/models/Fonte';

export interface IImagem {
  id: number;
  url: string;
  descricao?: string;
  fonte: Fonte;
  tipo_entidade: string;
}

export class Imagem implements IImagem {
  id = 0;
  url = '';
  descricao?: string = '';
  fonte: Fonte = new Fonte(); // Inicializa `fonte` com uma nova instância de `Fonte`
  tipo_entidade = '';

  constructor (init?: Partial<IImagem>) {
    Object.assign(this, init);
  }
}
