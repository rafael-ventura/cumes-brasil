import {ViaRepository} from "../../Infrastructure/repositories/ViaRepository";
import {Via} from "../../Domain/models/Via";
import {Croqui} from "../../Domain/models/Croqui";
import {CroquiService} from "./CroquiService";
import {FonteService} from "./FonteService";
import {MontanhaService} from "./MontanhaService";
import {FaceService} from "./FaceService";

export interface IViaService {
    getViaById(id: number): Promise<Via | null>;
}

export class ViaService {
    private repository: ViaRepository;
    private croquiService!: CroquiService;
    private fonteService: FonteService;
    private montanhaService: MontanhaService;
    private faceService: FaceService;

    constructor(
        repository: ViaRepository,
        fonteService: FonteService,
        montanhaService: MontanhaService,
        faceService: FaceService
    ) {
        this.repository = repository;
        this.fonteService = fonteService;
        this.montanhaService = montanhaService;
        this.faceService = faceService;
    }

    setCroquiService(croquiService: CroquiService): void {
        this.croquiService = croquiService;
    }

    async getViaById(id: number): Promise<Via | null | undefined> {
        if (!id) {
            throw new Error("ID da via não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da via inválido");
        }
        const via = await this.repository.getViaById(id);
        if (!via) {
            throw new Error("Via não encontrada");
        }
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
        const fonte = await this.fonteService.getFonteById(via.fonte_id);
        if (fonte) {
            via.fonte_id = fonte;
        }
        const montanha = await this.montanhaService.getMontanhaById(via.montanha_id);
        if (montanha) {
            via.montanha_id = montanha;
        }
        const face = await this.faceService.getFaceById(via.face_id);
        if (face) {
            via.face_id = face;
        }

        return via;
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
            const fonte = await this.fonteService.getFonteById(via.fonte_id);
            if (fonte) {
                via.fonte_id = fonte;
            }
            const montanha = await this.montanhaService.getMontanhaById(via.montanha_id);
            if (montanha) {
                via.montanha_id = montanha;
            }
            const face = await this.faceService.getFaceById(via.face_id);
            if (face) {
                via.face_id = face;
            }
            return via;
        });

        return await Promise.all(promises);
    }

    async createVia(via: Via): Promise<void> {
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
            throw new Error("É necessário existir uma face antes da criação da via");
        }
        const result = await this.repository.createVia(via);
        if (result === null) {
            throw new Error("Erro ao criar a via");
        }
        // Se todas as verificações passarem, então podemos criar a via
        return result;
    }

    async updateVia(via: Via): Promise<void> {
        if (!via.id) {
            throw new Error("ID da via não fornecido");
        }
        const viaExiste = await this.repository.getViaById(via.id);
        if (!viaExiste) {
            throw new Error("Montanha não encontrada");
        }
        const fonteExiste = await this.fonteService.getFonteById(via.fonte_id);
        if (!fonteExiste) {
            throw new Error(
                "É necessário existir uma fonte antes da criação da via"
            );
        }
        const montanhaExiste = await this.montanhaService.getMontanhaById(
            via.montanha_id
        );
        if (!montanhaExiste) {
            throw new Error(
                "É necessário existir uma montanha antes da criação da via"
            );
        }
        const faceExiste = await this.faceService.getFaceById(via.face_id);
        if (!faceExiste) {
            throw new Error("É necessário existir uma face antes da criação da via");
        }

        const result = await this.repository.updateVia(via);
        if (result === null) {
            throw new Error("Erro ao atualizar via");
        }
        // Se todas as verificações passarem, então podemos criar a via
        return result;
    }

    async deleteVia(id: number): Promise<void> {
        if (!id) {
            throw new Error("ID da via não fornecido");
        } else if (isNaN(id)) {
            throw new Error("ID da via inválido");
        }
        if (!(await this.repository.getViaById(id))) {
            throw new Error("Via não encontrada");
        }

        const result = await this.repository.deleteVia(id);
        if (result === null) {
            throw new Error("Erro ao deletar a via");
        }
        // Se todas as verificações passarem, então podemos criar a via
        return result;
    }

    async getCroquisByViaId(id: number): Promise<Croqui[] | null> {
        const via = await this.repository.getViaById(id);
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

    async searchVias(query: any): Promise<Via[]> {
        const { searchQuery, selectedMountain, selectedDifficulty, selectedExposure } = query;

        let sqlQuery = 'SELECT * FROM Via WHERE 1=1';
        let parameters: any[] = [];

        if (searchQuery) {
            sqlQuery += ' AND nome LIKE ?';
            parameters.push(`%${searchQuery}%`);
        }

        if (selectedMountain) {
            sqlQuery += ' AND montanha_id = ?';
            parameters.push(selectedMountain);
        }

        if (selectedDifficulty) {
            sqlQuery += ' AND grau = ?';
            parameters.push(selectedDifficulty);
        }

        if (selectedExposure) {
            sqlQuery += ' AND exposicao = ?';
            parameters.push(selectedExposure);
        }

        return await this.repository.query(sqlQuery, parameters);
    }
}
