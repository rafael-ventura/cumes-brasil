/** Aceita ISO (2025-03-15) ou pt-BR com barras (15/03/2025). */
export function parseDataAtividade (valor: string | undefined | null): Date | null {
  if (valor == null || String(valor).trim() === '') return null;
  const s = String(valor).trim();
  if (s.includes('/')) {
    const partes = s.split('/');
    if (partes.length >= 3) {
      const [d, m, y] = partes.map((x) => parseInt(x, 10));
      if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
        const dt = new Date(y, m - 1, d);
        return isNaN(dt.getTime()) ? null : dt;
      }
    }
  }
  const dt = new Date(s);
  return isNaN(dt.getTime()) ? null : dt;
}
