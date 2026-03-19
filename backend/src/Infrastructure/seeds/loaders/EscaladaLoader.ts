import { AppDataSource } from '../../config/db';
import { Escalada } from '../../../Domain/entities/Escalada';
import { loadYaml } from '../seedUtils';

interface EscaladaTesteYaml {
  via: string;
  data: string;
  observacao?: string;
}

/**
 * Cria ou atualiza escaladas para o usuário de teste.
 * Idempotente: busca por usuário + via + dia (ignora hora),
 * e atualiza data + created_at se o registro já existir.
 */
export async function runEscaladaLoader(
  usuarioId: number,
  viaIds: Map<string, number>
): Promise<void> {
  const escaladaRepo = AppDataSource.getRepository(Escalada);
  const yamlData = loadYaml<EscaladaTesteYaml[]>('escaladas-teste.yaml');
  if (!yamlData || yamlData.length === 0) return;

  let criadas = 0;
  let atualizadas = 0;

  for (const item of yamlData) {
    const viaId = viaIds.get(item.via);
    if (!viaId) {
      console.warn(`[EscaladaLoader] Via não encontrada: ${item.via}`);
      continue;
    }

    const dataEscalada = new Date(item.data);

    // Busca por usuário + via + mesmo dia (tolerante a mudanças de hora no YAML)
    const inicioDia = new Date(dataEscalada);
    inicioDia.setHours(0, 0, 0, 0);
    const fimDia = new Date(dataEscalada);
    fimDia.setHours(23, 59, 59, 999);

    const existente = await escaladaRepo
      .createQueryBuilder('e')
      .where('e.usuarioId = :usuarioId', { usuarioId })
      .andWhere('e.viaId = :viaId', { viaId })
      .andWhere('e.data >= :inicio AND e.data <= :fim', { inicio: inicioDia, fim: fimDia })
      .getOne();

    if (existente) {
      // Atualiza data e created_at para refletir o YAML atual
      await escaladaRepo.query(
        `UPDATE escalada SET data = $1, created_at = $1, observacao = $2 WHERE id = $3`,
        [dataEscalada, item.observacao ?? null, existente.id]
      );
      atualizadas++;
      continue;
    }

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

  if (criadas > 0) console.log(`[EscaladaLoader] ${criadas} escaladas criadas para o usuário de teste`);
  if (atualizadas > 0) console.log(`[EscaladaLoader] ${atualizadas} escaladas atualizadas`);
}
