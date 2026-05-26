import { AppDataSource } from '../../config/db';
import { Usuario } from '../../../Domain/entities/Usuario';
import { UsuarioSeguindo } from '../../../Domain/entities/UsuarioSeguindo';
import { loadYaml } from '../seedUtils';
import { UsuarioSeedResult } from './UsuarioLoader';

interface SeguimentoYaml {
  seguidor: string;
  seguido: string;
}

export async function runSeguimentoLoader (porUsername: Map<string, number>): Promise<void> {
  const lista = loadYaml<SeguimentoYaml[]>('seguimentos-teste.yaml');
  if (!lista?.length) return;

  const usuarioSeguindoRepo = AppDataSource.getRepository(UsuarioSeguindo);

  for (const s of lista) {
    const seguidorUsername = String(s.seguidor || '').trim();
    const seguidoUsername = String(s.seguido || '').trim();
    if (!seguidorUsername || !seguidoUsername) continue;

    const seguidorId = porUsername.get(seguidorUsername);
    const seguidoId = porUsername.get(seguidoUsername);
    if (!seguidorId || !seguidoId) continue;

    const jaSegue = await usuarioSeguindoRepo.count({
      where: {
        seguidor: { id: seguidorId },
        seguido: { id: seguidoId }
      } as any
    });

    if (jaSegue) continue;

    const registro = usuarioSeguindoRepo.create({
      seguidor: { id: seguidorId } as unknown as Usuario,
      seguido: { id: seguidoId } as unknown as Usuario
    });

    await usuarioSeguindoRepo.save(registro);
  }
}

