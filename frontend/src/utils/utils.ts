// --- Importações ---
import { Via } from 'src/models/Via';
import ImagemService from 'src/services/ImagemService';
import { Imagem } from 'src/models/Imagem';

type ViaKey = keyof Via;

// --- Funções de Conversão entre Numerais Romanos e Arábicos ---
export function romanToInt (roman: string): number {
  const romanMap: { [key: string]: number } = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    V: 5,
    VI: 6,
    VII: 7,
    VIII: 8,
    IX: 9,
    X: 10,
    XI: 11,
    XII: 12,
    XIII: 13
  };
  let num = 0;
  let i = 0;
  while (i < roman.length) {
    if (i + 1 < roman.length && romanMap[roman.substring(i, i + 2)]) {
      num += romanMap[roman.substring(i, i + 2)];
      i += 2;
    } else {
      num += romanMap[roman.charAt(i)];
      i++;
    }
  }
  return num;
}

export function intToRoman (num: number): string {
  const romanMap: { [key: string]: number } = {
    XIII: 13,
    XII: 12,
    XI: 11,
    X: 10,
    IX: 9,
    VIII: 8,
    VII: 7,
    VI: 6,
    V: 5,
    IV: 4,
    III: 3,
    II: 2,
    I: 1
  };
  let roman = '';
  for (const key in romanMap) {
    while (num >= romanMap[key]) {
      roman += key;
      num -= romanMap[key];
    }
  }
  return roman;
}

// --- Formatação de Grau ---
export function formatarGrau (grau: string | number): string {
  if (typeof grau === 'number') {
    return `${grau}°`;
  }
  const isRoman = /^[IVXLCDM]+$/.test(grau);
  const arabicNumber = isRoman ? romanToInt(grau) : parseInt(grau);
  return `${arabicNumber}°`;
}

// --- Função Principal de Formatação de Objetos Via ---
// --- Função Principal de Formatação de Objetos Via ---
export function formatVia (via: Via): Via {
  const formattedVia = { ...via };

  // Formatação do Grau
  if (formattedVia.grau) {
    formattedVia.grau = formatarGrau(formattedVia.grau);
  }

  // Formatação da Data
  if (formattedVia.data) {
    formattedVia.data = new Date(formattedVia.data).toLocaleDateString('pt-BR');
  }

  // Arredondamento e remoção de casas decimais na extensão
  if (formattedVia.extensao) {
    formattedVia.extensao = Math.round(Number(formattedVia.extensao));
  }

  // Define valores padrão para campos vazios
  const keys = Object.keys(formattedVia) as ViaKey[];
  for (const key of keys) {
    if (formattedVia[key] === '' || formattedVia[key] === null || formattedVia[key] === undefined) {
      formattedVia[key] = 'N/A' as never;
    }
  }

  // Formata conquistadores
  if (formattedVia.conquistadores) {
    formattedVia.conquistadores = formattedVia.conquistadores.split(';').join('; ');
  }

  return formattedVia;
}

// --- Manipulação de URLs de Imagens ---
export function adjustImageUrls (entity: { imagem?: Imagem }) {
  if (entity.imagem) {
    entity.imagem.url = ImagemService.getFullImageUrl(entity.imagem.url);
  }
}

// --- Tratamento de Erros de API ---
export function handleApiError (error: any, defaultMessage: string): never {
  const message = error?.response?.data?.error || defaultMessage;
  throw new Error(message);
}

// --- Utilitários de Data ---
export const formatDateToYYYYMMDD = (dateString: string): string => {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

export const formatDateToDDMMYYYY = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
