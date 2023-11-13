// ViaService.ts
import {ViaRepository} from '../../Infrastructure/repositories/ViaRepository';
import {ViaAdapter} from '../../Infrastructure/adapters/ViaAdapter';
import {ViaDto} from "../../../shared/contratos/ViaDto";
import {Montanha} from "../../Domain/models/Montanha";
import {Face} from "../../Domain/models/Face";
import {Fonte} from "../../Domain/models/Fonte";

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
        return vias.map(via => this.viaAdapter.toRavenDBDocument(via, via.montanha, via.face, via.fonte));
    }

    public async getVia(id: number): Promise<ViaDto | null> {
        const via = await this.viaRepository.getViaById(id);
        return this.viaAdapter.d
    }

    public async createVia(viaDto: ViaDto): Promise<void> {
        const via = this.viaAdapter.fromDto(viaDto);
        const montanha = await this.viaRepository.getMontanhaById(via.id_montanha!);
        const face = await this.viaRepository.getFaceById(via.id_face!);
        const fonte = await this.viaRepository.getFonteById(via.id_fonte!);
        await this.viaRepository.createVia(this.viaAdapter.toRavenDBDocument(via, montanha, face, fonte));
    }

    public async updateVia(viaDto: ViaDto): Promise<void> {
        const via = this.viaAdapter.fromDto(viaDto);
        await this.viaRepository.updateVia(this.viaAdapter.toRavenDBDocument(via, via.montanha, via.face, via.fonte));
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
