export type DadosCompartilhamento = {
  titulo: string;
  texto: string;
  url: string;
};

export function gerarTextoCompartilhamento (dados: DadosCompartilhamento): string {
  const titulo = dados.titulo?.trim() ? dados.titulo.trim() : '';
  const texto = dados.texto?.trim() ? dados.texto.trim() : '';
  const url = dados.url?.trim() ? dados.url.trim() : '';
  return [titulo, texto, url].filter(Boolean).join('\n');
}

export async function copiarTextoCompartilhamentoUtil (texto: string): Promise<void> {
  if (!texto) return;

  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(texto);
    return;
  }

  // Fallback compatível com navegadores antigos.
  const input = document.createElement('input');
  input.value = texto;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

export function compartilhar (dados: DadosCompartilhamento): Promise<void> {
  const titulo = dados.titulo;
  const texto = dados.texto;
  const url = dados.url;

  // navigator.share pode não existir em todos os navegadores
  const shareFn = (navigator as any)?.share as undefined | ((data: any) => Promise<void>);

  if (shareFn) {
    return shareFn({ title: titulo, text: texto, url });
  }

  // Fallback: copia link para colar no WhatsApp/grupo.
  return new Promise((resolve, reject) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => resolve())
        .catch(reject);
      return;
    }

    try {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

export function obterUrlCompartilhavel (caminho: string): string {
  const base = window.location.origin;
  if (caminho.startsWith('http://') || caminho.startsWith('https://')) return caminho;
  return `${base}${caminho.startsWith('/') ? '' : '/'}${caminho}`;
}

