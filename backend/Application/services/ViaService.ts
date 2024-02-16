import {ViaRepository} from "../../Infrastructure/repositories/ViaRepository";
import {Via} from "../../Domain/models/Via";
import {Croqui} from "../../Domain/models/Croqui";

export interface IViaService {
    getViaById(id: number): Promise<Via | null>;
}

export class ViaService {
    private repository: ViaRepository;
    private croquiRepository: any;

    constructor(repository: ViaRepository, croquiRepository: any) {
        this.repository = repository;
        this.croquiRepository = croquiRepository;
    }

    async getViaById(id: number): Promise<Via | null> {
        const via = await this.repository.getViaById(id);

        if (!via) {
            throw new Error("Via não encontrada");
        }

        //TODO: Aqui nos poderiamos chamar o serviço de croqui para buscar os croquis da via.
        // TODO: Dai, caso ele precicasse fazer alguma validacao ou algo alem da busca, ele poderia fazer.
        const croquisIds = await this.croquiRepository.getCroquisIdsByViaId(id);

        if (croquisIds) {
            const croquisPromises = croquisIds.map(
                async (croquiId: number) => {
                    return await this.croquiRepository.getCroquiById(croquiId);
                }
            );
            const croquis = await Promise.all(croquisPromises);
            via.croquis = croquis.filter((croqui) => croqui !== null) as Croqui[];
        } else {
            via.croquis = [];
        }

        return via;

    }

    async getVias(): Promise<Via[] | null> {
        var vias = this.repository.getVias();
        if (!vias) {
            throw new Error("Nenhuma via encontrada");
            //@ts-ignore
        } else if (vias.length == 0) {
            throw new Error("Nenhuma via encontrada");
        }
        return vias;
    }

    async createVia(via: Via): Promise<void> {
        if (await this.getViaById(via.id)) {
            throw new Error("Via já existente");
        }
        return this.repository.createVia(via);
    }

    async updateVia(via: Via): Promise<void> {
        if (!(await this.getViaById(via.id))) {
            throw new Error("Via não encontrada");
        }
        return this.repository.updateVia(via);
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

    async getCroquiIdsByViaId(id: number): Promise<number[] | null> {
        return this.repository.getCroquiIdsByViaId(id);
    }
}
