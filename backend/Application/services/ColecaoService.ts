// ViaService.ts
import {ViaRepository} from '../../Infrastructure/repositories/ViaRepository';
import {ViaAdapter} from '../../Infrastructure/adapters/ViaAdapter';
import {ViaDto} from "../../../shared/contratos/ViaDto";
import {Montanha} from "../../Domain/models/Montanha";
import {Face} from "../../Domain/models/Face";
import {Fonte} from "../../Domain/models/Fonte";
import {MontanhaRepository} from "../../Infrastructure/repositories/MontanhaRepository";
import {Via} from "../../Domain/models/Via";

//TODO: Adicionar métodos de validação de dados, logica de negócio e tratamento de erros.

export class ColecaoService {
    private viaRepository: ViaRepository;
    private viaAdapter: ViaAdapter;
    private montanhaRepository: MontanhaRepository;

    constructor(viaRepository: ViaRepository, viaAdapter: ViaAdapter, montanhaRepository: MontanhaRepository) {
        this.viaRepository = viaRepository;
        this.viaAdapter = new ViaAdapter();
        this.montanhaRepository = montanhaRepository;
    }

    public async getVias(): Promise<Via[]> {
        const vias = await this.viaRepository.getAll();
        return vias;
    }

    public async getVia(id: number): Promise<Via | null> {
        const via = await this.viaRepository.getViaById(id);
        return via;

        return vias.map(via => this.viaAdapter.toDto(via));
    }

    public async createVia(viaDto: ViaDto): Promise<void> {
        const via = this.viaAdapter.fromDto(viaDto);
        const montanha = await this.viaRepository.getMontanhaById(via.montanha!);
        const face = await this.viaRepository.getFaceById(via.id_face!);
        const fonte = await this.viaRepository.getFonteById(via.id_fonte!);

        await this.viaRepository.createVia(this.viaAdapter.toRavenDBDocument(via, montanha, face, fonte));
    }

    public async updateVia(viaDto: ViaDto): Promise<void> {
        const via = this.viaAdapter.fromDto(viaDto);
        const montanha = await this.viaRepository.getMontanhaById(via.montanha!);
        const face = await this.viaRepository.getFaceById(via.id_face!);
        const fonte = await this.viaRepository.getFonteById(via.id_fonte!);
        await this.viaRepository.updateVia(this.viaAdapter.toRavenDBDocument(via, montanha, face, fonte));
    }

    public async deleteVia(id: number): Promise<void> {
        await this.viaRepository.deleteVia(id);
    }

    public async getMontanhas(): Promise<Montanha[]> {
        return await this.viaRepository.getMontanhas();
    }



}
