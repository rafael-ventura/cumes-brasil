import { Service } from 'typedi';
import { AppDataSource } from '../config/db';
import { Localizacao } from '../../Domain/entities/Localizacao';
import { Repository } from 'typeorm';

@Service()
export class LocalizacaoRepository {
  private repository: Repository<Localizacao>;

  constructor() {
    this.repository = AppDataSource.getRepository(Localizacao);
  }

  async getLocationHierarchy(): Promise<any> {
    const localizacoes = await this.repository
      .createQueryBuilder('localizacao')
      .leftJoinAndSelect('localizacao.pais', 'pais')
      .leftJoinAndSelect('localizacao.estado', 'estado')
      .leftJoinAndSelect('localizacao.cidade', 'cidade')
      .leftJoinAndSelect('localizacao.bairro', 'bairro')
      .leftJoinAndSelect('localizacao.montanhas', 'montanhas')
      .leftJoinAndSelect('montanhas.vias', 'vias')
      .getMany();

    const hierarchy: any = {};

    for (const loc of localizacoes) {
      const paisNome = (loc.pais as any)?.nome || 'Desconhecido';
      const estadoNome = (loc.estado as any)?.nome || 'Desconhecido';
      const cidadeNome = (loc.cidade as any)?.nome || 'Desconhecida';
      const bairroNome = (loc.bairro as any)?.nome || null;

      if (!hierarchy[paisNome]) {
        hierarchy[paisNome] = {
          id: (loc.pais as any)?.id,
          nome: paisNome,
          estados: {},
          totalVias: 0
        };
      }

      if (!hierarchy[paisNome].estados[estadoNome]) {
        hierarchy[paisNome].estados[estadoNome] = {
          id: (loc.estado as any)?.id,
          nome: estadoNome,
          sigla: (loc.estado as any)?.sigla,
          cidades: {},
          totalVias: 0
        };
      }

      if (!hierarchy[paisNome].estados[estadoNome].cidades[cidadeNome]) {
        hierarchy[paisNome].estados[estadoNome].cidades[cidadeNome] = {
          id: (loc.cidade as any)?.id,
          nome: cidadeNome,
          bairros: bairroNome ? {} : null,
          montanhas: [],
          totalVias: 0
        };
      }

      if (bairroNome) {
        if (!hierarchy[paisNome].estados[estadoNome].cidades[cidadeNome].bairros) {
          hierarchy[paisNome].estados[estadoNome].cidades[cidadeNome].bairros = {};
        }
        if (!hierarchy[paisNome].estados[estadoNome].cidades[cidadeNome].bairros[bairroNome]) {
          hierarchy[paisNome].estados[estadoNome].cidades[cidadeNome].bairros[bairroNome] = {
            id: (loc.bairro as any)?.id,
            nome: bairroNome,
            montanhas: [],
            totalVias: 0
          };
        }
      }

      const montanhas = Array.isArray(loc.montanhas) ? loc.montanhas : [];
      for (const montanha of montanhas) {
        const viasCount = Array.isArray((montanha as any).vias) ? (montanha as any).vias.length : 0;
        const montanhaInfo = {
          id: (montanha as any).id,
          nome: (montanha as any).nome,
          totalVias: viasCount
        };

        if (bairroNome) {
          hierarchy[paisNome].estados[estadoNome].cidades[cidadeNome].bairros[bairroNome].montanhas.push(montanhaInfo);
          hierarchy[paisNome].estados[estadoNome].cidades[cidadeNome].bairros[bairroNome].totalVias += viasCount;
        } else {
          hierarchy[paisNome].estados[estadoNome].cidades[cidadeNome].montanhas.push(montanhaInfo);
        }

        hierarchy[paisNome].estados[estadoNome].cidades[cidadeNome].totalVias += viasCount;
        hierarchy[paisNome].estados[estadoNome].totalVias += viasCount;
        hierarchy[paisNome].totalVias += viasCount;
      }
    }

    return Object.values(hierarchy).map((pais: any) => ({
      ...pais,
      estados: Object.values(pais.estados).map((estado: any) => ({
        ...estado,
        cidades: Object.values(estado.cidades).map((cidade: any) => ({
          ...cidade,
          bairros: cidade.bairros ? Object.values(cidade.bairros) : []
        }))
      }))
    }));
  }

  async getStatsForExplorer(): Promise<any> {
    const viasQuery = `
      SELECT 
        COUNT(DISTINCT v.id) as total_vias,
        COUNT(DISTINCT v."montanhaId") as total_montanhas,
        COUNT(DISTINCT l."paisId") as total_paises,
        COUNT(DISTINCT l."estadoId") as total_estados,
        COUNT(DISTINCT l."cidadeId") as total_cidades,
        STRING_AGG(DISTINCT v.modalidade, ',') as modalidades,
        COUNT(DISTINCT CASE WHEN v.via_cerj = true THEN v.id END) as vias_cerj
      FROM via v
      LEFT JOIN montanha m ON v."montanhaId" = m.id
      LEFT JOIN montanha_localizacoes ml ON m.id = ml."montanhaId"
      LEFT JOIN localizacao l ON ml."localizacaoId" = l.id
    `;

    const result = await this.repository.query(viasQuery);
    
    return result[0];
  }
}
