import { AppDataSource } from '../../config/db';
import { Croqui } from '../../../Domain/entities/Croqui';
import { ReferenciasIds } from './ReferenciasLoader';
import { loadYaml } from '../seedUtils';

interface CroquiYaml {
  nome: string;
  imagem: string;
  fonte: string;
  legenda?: string;
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
      ent = repo.create({ nome: c.nome, fonte: fonteId, imagem: { id: imagemId } as any, legenda: c.legenda });
      await repo.save(ent);
    } else if (c.legenda !== undefined) {
      ent.legenda = c.legenda;
      await repo.save(ent);
    }
    ids.set(key, ent.id);
  }

  console.log(`[CroquiLoader] ${ids.size} croquis`);
  return ids;
}
