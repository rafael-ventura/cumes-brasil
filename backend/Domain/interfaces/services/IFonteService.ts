import {Fonte} from "../../entities/Fonte";
import {FonteDto} from "../../../../shared/contratos/ViaDto";


export interface IFonteService {

    createFonte(fonteDTO: Fonte): Promise<Fonte>;

    updateFonte(fonteDTO: Fonte): Promise<Fonte>;

    deleteFonte(id: number): Promise<void>;

    getAllFontes(): Promise<Fonte[]>;

    getFonteById(id: number): Promise<Fonte>;

    associoarFonteVia(fonte: Fonte, id_via: number): Promise<Fonte>;
}