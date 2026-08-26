import { AppDataSource } from '../../config/db';
import { Via } from '../../../Domain/entities/Via';
import { ViaImagem } from '../../../Domain/entities/ViaImagem';
import { Montanha } from '../../../Domain/entities/Montanha';
import { Face } from '../../../Domain/entities/Face';
import { ReferenciasIds } from './ReferenciasLoader';
import { loadYaml } from '../seedUtils';
import { ModalidadeEscalada } from '../../../Domain/enum/EModalidadeEscalada';

/**
 * Campos simples da Via que são atualizados no upsert quando presentes no YAML.
 * Para adicionar um novo campo atualizável: basta incluí-lo aqui e na interface ViaYaml.
 */
const UPSERT_FIELDS = ['grau', 'crux', 'artificial', 'exposicao', 'via_cerj', 'historia_resumo', 'equipamentos', 'tracklog_aproximacao'] as const;
type UpsertField = (typeof UPSERT_FIELDS)[number];

interface ViaYaml {
  nome: string;
  grau?: string;
  crux?: string;
  artificial?: string;
  duracao?: string;
  exposicao?: string;
  extensao?: number;
  conquistadores?: string;
  detalhes?: string;
  historia_resumo?: string;
  via_cerj?: boolean;
  // Não vem no YAML atual, mas mantemos o campo para compatibilidade futura.
  modalidade?: ModalidadeEscalada;
  equipamentos?: string;
  tracklog_aproximacao?: string;
  data?: string;
  montanha: string;
  face: string;
  fonte: string;
  viaPrincipal?: string;
  imagem?: string;
}

function artificialPreenchido(v: ViaYaml): boolean {
  if (v.artificial == null) return false;
  const s = String(v.artificial).trim();
  if (!s) return false;
  const sUpper = s.toUpperCase();
  if (['N/A', 'NA', 'NULL'].includes(sUpper)) return false;
  return true;
}

function contemCampoEscola(v: ViaYaml): boolean {
  const texto = `${v.historia_resumo ?? ''} ${v.detalhes ?? ''}`.toLowerCase();
  return texto.includes('campo escola');
}

function inferirModalidade(v: ViaYaml): ModalidadeEscalada {
  if (v.modalidade) return v.modalidade;

  // Regra baseada na lógica observada do CERJ:
  // - vias CERJ com `artificial` (A0/A1/...) ou que mencionam "campo escola" são tratadas como "Esportiva"
  // - demais vias CERJ são tratadas como "Tradicional"
  // - fora do CERJ, default para "Tradicional" (por enquanto).
  if (v.via_cerj) {
    if (artificialPreenchido(v) || contemCampoEscola(v)) return ModalidadeEscalada.Esportiva;
    return ModalidadeEscalada.Tradicional;
  }

  return ModalidadeEscalada.Tradicional;
}

export async function runViaLoader(
  refs: ReferenciasIds,
  montanhaIds: Map<string, number>,
  faceIds: Map<string, number>
): Promise<Map<string, number>> {
  const ids = new Map<string, number>();
  const repo = AppDataSource.getRepository(Via);
  const viaImagemRepo = AppDataSource.getRepository(ViaImagem);
  const data = loadYaml<ViaYaml[]>('vias.yaml');

  for (const v of data) {
    const montanhaId = montanhaIds.get(v.montanha);
    if (!montanhaId) throw new Error(`Montanha não encontrada: ${v.montanha}`);
    const faceId = faceIds.get(`${v.montanha}|${v.face}`);
    if (!faceId) throw new Error(`Face não encontrada: ${v.montanha}|${v.face}`);
    const fonteId = refs.fonteByAutor.get(v.fonte);
    if (!fonteId) throw new Error(`Fonte não encontrada: ${v.fonte}`);

    const modalidadeFinal = inferirModalidade(v);

    let ent = await repo.findOne({
      where: { nome: v.nome, montanha: { id: montanhaId }, face: { id: faceId } }
    });
    if (!ent) {
      const viaPrincipalId = v.viaPrincipal ? ids.get(v.viaPrincipal) : undefined;
      ent = repo.create({
        nome: v.nome,
        grau: v.grau,
        crux: v.crux,
        artificial: v.artificial,
        duracao: v.duracao,
        exposicao: v.exposicao,
        extensao: v.extensao,
        conquistadores: v.conquistadores,
        detalhes: v.detalhes,
        historia_resumo: v.historia_resumo,
        via_cerj: v.via_cerj ?? false,
        equipamentos: v.equipamentos,
        tracklog_aproximacao: v.tracklog_aproximacao,
        data: v.data,
        modalidade: modalidadeFinal,
        montanha: { id: montanhaId } as Montanha,
        face: { id: faceId } as Face,
        fonte: fonteId ? { id: fonteId } as any : null,
        viaPrincipal: viaPrincipalId ? { id: viaPrincipalId } as Via : null
      });
      await repo.save(ent);
      if (v.imagem) {
        const imgId = refs.imagens.get(v.imagem);
        if (!imgId) {
          throw new Error(`Imagem não encontrada para via "${v.nome}": ${v.imagem}`);
        }
        const vi = viaImagemRepo.create({ via: ent, imagem: { id: imgId } as any });
        await viaImagemRepo.save(vi);
      }
    } else {
      for (const field of UPSERT_FIELDS) {
        (ent as unknown as Record<string, unknown>)[field] = v[field] ?? null;
      }

      // Mesmo para registros já existentes, garantimos que a modalidade seja sincronizada
      // com a regra de inferência (evita ficar tudo `NULL` no banco).
      ent.modalidade = modalidadeFinal;
      await repo.save(ent);
      if (v.imagem) {
        const imgId = refs.imagens.get(v.imagem);
        if (imgId) {
          const existing = await viaImagemRepo.findOne({ where: { via: { id: ent.id } } });
          if (existing) {
            existing.imagem = { id: imgId } as any;
            await viaImagemRepo.save(existing);
          } else {
            const vi = viaImagemRepo.create({ via: ent, imagem: { id: imgId } as any });
            await viaImagemRepo.save(vi);
          }
        }
      } else if (!v.via_cerj) {
        // Limpa imagens legadas (default antiga) de vias não-CERJ.
        await viaImagemRepo
          .createQueryBuilder()
          .delete()
          .where('"viaId" = :viaId', { viaId: ent.id })
          .execute();
      }
    }
    ids.set(v.nome, ent.id);
  }

  console.log(`[ViaLoader] ${ids.size} vias`);
  return ids;
}
