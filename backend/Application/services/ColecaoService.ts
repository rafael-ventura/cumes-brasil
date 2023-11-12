// ViaService.ts
import {ViaRepository} from '../../Infrastructure/repositories/ViaRepository';
import {ViaAdapter} from '../../Infrastructure/adapters/ViaAdapter';
import {ViaDto} from "../../../shared/contratos/ViaDto";
import {Montanha} from "../../Domain/models/Montanha";
import {Face} from "../../Domain/models/Face";
import {Fonte} from "../../Domain/models/Fonte";
import {Via} from "../../Domain/models/Via";

//TODO: Adicionar métodos de validação de dados, logica de negócio e tratamento de erros.

export class ColecaoService {
    private viaRepository: ViaRepository;
    private viaAdapter: ViaAdapter;

    constructor(viaRepository: ViaRepository, viaAdapter: ViaAdapter) {
        this.viaRepository = viaRepository;
        this.viaAdapter = viaAdapter;
    }

    public async getVias(): Promise<ViaDto[]> {
        const vias = await this.viaRepository.getAll();

        return vias.map(via => this.viaAdapter.toDto(via));
    }

    public async getVia(id: number): Promise<ViaDto | null> {
        const via = await this.viaRepository.getViaById(id);
        return via ? this.viaAdapter.toDto(via) : null;
    }

    public async createVia(viaDto: ViaDto): Promise<void> {
        const via = this.viaAdapter.fromDto(viaDto);
        const montanha = via.id_montanha ? await this.viaRepository.getMontanhaById(via.id_montanha!) : undefined;
        const face = via.id_face ? await this.viaRepository.getFaceById(via.id_face!) : undefined;
        const fonte = via.id ? await this.viaRepository.getFonteById(via.id_fonte!) : undefined;

        await this.viaRepository.createVia(this.viaAdapter.toRavenDBDocument(via, montanha, face, fonte));
    }

    public async updateVia(viaDto: ViaDto): Promise<void> {
        const via = this.viaAdapter.fromDto(viaDto);
        const montanha = via.id_montanha ? await this.viaRepository.getMontanhaById(via.id_montanha!) : undefined;
        const face = via.id_face ? await this.viaRepository.getFaceById(via.id_face!) : undefined;
        const fonte = via.id ? await this.viaRepository.getFonteById(via.id_fonte!) : undefined;
        await this.viaRepository.updateVia(this.viaAdapter.toRavenDBDocument(via, montanha, face, fonte));
    }

    public async deleteVia(id: number): Promise<void> {
        await this.viaRepository.deleteVia(id);
    }

    public async getMontanhas(): Promise<Montanha[]> {
        return await this.viaRepository.getMontanhas();
    }

    public async getFaces(): Promise<Face[]> {
        return await this.viaRepository.getFaces();
    }

    public async getFontes(): Promise<Fonte[]> {
        return await this.viaRepository.getFontes();
    }


}
