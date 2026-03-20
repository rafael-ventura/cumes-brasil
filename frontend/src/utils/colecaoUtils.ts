import { IColecao } from 'src/models/IColecao';

/**
 * Coleção automática de favoritos (criada no seed / garantida no cadastro).
 * Mesma heurística usada em `ColecaoService.obterColecaoFavoritos`.
 */
export function ehColecaoFavoritos (colecao: Pick<IColecao, 'nome'> | null | undefined): boolean {
  const n = (colecao?.nome || '').trim();
  if (!n) return false;
  return n === 'Favoritas' || n === 'Vias Favoritas' || n.includes('Favoritas');
}
