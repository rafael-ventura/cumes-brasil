import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

import { AppDataSource } from '../config/db';
import { runReferenciasLoader } from './loaders/ReferenciasLoader';
import { runMontanhaLoader } from './loaders/MontanhaLoader';
import { runFacesLoader } from './loaders/FacesLoader';
import { runViaLoader } from './loaders/ViaLoader';
import { runCroquiLoader } from './loaders/CroquiLoader';
import { runViaCroquiLoader } from './loaders/ViaCroquiLoader';
import { runUsuarioLoader } from './loaders/UsuarioLoader';
import { runEscaladaLoader } from './loaders/EscaladaLoader';
import { runColecaoConteudoLoader } from './loaders/ColecaoConteudoLoader';
import { runSeguimentoLoader } from './loaders/SeguimentoLoader';

async function main() {
  console.log('Iniciando seed...');
  await AppDataSource.initialize();

  try {
    const refs = await runReferenciasLoader();
    const montanhaIds = await runMontanhaLoader(refs);
    const faceIds = await runFacesLoader(refs, montanhaIds);
    const viaIds = await runViaLoader(refs, montanhaIds, faceIds);
    const croquiIds = await runCroquiLoader(refs);
    await runViaCroquiLoader(viaIds, croquiIds);
    const { porUsername } = await runUsuarioLoader();
    await runSeguimentoLoader(porUsername);
    await runEscaladaLoader(porUsername, viaIds);
    await runColecaoConteudoLoader(porUsername, viaIds);
    console.log('Seed concluído com sucesso.');
  } catch (err) {
    console.error('Erro no seed:', err);
    throw err;
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch(() => process.exit(1));
