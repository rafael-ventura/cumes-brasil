import { Escalada } from "../../Domain/models/Escalada";
import { EscaladaRepository } from "../../Infrastructure/repositories/EscaladaRepository";
import { UsuarioService } from "./UsuarioService";
import { ViaService } from "./ViaService";

export class EscaladaService {
  private repository: EscaladaRepository;
  private usuarioService: UsuarioService;
  private viaService: ViaService;

  constructor(
    repository: EscaladaRepository,
    usuarioService: UsuarioService,
    viaService: ViaService
  ) {
    this.repository = repository;
    this.usuarioService = usuarioService;
    this.viaService = viaService;
  }

  async getEscaladaById(id: number): Promise<Escalada | null> {
    if (!id) {
      throw new Error("ID da fonte não fornecido");
    } else if (isNaN(id)) {
      throw new Error("ID da fonte inválido");
    }

    try {
      const escalada = await this.repository.getEscaladaById(id);
      return escalada;
    } catch (error) {
      // Se a escalada não for encontrada, retornar null em vez de lançar uma exceção
      if ((error as Error).message === "Escalada não encontrada") {
        return null;
      }
      // Se ocorrer outro tipo de erro, relançar a exceção
      throw error;
    }
  }

  async getEscaladas(): Promise<Escalada[] | null> {
    const escaladas = await this.repository.getEscaladas();
    if (!escaladas) {
      throw new Error("Nenhuma escalada encontrada");
    }
    return escaladas;
  }

  async createEscalada(escalada: Escalada): Promise<void> {
    try {
      const viaExiste = await this.viaService.getViaById(escalada.via_id);
      if (!viaExiste) {
        throw new Error(
          "É necessário informar uma via válida para criar uma escalada"
        );
      }

      const usuarioExiste = await this.usuarioService.getUsuarioById(
        escalada.usuario_id
      );
      if (!usuarioExiste) {
        throw new Error(
          "É necessário informar um usuário válido para criar uma escalada"
        );
      }

      return this.repository.createEscalada(escalada);
    } catch (error) {
      console.error("Erro ao criar Escalada:", error);
      throw error;
    }

    // Aqui você pode adicionar outras regras de validação antes de criar a escalada
  }

  async updateEscalada(escalada: Escalada): Promise<void> {
    try {
      const escaladaExiste = await this.repository.getEscaladaById(escalada.id);
      if (!escaladaExiste) {
        throw new Error("Escalada não encontrada");
      }
      // Aqui você pode adicionar outras regras de validação antes de atualizar a escalada

      const viaExiste = await this.viaService.getViaById(escalada.via_id);
      if (!viaExiste) {
        throw new Error(
          "É necessário informar uma via válida para criar uma escalada"
        );
      }

      const usuarioExiste = await this.usuarioService.getUsuarioById(
        escalada.usuario_id
      );
      if (!usuarioExiste) {
        throw new Error(
          "É necessário informar um usuário válido para criar uma escalada"
        );
      }
      return this.repository.updateEscalada(escalada);
    } catch (error) {
      console.error("Erro ao criar Escalada:", error);
      throw error;
    }
  }

  async deleteEscalada(id: number): Promise<void> {
    const escaladaExiste = await this.repository.getEscaladaById(id);
    if (!escaladaExiste) {
      throw new Error("Escalada não encontrada");
    }
    return this.repository.deleteEscalada(id);
  }

  async getEscaladasDoUsuario(usuario_id: number): Promise<Escalada[] | null> {
    if (!usuario_id) {
      throw new Error("ID do usuário não fornecido");
    } else if (isNaN(usuario_id)) {
      throw new Error("ID do usuário inválido");
    }
    const escaladas = await this.repository.getEscaladasDoUsuario(usuario_id);
    if (!escaladas) {
      throw new Error("Nenhuma escalada encontrada para este usuário");
    }
    return escaladas;
  }
}
