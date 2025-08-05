// --- Importações ---
import { Via } from 'src/models/Via';
import ImagemService from 'src/services/ImagemService';

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
export function adjustImageUrls (entity: any): void {
  if (entity !== null && entity !== undefined) {
    entity.url = ImagemService.getFullImageUrl(entity.url);
  }
}

// --- Tratamento de Erros de API ---
export function handleApiError (error: any, defaultMessage: string): never {
  let message = defaultMessage;
  let statusCode = 500;

  if (error?.response) {
    statusCode = error.response.status;
    const errorData = error.response.data;

    // Tratamento específico por status code
    switch (statusCode) {
      case 400:
        message = errorData?.error || 'Dados inválidos';
        break;
      case 401:
        message = errorData?.error || 'Não autorizado';
        break;
      case 403:
        message = errorData?.error || 'Acesso negado';
        break;
      case 404:
        message = errorData?.error || 'Recurso não encontrado';
        break;
      case 409:
        message = errorData?.error || 'Conflito de dados';
        break;
      case 422:
        message = errorData?.error || 'Dados inválidos';
        break;
      case 429:
        message = errorData?.error || 'Muitas requisições. Tente novamente em alguns minutos.';
        break;
      case 500:
        message = errorData?.error || 'Erro interno do servidor';
        break;
      default:
        message = errorData?.error || errorData?.message || defaultMessage;
    }
  } else if (error?.request) {
    message = 'Erro de conexão. Verifique sua internet.';
  } else if (error?.message) {
    message = error.message;
  }

  const customError = new Error(message) as any;
  customError.statusCode = statusCode;
  customError.originalError = error;

  throw customError;
}

// --- Função para tratamento de erros com notificação ---
export function handleApiErrorWithNotify (error: any, defaultMessage: string, notify: any): void {
  try {
    handleApiError(error, defaultMessage);
  } catch (customError: any) {
    notify(createNotifyConfig('negative', customError.message));
  }
}

// --- Função para validação de resposta de API ---
export function validateApiResponse (response: any, expectedStatus: number = 200): void {
  if (!response) {
    throw new Error('Resposta inválida da API');
  }

  if (response.status !== expectedStatus) {
    throw new Error(`Status inesperado: ${response.status}`);
  }

  if (!response.data) {
    throw new Error('Dados não encontrados na resposta');
  }
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

export const createNotifyConfig = (type: string, message: string, position = 'top', timeout = 3000): any => {
  return {
    type,
    message,
    position,
    timeout
  };
};
