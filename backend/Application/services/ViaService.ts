// ViaService.ts
import {ViaRepository} from '../../Infrastructure/repositories/ViaRepository';
import {ViaAdapter} from '../../Infrastructure/adapters/ViaAdapter';
import {ViaDto} from "../../../shared/contratos/ViaDto";
import {Via} from "../../Domain/models/Via";
import {Croqui} from "../../Domain/models/Croqui";
import {Montanha} from "../../Domain/models/Montanha";
import {Face} from "../../Domain/models/Face";
import {Fonte} from "../../Domain/models/Fonte";

//TODO: Adicionar métodos de validação de dados, logica de negócio e tratamento de erros.


export class ViaService {
    private repo: ViaRepository;

    constructor(repo: ViaRepository) {
        this.repo = repo;

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

        const montanha = await this.getMontanhaById(viaDTO.montanha as number);
        if (!montanha) {
            throw new Error('Montanha não registrada no banco de dados.');
        }
        const face = await this.getFaceById(viaDTO.face as number);
        if (!face) {
            throw new Error('Face não registrada no banco de dados.');
        }
        const fonte = await this.getFonteById(viaDTO.fonte as number);
        if (!fonte) {
            throw new Error('Fonte não registrada no banco de dados.');
        }
        // Converter ViaDTO para a entidade Via
        const via = ViaAdapter.fromDto(viaDTO);


        // Salvar Via no RavenDB
        await this.repo.createVia(ViaAdapter.toRavenDBDocument(via, montanha, face, fonte));

        // Retornar a Via criada
        return via;
    }


    async updateVia(viaDTO: ViaDto): Promise<Via> {

        const montanha = await this.getMontanhaById(viaDTO.montanha as number);
        if (!montanha) {
            throw new Error('Montanha não registrada no banco de dados.');
        }
        const face = await this.getFaceById(viaDTO.face as number);
        if (!face) {
            throw new Error('Face não registrada no banco de dados.');
        }
        const fonte = await this.getFonteById(viaDTO.fonte as number);
        if (!fonte) {
            throw new Error('Fonte não registrada no banco de dados.');
        }

        // Converter ViaDTO para a entidade Via
        const via = ViaAdapter.fromDto(viaDTO);
        // Salvar Via
        await this.repo.updateVia(ViaAdapter.toRavenDBDocument(via, montanha, face, fonte));
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
