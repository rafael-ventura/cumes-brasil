import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { AppDataSource } from '../../config/db';
import { Continente } from '../../../Domain/entities/Continente';
import { Pais } from '../../../Domain/entities/Pais';
import { Regiao } from '../../../Domain/entities/Regiao';
import { Estado } from '../../../Domain/entities/Estado';
import { Cidade } from '../../../Domain/entities/Cidade';
import { Bairro } from '../../../Domain/entities/Bairro';
import { Localizacao } from '../../../Domain/entities/Localizacao';
import { Fonte } from '../../../Domain/entities/Fonte';
import { Imagem } from '../../../Domain/entities/Imagem';

const DATA_DIR = path.join(process.cwd(), 'src', 'Infrastructure', 'data');

export interface ReferenciasIds {
  continentes: Map<string, number>;
  paises: Map<string, number>;
  regioes: Map<string, number>;
  estados: Map<string, number>;
  cidades: Map<string, number>;
  bairros: Map<string, number>;
  localizacoes: Map<string, number>;
  fontes: Map<string, number>;
  fonteByAutor: Map<string, number>;
  imagens: Map<string, number>;
}

function loadYaml<T>(filename: string): T {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) return [] as unknown as T;
  const content = fs.readFileSync(filepath, 'utf-8');
  return yaml.load(content) as T;
}

function locKey(loc: { continente: string; pais: string; regiao?: string; estado: string; cidade: string; bairro?: string }): string {
  return `${loc.continente}|${loc.pais}|${loc.regiao || ''}|${loc.estado}|${loc.cidade}|${loc.bairro || ''}`;
}

export async function runReferenciasLoader(): Promise<ReferenciasIds> {
  const ids: ReferenciasIds = {
    continentes: new Map(),
    paises: new Map(),
    regioes: new Map(),
    estados: new Map(),
    cidades: new Map(),
    bairros: new Map(),
    localizacoes: new Map(),
    fontes: new Map(),
    fonteByAutor: new Map(),
    imagens: new Map()
  };

  const repoContinente = AppDataSource.getRepository(Continente);
  const repoPais = AppDataSource.getRepository(Pais);
  const repoRegiao = AppDataSource.getRepository(Regiao);
  const repoEstado = AppDataSource.getRepository(Estado);
  const repoCidade = AppDataSource.getRepository(Cidade);
  const repoBairro = AppDataSource.getRepository(Bairro);
  const repoLocalizacao = AppDataSource.getRepository(Localizacao);
  const repoFonte = AppDataSource.getRepository(Fonte);
  const repoImagem = AppDataSource.getRepository(Imagem);

  // Continentes
  const continentes = loadYaml<{ nome: string }[]>('continentes.yaml');
  for (const c of continentes) {
    let ent = await repoContinente.findOne({ where: { nome: c.nome } });
    if (!ent) {
      ent = repoContinente.create({ nome: c.nome });
      await repoContinente.save(ent);
    }
    ids.continentes.set(c.nome, ent.id);
  }

  // Países
  const paises = loadYaml<{ nome: string; continente: string }[]>('paises.yaml');
  for (const p of paises) {
    const continenteId = ids.continentes.get(p.continente);
    if (!continenteId) throw new Error(`Continente não encontrado: ${p.continente}`);
    let ent = await repoPais.findOne({ where: { nome: p.nome, continente: { id: continenteId } } });
    if (!ent) {
      ent = repoPais.create({ nome: p.nome, continente: { id: continenteId } as Continente });
      await repoPais.save(ent);
    }
    ids.paises.set(p.nome, ent.id);
  }

  // Regiões
  const regioes = loadYaml<{ nome: string; pais: string }[]>('regioes.yaml');
  for (const r of regioes) {
    const paisId = ids.paises.get(r.pais);
    if (!paisId) throw new Error(`País não encontrado: ${r.pais}`);
    let ent = await repoRegiao.findOne({ where: { nome: r.nome, pais: { id: paisId } } });
    if (!ent) {
      ent = repoRegiao.create({ nome: r.nome, pais: { id: paisId } as Pais });
      await repoRegiao.save(ent);
    }
    ids.regioes.set(`${r.pais}|${r.nome}`, ent.id);
  }

  // Estados
  const estados = loadYaml<{ nome: string; sigla: string; pais: string; regiao?: string }[]>('estados.yaml');
  for (const e of estados) {
    const paisId = ids.paises.get(e.pais);
    if (!paisId) throw new Error(`País não encontrado: ${e.pais}`);
    const regiaoId = e.regiao ? ids.regioes.get(`${e.pais}|${e.regiao}`) : undefined;
    let ent = await repoEstado.findOne({ where: { sigla: e.sigla, pais: { id: paisId } } });
    if (!ent) {
      ent = repoEstado.create({
        nome: e.nome,
        sigla: e.sigla,
        pais: { id: paisId } as Pais,
        regiao: regiaoId ? ({ id: regiaoId } as Regiao) : undefined
      });
      await repoEstado.save(ent);
    }
    ids.estados.set(e.sigla, ent.id);
  }

  // Cidades
  const cidades = loadYaml<{ nome: string; estado: string }[]>('cidades.yaml');
  for (const c of cidades) {
    const estadoId = ids.estados.get(c.estado);
    if (!estadoId) throw new Error(`Estado não encontrado: ${c.estado}`);
    let ent = await repoCidade.findOne({ where: { nome: c.nome, estado: { id: estadoId } } });
    if (!ent) {
      ent = repoCidade.create({ nome: c.nome, estado: { id: estadoId } as Estado });
      await repoCidade.save(ent);
    }
    ids.cidades.set(`${c.estado}|${c.nome}`, ent.id);
  }

  // Bairros (estado opcional, default RJ para compatibilidade)
  const bairros = loadYaml<{ nome: string; cidade: string; estado?: string }[]>('bairros.yaml');
  for (const b of bairros) {
    const estadoSigla = b.estado || 'RJ';
    const cidadeId = ids.cidades.get(`${estadoSigla}|${b.cidade}`);
    if (!cidadeId) throw new Error(`Cidade não encontrada: ${b.cidade} (${estadoSigla})`);
    let ent = await repoBairro.findOne({ where: { nome: b.nome, cidade: { id: cidadeId } } });
    if (!ent) {
      ent = repoBairro.create({ nome: b.nome, cidade: { id: cidadeId } as Cidade });
      await repoBairro.save(ent);
    }
    ids.bairros.set(`${estadoSigla}|${b.cidade}|${b.nome}`, ent.id);
  }

  // Localizações
  const localizacoes = loadYaml<{ continente: string; pais: string; regiao?: string; estado: string; cidade: string; bairro?: string }[]>('localizacoes.yaml');
  for (const loc of localizacoes) {
    const continenteId = ids.continentes.get(loc.continente);
    const paisId = ids.paises.get(loc.pais);
    const estadoId = ids.estados.get(loc.estado);
    const cidadeId = ids.cidades.get(`${loc.estado}|${loc.cidade}`);
    if (!continenteId || !paisId || !estadoId || !cidadeId) throw new Error(`Referência inválida em localização: ${JSON.stringify(loc)}`);

    const regiaoId = loc.regiao ? ids.regioes.get(`${loc.pais}|${loc.regiao}`) : undefined;
    const bairroId = loc.bairro ? ids.bairros.get(`${loc.estado}|${loc.cidade}|${loc.bairro}`) : undefined;

    const key = locKey(loc);
    const qb = repoLocalizacao.createQueryBuilder('l')
      .where('l.continenteId = :continenteId', { continenteId })
      .andWhere('l.paisId = :paisId', { paisId })
      .andWhere('l.estadoId = :estadoId', { estadoId })
      .andWhere('l.cidadeId = :cidadeId', { cidadeId });
    if (regiaoId) qb.andWhere('l.regiaoId = :regiaoId', { regiaoId });
    else qb.andWhere('l.regiaoId IS NULL');
    if (bairroId) qb.andWhere('l.bairroId = :bairroId', { bairroId });
    else qb.andWhere('l.bairroId IS NULL');

    let ent = await qb.getOne();
    if (!ent) {
      ent = repoLocalizacao.create({
        continente: { id: continenteId } as Continente,
        pais: { id: paisId } as Pais,
        regiao: regiaoId ? ({ id: regiaoId } as Regiao) : undefined,
        estado: { id: estadoId } as Estado,
        cidade: { id: cidadeId } as Cidade,
        bairro: bairroId ? ({ id: bairroId } as Bairro) : undefined
      });
      await repoLocalizacao.save(ent);
    }
    ids.localizacoes.set(key, ent.id);
  }

  // Fontes
  const fontes = loadYaml<{ autor: string; referencia: string }[]>('fontes.yaml');
  for (const f of fontes) {
    let ent = await repoFonte.findOne({ where: { autor: f.autor, referencia: f.referencia } });
    if (!ent) {
      ent = repoFonte.create({ autor: f.autor, referencia: f.referencia });
      await repoFonte.save(ent);
    }
    ids.fontes.set(`${f.autor}|${f.referencia}`, ent.id);
    ids.fonteByAutor.set(f.autor, ent.id);
  }

  // Imagens
  const imagens = loadYaml<{ url: string; descricao?: string; fonte: string; tipo_entidade: string }[]>('imagens.yaml');
  for (const img of imagens) {
    const fonteId = ids.fonteByAutor.get(img.fonte);
    if (!fonteId) throw new Error(`Fonte não encontrada: ${img.fonte}`);
    let ent = await repoImagem.findOne({ where: { url: img.url } });
    if (!ent) {
      ent = repoImagem.create({
        url: img.url,
        descricao: img.descricao,
        fonte_id: fonteId,
        tipo_entidade: img.tipo_entidade
      });
      await repoImagem.save(ent);
    }
    ids.imagens.set(img.url, ent.id);
  }

  console.log('ReferenciasLoader: OK');
  return ids;
}
