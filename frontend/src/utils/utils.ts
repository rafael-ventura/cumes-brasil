import { getFullImageUrl } from 'src/services/ImagemService';
import { Via } from 'src/models/Via';

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

type ViaKey = keyof Via;

export function formatVia (via: Via): Via {
  // Ajustar URL da imagem da via
  if (via.imagem?.url) {
    via.imagem.url = getFullImageUrl(via.imagem.url);
  }

  // Ajustar URLs das imagens de croqui
  via.croquis?.forEach(croqui => {
    if (croqui.imagem?.url) {
      croqui.imagem.url = getFullImageUrl(croqui.imagem.url);
    }
  });

  // Mascarar data
  if (via.data) {
    via.data = new Date(via.data).toLocaleDateString('pt-BR');
  }

  // Preencher valores vazios com "N/A"
  const keys = Object.keys(via) as ViaKey[];
  for (const key of keys) {
    if (via[key] === '' || via[key] === null || via[key] === undefined) {
      via[key] = 'N/A' as never;
    }
  }

  if (via.conquistadores) {
    via.conquistadores = via.conquistadores.split(';').join('; ');
  }

  return via;
}
