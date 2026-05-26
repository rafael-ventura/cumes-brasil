export type ValorOrdenacao = { field: string; direction: 'asc' | 'desc' };

export type OpcaoOrdenacao = { label: string; value: ValorOrdenacao };

export const OPCOES_ORDENACAO_PADRAO: OpcaoOrdenacao[] = [
  { label: 'Nome (A-Z)', value: { field: 'nome', direction: 'asc' } },
  { label: 'Nome (Z-A)', value: { field: 'nome', direction: 'desc' } },
  { label: 'Mais recente', value: { field: 'created_at', direction: 'desc' } },
  { label: 'Mais antiga', value: { field: 'created_at', direction: 'asc' } },
  { label: 'Última modificação', value: { field: 'updated_at', direction: 'desc' } },
  { label: 'Data da escalada (mais recente)', value: { field: 'data', direction: 'desc' } },
  { label: 'Data da escalada (mais antiga)', value: { field: 'data', direction: 'asc' } },
];

export function filtrarOpcoesOrdenacao(
  permitidas: { field: string; label: string }[] | undefined
): OpcaoOrdenacao[] {
  if (!permitidas?.length) {
    return OPCOES_ORDENACAO_PADRAO;
  }
  return OPCOES_ORDENACAO_PADRAO.filter((op) =>
    permitidas.some((p) => p.field === op.value.field)
  );
}
