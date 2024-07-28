import { api } from "boot/axios";
import { Escalada } from "src/models/Escalada";


class EscaladaService {
    async createEscalada(escalada: Escalada) {
        try {
            const response = await api.post("/escaladas/", escalada);
            console.log(response);


        } catch (error: any) {
            console.error(error.message);
            throw new Error(error.message);
        }

    }
}

export default new EscaladaService();