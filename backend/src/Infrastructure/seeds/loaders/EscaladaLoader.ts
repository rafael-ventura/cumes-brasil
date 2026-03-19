import { AppDataSource } from '../../config/db';
import { Escalada } from '../../../Domain/entities/Escalada';
import { loadYaml } from '../seedUtils';

interface EscaladaTesteYaml {
  via: string;
  data: string;
  observacao?: string;
}

/**
 * Cria escaladas para o usuário de teste.
 * Idempotente: evita duplicar escaladas do mesmo usuário na mesma via/data.
 */
export async function runEscaladaLoader(
  usuarioId: number,
  viaIds: Map<string, number>
): Promise<void> {
  const escaladaRepo = AppDataSource.getRepository(Escalada);
  const data = loadYaml<EscaladaTesteYaml[]>('escaladas-teste.yaml');
  if (!data || data.length === 0) return;

  let criadas = 0;
  for (const item of data) {
    const viaId = viaIds.get(item.via);
    if (!viaId) {
      console.warn(`[EscaladaLoader] Via não encontrada: ${item.via}`);
      continue;
    }

    const dataEscalada = new Date(item.data);
    const existente = await escaladaRepo.findOne({
      where: {
        usuario: { id: usuarioId },
        via: { id: viaId },
        data: dataEscalada
      }
    });
    if (existente) continue;

    const escalada = escaladaRepo.create({
      data: dataEscalada,
      observacao: item.observacao || undefined,
      usuario: { id: usuarioId } as any,
      via: { id: viaId } as any
    });
    const salva = await escaladaRepo.save(escalada);
    // Alinha created_at com a data da escalada para ordenação correta no feed
    await escaladaRepo.query(
      `UPDATE escalada SET created_at = $1 WHERE id = $2`,
      [dataEscalada, salva.id]
    );
    criadas++;
  }

  if (criadas > 0) {
    console.log(`[EscaladaLoader] ${criadas} escaladas criadas para o usuário de teste`);
  }
}
