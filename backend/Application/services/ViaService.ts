// ViaService.ts
import {ViaRepository} from '../../Infrastructure/repositories/ViaRepository';
import {ViaAdapter} from '../../Infrastructure/adapters/ViaAdapter';
import {ViaDto} from "../../../shared/contratos/ViaDto";
import {Via} from "../../Domain/models/Via";
import {Croqui} from "../../Domain/models/Croqui";

//TODO: Adicionar métodos de validação de dados, logica de negócio e tratamento de erros.

export class ViaService {
    private repo: ViaRepository;

    constructor(repo: ViaRepository) {
        this.repo = repo;
    }

    async createVia(viaDTO: ViaDto): Promise<Via> {
        // Converter ViaDTO para a entidade Via
        const via = ViaAdapter.fromDto(viaDTO);
        via.associarCroqui(viaDTO.croqui as any);
        // Salvar Via
        await this.repo.createVia(ViaAdapter.toRavenDBDocument(via));

        // Caso tenha dado tudo certo, retornar a Via
        return via;
    }

    async updateVia(viaDTO: ViaDto): Promise<Via> {
        // Converter ViaDTO para a entidade Via
        const via = ViaAdapter.fromDto(viaDTO);
        // Salvar Via
        await this.repo.updateVia(ViaAdapter.toRavenDBDocument(via));
        // Caso tenha dado tudo certo, retornar a Via
        return via;
    }

    async getAll(): Promise<Via[]> {
        // Buscar todas as Vias
        const vias = await this.repo.getAll();
        // Converter todas as Vias para ViaDTO e retornar
        return vias;
    }


    async getViaById(id: string): Promise<Via> {
        // Buscar Via por ID
        const via = await this.repo.getViaById(id);

        return via;
    }

    async getViaDetailedById(id: string): Promise<Via> {
        // Buscar Via por ID
        const via = await this.repo.getViaById(id);

        return via;
    }

    async deleteVia(id: string): Promise<void> {
        // Deletar Via por ID
        await this.repo.deleteVia(id);
    }

}
