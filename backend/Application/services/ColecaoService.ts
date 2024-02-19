import { ColecaoRepository } from "../../Infrastructure/repositories/ColecaoRepository";
import { Colecao } from "../../Domain/models/Colecao";
import { Via } from "../../Domain/models/Via";
import { ViaService } from "./ViaService";
import { UsuarioService } from "./UsuarioService";

export class ColecaoService {
  private repository: ColecaoRepository;
  private viaService: ViaService;
  private usuarioService: UsuarioService;

  constructor(
    repository: ColecaoRepository,
    viaService: ViaService,
    usuarioService: UsuarioService
  ) {
    this.repository = repository;
    this.viaService = viaService;
    this.usuarioService = usuarioService;
  }

  async getColecaoById(id: number): Promise<Colecao | null> {
    const colecao = await this.repository.getColecaoById(id);

    if (!colecao) {
      throw new Error("Coleção não encontrada");
    }

    const vias_ids = await this.getViasIdsByColecaoId(id);

    if (!vias_ids) {
      throw new Error("Nenhuma via encontrada");
    }

    const promises = vias_ids.map(async (via_id: number) => {
      const via = await this.viaService.getViaById(via_id);
      return via;
    });

    const vias = await Promise.all(promises);

    colecao.vias = vias.filter((via) => via !== null) as Via[];

    return colecao;
  }

  // TODO: Se nao estamos usando, precisamos ter?
  // TODO: Resposta: Ele é usado em na talema ViasColecoes para pegar as vias de uma colecao.
  // TODO: Necessario para a funcionalidade de listar vias de uma coleção
  async getViasIdsByColecaoId(colecaoId: number): Promise<number[] | null> {
    const viasIdsColecoes = await this.repository.getViasIdsByColecaoId(
      colecaoId
    );
    if (!viasIdsColecoes) {
      return null;
    }
    return viasIdsColecoes.map((viasIdsColecoes) => viasIdsColecoes.via_id);
  }

  async getColecoesByUsuarioId(usuario_id: number): Promise<Colecao[] | null> {
    if (!usuario_id || isNaN(usuario_id)) {
      throw new Error("ID de usuário inválido");
    }

    const colecoes = await this.getColecoes();

    if (!colecoes) {
      throw new Error("Nenhuma coleção encontrada");
    }

    const colecoesDoUsuario = colecoes.filter(
      (colecao) => colecao.usuario_id === usuario_id
    );

    if (colecoesDoUsuario.length === 0) {
      return null; // Retorna null se não houver coleções para o usuário
    }

    return colecoesDoUsuario;
  }

  async getColecoes(): Promise<Colecao[] | null> {
    const colecoes = await this.repository.getColecoes();
    if (!colecoes) {
      throw new Error("Nenhuma coleção encontrada");
    }

    for (let i = 0; i < colecoes.length; i++) {
      const vias_ids = await this.getViasIdsByColecaoId(colecoes[i].id);
      if (!vias_ids) {
        throw new Error("Nenhuma via encontrada");
      }
      const viasPromises = vias_ids.map(async (id: number) => {
        return await this.viaService.getViaById(id);
      });

      const vias = await Promise.all(viasPromises);
      colecoes[i].vias = vias.filter((via) => via !== null) as Via[];
    }

    return colecoes;
  }

  async createColecao(colecao: Colecao): Promise<void> {
    try {
      const usuarioExiste = await this.usuarioService.getUsuarioById(
        colecao.usuario_id
      );
      if (!usuarioExiste) {
        throw new Error(
          "É necessário informar um usuário válido para criar uma escalada"
        );
      }

      return this.repository.createColecao(colecao);
    } catch (error) {
      console.error("Erro ao criar Escalada:", error);
      throw error;
    }
  }

  async updateColecao(colecao: Colecao): Promise<void> {
    if (!(await this.getColecaoById(colecao.id))) {
      throw new Error("Coleção não encontrada");
    }
    return this.repository.updateColecao(colecao);
  }

  async deleteColecao(id: number): Promise<void> {
    if (!(await this.getColecaoById(id))) {
      throw new Error("Coleção não encontrada");
    }
    return this.repository.deleteColecao(id);
  }

  async addVia(via_id: number, colecao_id: number): Promise<void> {
    const colecao = await this.getColecaoById(colecao_id);
    if (!colecao) {
      throw new Error("Coleção não encontrada");
    }
    const via = await this.viaService.getViaById(via_id);
    if (!via) {
      throw new Error("Via não encontrada");
    }
    return this.repository.addVia(via_id, colecao_id);
  }

  async removeVia(via_id: number, colecao_id: number): Promise<void> {
    const colecao = await this.getColecaoById(colecao_id);
    if (!colecao) {
      throw new Error("Coleção não encontrada");
    }
    const via = await this.viaService.getViaById(via_id);
    if (!via) {
      throw new Error("Via não encontrada");
    }
    return this.repository.removeVia(via_id, colecao_id);
  }
}
