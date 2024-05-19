/*
TODO: refazer o acesso ao banco, agora que temos ORM
import {ViaRepository} from "../../Infrastructure/repositories/ViaRepository";
import {Via} from "../../Domain/models/Via";
import {SearchRepository} from "../../Infrastructure/repositories/SearchRepository";

export class SearchService {
    private repository: SearchRepository;
    private viaRepository: ViaRepository;

    constructor(
        repository: SearchRepository,
        viaRepository: ViaRepository,
    ) {
        this.repository = repository;
        this.viaRepository = viaRepository;
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

        return await this.viaRepository.query(sqlQuery, parameters);
    }
}
*/
