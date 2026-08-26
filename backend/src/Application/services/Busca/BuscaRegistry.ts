import { ViaRepository } from '../../../Infrastructure/repositories/ViaRepository';
import { ColecaoRepository } from '../../../Infrastructure/repositories/ColecaoRepository';
import { EscaladaRepository } from '../../../Infrastructure/repositories/EscaladaRepository';
import { BuscaViaService } from './BuscaViaService';
import { BuscaColecaoService } from './BuscaColecaoService';
import { BuscaEscaladaService } from './BuscaEscaladaService';
import { IBuscaTipo } from './IBuscaTipo';
import BadRequestError from '../../errors/BadRequestError';

export type TipoBusca = 'via' | 'colecao' | 'escalada';

const services: Record<TipoBusca, IBuscaTipo> = {
  via: new BuscaViaService(new ViaRepository()),
  colecao: new BuscaColecaoService(new ColecaoRepository()),
  escalada: new BuscaEscaladaService(new EscaladaRepository())
};

export const TIPOS_BUSCA_SUPORTADOS = Object.keys(services) as TipoBusca[];

export function ehTipoBuscaValido(tipo: unknown): tipo is TipoBusca {
  return typeof tipo === 'string' && tipo in services;
}

export function obterBuscaService(tipo: TipoBusca): IBuscaTipo {
  const service = services[tipo];
  if (!service) {
    throw new BadRequestError(`Tipo de entidade não suportado: ${tipo}`);
  }
  return service;
}
