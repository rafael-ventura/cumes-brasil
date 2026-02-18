import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { AppDataSource } from '../../config/db';
import { Montanha } from '../../../Domain/entities/Montanha';
import { Localizacao } from '../../../Domain/entities/Localizacao';
import { ReferenciasIds } from './ReferenciasLoader';

function loadYaml<T>(file: string): T {
  const p = path.join(process.cwd(), 'src', 'Infrastructure', 'data', file);
  if (!fs.existsSync(p)) return [] as unknown as T;
  return yaml.load(fs.readFileSync(p, 'utf-8')) as T;
}

interface MontanhaYaml {
  nome: string;
  altura?: number;
  localizacoes?: string[];
  imagem?: string;
}

export async function runMontanhaLoader(refs: ReferenciasIds): Promise<Map<string, number>> {
  const ids = new Map<string, number>();
  const repo = AppDataSource.getRepository(Montanha);
  const data = loadYaml<MontanhaYaml[]>('montanhas.yaml');

  for (const m of data) {
    let ent = await repo.findOne({ where: { nome: m.nome } });
    if (!ent) {
      ent = repo.create({
        nome: m.nome,
        altura: m.altura,
        imagem: m.imagem ? refs.imagens.get(m.imagem) : undefined
      });
      await repo.save(ent);
    } else {
      if (m.altura !== undefined) ent.altura = m.altura;
      if (m.imagem && refs.imagens.has(m.imagem)) ent.imagem = refs.imagens.get(m.imagem)!;
      await repo.save(ent);
    }
    ids.set(m.nome, ent.id);

    if (m.localizacoes?.length) {
      const locIds = m.localizacoes
        .map((b) => Array.from(refs.localizacoes.entries()).find(([k]) => k.endsWith(`|${b}`))?.[1])
        .filter((id): id is number => id != null);
      if (locIds.length) {
        const montanha = await repo.findOne({ where: { id: ent.id }, relations: ['localizacoes'] });
        if (montanha) {
          montanha.localizacoes = locIds.map((id) => ({ id } as Localizacao));
          await repo.save(montanha);
        }
      }
    }
  }

  console.log(`MontanhaLoader: ${ids.size} montanhas`);
  return ids;
}
