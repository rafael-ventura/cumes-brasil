import {Montanha} from "../../models/Montanha";
import {ViaDto} from "../../../../shared/contratos/ViaDto";
import {Via} from "../../models/Via";
import {Fonte} from "../../models/Fonte";
import {Face} from "../../models/Face";


export interface IViaService {
    getMontanhaById(id_montanha: number): Promise<Montanha>;

    getFaceById(id_face: number): Promise<Face>;

    getFonteById(id_fonte: number): Promise<Fonte>;

    createVia(viaDTO: ViaDto): Promise<Via>;

    updateVia(viaDTO: ViaDto): Promise<Via>;

    deleteVia(id: number): Promise<void>;

    getViaById(id: number): Promise<Via>;

    getVias(): Promise<Via[]>;

}