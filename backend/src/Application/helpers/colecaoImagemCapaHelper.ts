import { Colecao } from '../../Domain/entities/Colecao';
import { Imagem } from '../../Domain/entities/Imagem';
import { Via } from '../../Domain/entities/Via';

/**
 * Primeira imagem da via (ordem estável por id do ViaImagem).
 */
function primeiraImagemDaVia(via: Via | undefined): Imagem | undefined {
  if (!via?.viaImagens?.length) return undefined;
  const ordenadas = [...via.viaImagens].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  return ordenadas[0]?.imagem ?? undefined;
}

/**
 * Capa explícita da coleção (coluna imagem) ou primeira foto da primeira via adicionada (data_adicao ASC).
 */
export function resolverImagemCapaExibicao(colecao: Colecao): Imagem | undefined {
  if (colecao.imagem) {
    return colecao.imagem;
  }
  const vinculos = [...(colecao.viaColecoes || [])].sort(
    (a, b) => new Date(a.data_adicao).getTime() - new Date(b.data_adicao).getTime()
  );
  for (const vc of vinculos) {
    const img = primeiraImagemDaVia(vc.via);
    if (img) return img;
  }
  return undefined;
}
