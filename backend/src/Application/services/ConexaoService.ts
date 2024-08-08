import { DataSource } from "typeorm";

export class ConexaoService {
    private dataSource: DataSource;

    constructor (dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    async healthCheck (): Promise<boolean> {
        return this.dataSource.isInitialized;
    }

}
