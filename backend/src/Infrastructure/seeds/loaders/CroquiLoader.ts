import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { AppDataSource } from '../../config/db';
import { Croqui } from '../../../Domain/entities/Croqui';
import { ReferenciasIds } from './ReferenciasLoader';

function loadYaml<T>(file: string): T {
  const p = path.join(process.cwd(), 'src', 'Infrastructure', 'data', file);
  if (!fs.existsSync(p)) return [] as unknown as T;
  return yaml.load(fs.readFileSync(p, 'utf-8')) as T;
}

interface CroquiYaml {
  nome: string;
  imagem: string;
  fonte: string;
}

export async function runCroquiLoader(refs: ReferenciasIds): Promise<Map<string, number>> {
  const ids = new Map<string, number>();
  const repo = AppDataSource.getRepository(Croqui);
  const data = loadYaml<CroquiYaml[]>('croquis.yaml');

  for (const c of data) {
    const fonteId = refs.fonteByAutor.get(c.fonte);
    if (!fonteId) throw new Error(`Fonte não encontrada: ${c.fonte}`);
    const imagemId = refs.imagens.get(c.imagem);
    if (!imagemId) throw new Error(`Imagem não encontrada: ${c.imagem}`);

    const key = `${c.nome}|${c.imagem}`;
    let ent = await repo.findOne({ where: { nome: c.nome, imagem: { id: imagemId } } });
    if (!ent) {
      ent = repo.create({ nome: c.nome, fonte: fonteId, imagem: { id: imagemId } as any });
      await repo.save(ent);
    }
    ids.set(key, ent.id);
  }

  console.log(`CroquiLoader: ${ids.size} croquis`);
  return ids;
}
