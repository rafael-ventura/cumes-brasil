"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViaService = void 0;
class ViaService {
    constructor(repository, croquiRepository) {
        this.repository = repository;
        this.croquiRepository = croquiRepository;
    }
    async getViaById(id) {
        const via = await this.repository.getViaById(id);
        if (!via) {
            throw new Error("Via não encontrada");
        }
        //TODO: Aqui nos poderiamos chamar o serviço de croqui para buscar os croquis da via.
        // TODO: Dai, caso ele precicasse fazer alguma validacao ou algo alem da busca, ele poderia fazer.
        const croquisIds = await this.croquiRepository.getCroquisIdsByViaId(id);
        if (croquisIds) {
            const croquisPromises = croquisIds.map(async (croquiId) => {
                return await this.croquiRepository.getCroquiById(croquiId);
            });
            const croquis = await Promise.all(croquisPromises);
            via.croquis = croquis.filter((croqui) => croqui !== null);
        }
        else {
            via.croquis = [];
        }
        return via;
    }
    async getVias() {
        var vias = this.repository.getVias();
        if (!vias) {
            throw new Error("Nenhuma via encontrada");
            //@ts-ignore
        }
        else if (vias.length == 0) {
            throw new Error("Nenhuma via encontrada");
        }
        return vias;
    }
    async createVia(via) {
        if (await this.getViaById(via.id)) {
            throw new Error("Via já existente");
        }
        return this.repository.createVia(via);
    }
    async updateVia(via) {
        if (!(await this.getViaById(via.id))) {
            throw new Error("Via não encontrada");
        }
        return this.repository.updateVia(via);
    }
    async deleteVia(id) {
        if (!(await this.getViaById(id))) {
            throw new Error("Via não encontrada");
        }
        return this.repository.deleteVia(id);
    }
    async getCroquisByViaId(id) {
        const via = await this.getViaById(id);
        if (!via) {
            throw new Error("Via não encontrada");
        }
        var croquis = this.repository.getCroquisByViaId(id);
        if (!croquis) {
            throw new Error("Nenhum croqui encontrado");
            //@ts-ignore
        }
        else if (croquis.length == 0) {
            throw new Error("Nenhum croqui encontrado");
        }
        return croquis;
    }
    async getCroquiIdsByViaId(id) {
        return this.repository.getCroquiIdsByViaId(id);
    }
}
exports.ViaService = ViaService;
