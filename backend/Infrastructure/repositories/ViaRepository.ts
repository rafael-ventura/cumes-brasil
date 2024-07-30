//src/Infrastructure/repositories/ViaRepository.ts
import { Via } from "../../Domain/entities/Via";
import { AppDataSource } from "../config/db";
import {ISearchRepository} from "../../Domain/interfaces/repositories/ISearchRepository";
import {ISearchResult} from "../../Domain/interfaces/models/ISearchResult";

export class ViaRepository implements ISearchRepository<Via>{

  private repository = AppDataSource.getRepository(Via);
  async getById (id: number): Promise<Via | null> {
    return this.repository.createQueryBuilder("via")
      .leftJoinAndSelect("via.montanha", "montanha")
      .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
      .leftJoinAndSelect("via.fonte", "fonte")
      .leftJoinAndSelect("via.face", "face")
      .leftJoinAndSelect("via.imagem", "imagem")
      .leftJoinAndSelect("via.croquis", "croquis")
      .where("via.id = :id", { id })
      .getOne();
  }

  async getAll (): Promise<Via[]> {
    return await this.repository.createQueryBuilder("via")
      .leftJoinAndSelect("via.montanha", "montanha")
      .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
      .leftJoinAndSelect("via.fonte", "fonte")
      .leftJoinAndSelect("via.face", "face")
      .leftJoinAndSelect("via.imagem", "imagem")
      .leftJoinAndSelect("via.croquis", "croquis")
      .getMany();
  }

  async create (via: Partial<Via>): Promise<void> {
    await this.repository.insert(via);
  }

  async update (id: number, viaData: Partial<Via>): Promise<void> {
    await this.repository.update(id as any, viaData);
  }

  async delete (id: number): Promise<void> {
    await this.repository.delete(id as any);
  }

  async getViasByColecaoId (colecaoId: number): Promise<Via[]> {
    return await this.repository.createQueryBuilder("via")
      .leftJoinAndSelect("via.viasColecoes", "viasColecoes")
      .leftJoinAndSelect("via.montanha", "montanha")
      .leftJoinAndSelect("via.viaPrincipal", "viaPrincipal")
      .leftJoinAndSelect("via.fonte", "fonte")
      .leftJoinAndSelect("via.face", "face")
      .leftJoinAndSelect("via.imagem", "imagem")
      .leftJoinAndSelect("via.croquis", "croquis")
      .where("viasColecoes.colecao_id = :colecaoId", { colecaoId })
      .getMany();
  }


  async search(query: any): Promise<ISearchResult<Via>> {
    console.log("Query received:", query); // Adicione esta linha para depuração
    const { searchQuery, selectedMountain, selectedDifficulty, selectedCrux, selectedExtensionCategory, page = 1, itemsPerPage = 10 } = query;

    let qb = this.repository.createQueryBuilder('via')
        .leftJoinAndSelect('via.montanha', 'montanha'); // Junção com a tabela Montanha

    if (searchQuery) {
      qb = qb.andWhere('via.nome LIKE :searchQuery', { searchQuery: `%${searchQuery}%` });
    }

    if (selectedMountain) {
      qb = qb.andWhere('montanha.nome = :selectedMountain', { selectedMountain }); // Filtra pelo nome da montanha
    }

    if (selectedDifficulty) {
      qb = qb.andWhere('via.grau = :selectedDifficulty', { selectedDifficulty });
    }

    if (selectedCrux) {
        qb = qb.andWhere('via.crux = :selectedCrux', { selectedCrux });
    }

    if (selectedExtensionCategory) {
      qb = qb.andWhere('via.extensao >= :minExtension AND via.extensao <= :maxExtension', {
        minExtension: selectedExtensionCategory[0],
        maxExtension: selectedExtensionCategory[1]
      });
    }

    // Contar o total de itens
    const totalItems = await qb.getCount();

    // Buscar itens paginados
    const items = await qb
        .skip((page - 1) * itemsPerPage)
        .take(itemsPerPage)
        .getMany();

    // Calcular total de páginas
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    console.log("Query result:", { items, totalItems, totalPages });
    return {
      items,
      totalPages,
      totalItems
    };
  }
}
