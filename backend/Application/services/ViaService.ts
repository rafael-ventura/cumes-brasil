import { ViaRepository } from "../../Infrastructure/repositories/ViaRepository";
import { Via } from "../../Domain/models/Via";
import { Croqui } from "../../Domain/models/Croqui";
import { CroquiService } from "./CroquiService";
import { FonteService } from "./FonteService";
import { MontanhaService } from "./MontanhaService";
import { FaceService } from "./FaceService";

export interface IViaService {
  getViaById(id: number): Promise<Via | null>;
}

export class ViaService {
  private repository: ViaRepository;
  private croquiService: CroquiService;
  private fonteService: FonteService;
  private montanhaService: MontanhaService;
  private faceService: FaceService;

  constructor(
    repository: ViaRepository,
    croquiService: CroquiService,
    fonteService: FonteService,
    montanhaService: MontanhaService,
    faceService: FaceService
  ) {
    this.repository = repository;
    this.croquiService = croquiService;
    this.fonteService = fonteService;
    this.montanhaService = montanhaService;
    this.faceService = faceService;
  }

  async getViaById(id: number): Promise<Via | null | undefined> {
    if (!id) {
      throw new Error("ID da via não fornecido");
    } else if (isNaN(id)) {
      throw new Error("ID da via inválido");
    }
    try {
      const via = await this.repository.getViaById(id);
      if (!via) {
        throw new Error("Via não encontrada");
      }

      //TODO: Aqui nos poderiamos chamar o serviço de croqui para buscar os croquis da via.
      //TODO: Dai, caso ele precicasse fazer alguma validacao ou algo alem da busca, ele poderia fazer.
      const croquisIds = await this.croquiService.getCroquisIdsByViaId(id);

      if (croquisIds) {
        const croquisPromises = croquisIds.map(async (croquiId: number) => {
          return await this.croquiService.getCroquiById(croquiId);
        });
        const croquis = await Promise.all(croquisPromises);
        via.croquis = croquis.filter((croqui) => croqui !== null) as Croqui[];
      } else {
        via.croquis = [];
      }

      return via;
    } catch (error) {
      if ((error as Error).message === "Fonte não encontrada") {
        return null;
      }
    }
  }

  async getVias(): Promise<Via[] | null> {
    const vias = await this.repository.getVias();

    if (!vias || vias.length === 0) {
      throw new Error("Nenhuma via encontrada");
    }

    const promises = vias.map(async (via) => {
      const croquisIds = await this.croquiService.getCroquisIdsByViaId(via.id);
      if (croquisIds) {
        const croquisPromises = croquisIds.map(async (croquiId: number) => {
          return await this.croquiService.getCroquiById(croquiId);
        });
        const croquis = await Promise.all(croquisPromises);
        via.croquis = croquis.filter((croqui) => croqui !== null) as Croqui[];
      } else {
        via.croquis = [];
      }
      return via;
    });

    return await Promise.all(promises);
  }

  async createVia(via: Via): Promise<void> {
    try {
      // Verificar se a fonte existe
      const fonteExiste = await this.fonteService.getFonteById(via.fonte_id);
      if (!fonteExiste) {
        throw new Error(
          "É necessário existir uma fonte antes da criação da via"
        );
      }

      // Verificar se a montanha existe
      const montanhaExiste = await this.montanhaService.getMontanhaById(
        via.montanha_id
      );
      if (!montanhaExiste) {
        throw new Error(
          "É necessário existir uma montanha antes da criação da via"
        );
      }

      // Verificar se a face existe
      const faceExiste = await this.faceService.getFaceById(via.face_id);
      if (!faceExiste) {
        throw new Error(
          "É necessário existir uma face antes da criação da via"
        );
      }

      // Se todas as verificações passarem, então podemos criar a via
      return this.repository.createVia(via);
    } catch (error) {
      // Lidar com a exceção de forma apropriada, como registrar em log ou retornar uma mensagem de erro
      console.error("Erro ao criar via:", error);
      // Você pode optar por relançar a exceção se desejar que ela seja tratada em um nível superior
      throw error;
    }
  }

  async updateVia(via: Via): Promise<void> {
    try {
      if (!via.id) {
        throw new Error("ID da via não fornecido");
      }
      const viaExiste = await this.getViaById(via.id);
      if (!viaExiste) {
        throw new Error("Montanha não encontrada");
      }
      // Verificar se a fonte existe
      const fonteExiste = await this.fonteService.getFonteById(via.fonte_id);
      if (!fonteExiste) {
        throw new Error(
          "É necessário existir uma fonte antes da criação da via"
        );
      }

      // Verificar se a montanha existe
      const montanhaExiste = await this.montanhaService.getMontanhaById(
        via.montanha_id
      );
      if (!montanhaExiste) {
        throw new Error(
          "É necessário existir uma montanha antes da criação da via"
        );
      }

      // Verificar se a face existe
      const faceExiste = await this.faceService.getFaceById(via.face_id);
      if (!faceExiste) {
        throw new Error(
          "É necessário existir uma face antes da criação da via"
        );
      }

      // Se todas as verificações passarem, então podemos criar a via

      // Adicione suas regras de validação aqui antes de atualizar a via
      return this.repository.updateVia(via);
    } catch (error) {
      // Lidar com a exceção de forma apropriada, como registrar em log ou retornar uma mensagem de erro
      console.error("Erro ao criar via:", error);
      // Você pode optar por relançar a exceção se desejar que ela seja tratada em um nível superior
      throw error;
    }
  }

  async deleteVia(id: number): Promise<void> {
    if (!(await this.getViaById(id))) {
      throw new Error("Via não encontrada");
    }
    return this.repository.deleteVia(id);
  }

  async getCroquisByViaId(id: number): Promise<Croqui[] | null> {
    const via = await this.getViaById(id);
    if (!via) {
      throw new Error("Via não encontrada");
    }
    var croquis = this.repository.getCroquisByViaId(id);
    if (!croquis) {
      throw new Error("Nenhum croqui encontrado");
      //@ts-ignore
    } else if (croquis.length == 0) {
      throw new Error("Nenhum croqui encontrado");
    }
    return croquis;
  }
}
