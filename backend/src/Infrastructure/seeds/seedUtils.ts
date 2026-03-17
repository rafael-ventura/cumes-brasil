import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const DATA_DIR = path.join(process.cwd(), 'src', 'Infrastructure', 'data');

/**
 * Carrega um arquivo YAML do diretório de dados do seed.
 * Retorna um array vazio se o arquivo não existir.
 */
export function loadYaml<T>(filename: string): T {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) return [] as unknown as T;
  return yaml.load(fs.readFileSync(filepath, 'utf-8')) as T;
}

/**
 * Resolve IDs de localização a partir de nomes de bairros,
 * usando busca por sufixo na chave composta das localizações.
 * Útil para MontanhaLoader e FacesLoader.
 */
export function resolveLocalizacaoIds(
  bairros: string[],
  localizacoes: Map<string, number>
): number[] {
  return bairros
    .map((bairro) =>
      Array.from(localizacoes.entries()).find(([k]) => k.endsWith(`|${bairro}`))?.[1]
    )
    .filter((id): id is number => id != null);
}
