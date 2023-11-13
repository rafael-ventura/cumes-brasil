import { Via } from "./Via";
import { ColecaoBase } from "./ColecaoBase";
import { IColecaoEscaladas } from "../interfaces/models/IColecaoEscaladas";

export class ColecaoEscaladas extends ColecaoBase implements IColecaoEscaladas {
    private datasEscalada: Map<number, Date[]>;

    constructor() {
        super('Histórico', 'Minhas vias escaladas');
        this.datasEscalada = new Map<number, Date[]>();
    }

    public registrarEscalada(via: Via, data: Date): void {
        // Verifica se a via já existe na coleção
        if (!this.vias.includes(via)) {
            this.adicionarVia(via); // Usa o método da classe base para adicionar a via
        }

        // Registra a data da escalada
        let datas = this.datasEscalada.get(via.id) || [];
        datas.push(data);
        this.datasEscalada.set(via.id, datas);
    }

    public getDatasEscalada(viaId: number): Date[] {
        return this.datasEscalada.get(viaId) || [];
    }
}
