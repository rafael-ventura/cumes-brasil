/**
 * Escala de duração (D1–D7) — definições para UI e tooltips.
 */
export const TEXTO_DURACAO: Record<'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7', string> = {
  D1: 'Poucas horas de escalada.',
  D2: 'Meio dia de escalada.',
  D3: 'Um dia quase inteiro de escalada.',
  D4: 'Um longo dia de escalada.',
  D5:
    'Requer uma noite na parede. Cordadas muito velozes podem repeti-la em um dia.',
  D6:
    'Dois dias inteiros ou mais de escalada. Normalmente inclui longos e complicados trechos de escalada artificial.',
  D7:
    'Expedições a locais de acesso remoto com longa aproximação e muitos dias de escalada.',
};

const CORES_DURACAO = [
  '#F29340',
  '#a4c77d',
  '#F4E285',
  '#8CB369',
  '#e8733a',
  '#BC4B51',
  '#7a2d32',
] as const;

const CHAVES: Array<keyof typeof TEXTO_DURACAO> = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];

export function obterTextoDuracao (codigo: string | undefined | null): string | null {
  if (codigo == null || String(codigo).trim() === '') return null;
  const raw = String(codigo).trim().toUpperCase();
  const chave = (raw.startsWith('D') ? raw : `D${raw}`) as keyof typeof TEXTO_DURACAO;
  return TEXTO_DURACAO[chave] ?? null;
}

/** Lista ordenada D1…D7 para Explorar / filtros (`valor` em minúsculas para query) */
export function listaCardsDuracao (): { valor: string; rotulo: string; cor: string }[] {
  return CHAVES.map((chave, i) => ({
    valor: chave.toLowerCase(),
    rotulo: chave,
    cor: CORES_DURACAO[i] ?? '#888',
  }));
}
