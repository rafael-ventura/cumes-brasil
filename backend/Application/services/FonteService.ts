import {FonteRepository} from "../../Infrastructure/repositories/FonteRepository";
import {Fonte} from "../../Domain/models/Fonte";
import {IFonteService} from "../../Domain/interfaces/services/IFonteService";
import {FonteDto} from "../../../shared/contratos/ViaDto";


export class FonteService implements IFonteService {

    private fonteRepository: FonteRepository;

    constructor(fonteRepository: FonteRepository) {
        this.fonteRepository = fonteRepository;
    }

    async createFonte(fonte: Fonte) {
        await this.fonteRepository.createFonte(fonte);
        return fonte;
    }

    async updateFonte(fonte: Fonte) {
        await this.fonteRepository.updateFonte(fonte);
        return fonte;
    }

    async deleteFonte(id_fonte: number) {
        const fonte = await this.fonteRepository.getFonteById(id_fonte);
        await this.fonteRepository.deleteFonte(fonte);

    }

    async getAllFontes(): Promise<Fonte[]> {
        const fontes = await this.fonteRepository.getAllFontes();
        return fontes;
    }

    async getFonteById(id_fonte: number): Promise<Fonte> {
        const fonte = await this.fonteRepository.getFonteById(id_fonte);
        return fonte;
    }

    async associoarFonteVia(fonte: Fonte, id_via: number) {
        await this.fonteRepository.associarFonteVia(fonte, id_via);
        return fonte;
    }

}