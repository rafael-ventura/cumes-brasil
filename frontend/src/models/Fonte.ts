export interface IFonte {
  id: number;
  autor: string;
  referencia: string;
}

export class Fonte implements IFonte {
  id = 0;
  autor = 'Autor Desconhecido';
  referencia = 'N/A';

  constructor (init?: Partial<IFonte>) {
    Object.assign(this, init);
  }
}
