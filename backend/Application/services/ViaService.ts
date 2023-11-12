// ViaService.ts
import {ViaRepository} from '../../Infrastructure/repositories/ViaRepository';
import {ViaAdapter} from '../../Infrastructure/adapters/ViaAdapter';
import {ViaDto} from "../../../shared/contratos/ViaDto";
import {Via} from "../../Domain/models/Via";
import {Montanha} from "../../Domain/models/Montanha";
import {Face} from "../../Domain/models/Face";
import {Fonte} from "../../Domain/models/Fonte";

//TODO: Adicionar métodos de validação de dados, logica de negócio e tratamento de erros.

export class ViaService {
    private repo: ViaRepository;
    private adapter: ViaAdapter;

    constructor(repo: ViaRepository) {
        this.repo = repo;
        this.adapter = new ViaAdapter();

    }

    async getMontanhaById(id_montanha: number): Promise<Montanha> {
        // Buscar Montanha por ID
        const montanha = await this.repo.getMontanhaById(id_montanha);
        return montanha;
    }

    async getFaceById(id_face: number): Promise<Face> {
        // Buscar Face por ID
        const face = await this.repo.getFaceById(id_face);
        return face;
    }

    async getFonteById(id_fonte: number): Promise<Fonte> {
        // Buscar Fonte por ID
        const fonte = await this.repo.getFonteById(id_fonte);
        return fonte;
    }

    async createVia(viaDTO: ViaDto): Promise<Via> {
        // Converter ViaDTO para a entidade Via
        const via = this.adapter.fromDto(viaDTO);
        const montanha = viaDTO.montanha as Montanha;
        const face = viaDTO.face as Face;
        const fonte = viaDTO.fonte as Fonte;

        // Salvar Via no RavenDB
        await this.repo.createVia(this.adapter.toRavenDBDocument(via, montanha, face, fonte));

        // Retornar a Via criada
        return via;
    }


    async updateVia(viaDTO: ViaDto): Promise<Via> {

        // Converter ViaDTO para a entidade Via
        const via = this.adapter.fromDto(viaDTO);
        const montanha = viaDTO.montanha ? await this.getMontanhaById(via.id_montanha!) : undefined;
        const face = viaDTO.face ? await this.getFaceById(via.id_face!) : undefined;
        const fonte = viaDTO.fonte ? await this.getFonteById(via.id_fonte!) : undefined;
        if (!montanha || !face || !fonte) {
            throw new Error('Montanha, Face ou Fonte não registrada no banco de dados.');
        }

        // Salvar Via
        await this.repo.updateVia(this.adapter.toRavenDBDocument(via, montanha, face, fonte));
        // Caso tenha dado tudo certo, retornar a Via
        return via;
    }

    async getAll(): Promise<Via[]> {
        // Buscar todas as Vias
        const vias = await this.repo.getAll();
        // Converter todas as Vias para ViaDTO e retornar
        return vias;
    }


    async getViaById(id: any): Promise<Via> {
        // Buscar Via por ID
        const via = await this.repo.getViaById(id);

        return via;
    }

    async deleteVia(id: number): Promise<void> {
        // Buscar Via por ID
        const via = await this.repo.getViaById(id);
        if (!via) {
            throw new Error('Via não encontrada');
        }
        // Remover Via
        await this.repo.deleteVia(via.id);
    }

}
