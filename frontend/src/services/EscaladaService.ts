import { api } from 'boot/axios';
import { Escalada } from 'src/models/Escalada';

class EscaladaService {
  async createEscalada (escalada: Escalada) {
    try {
      await api.post('/escaladas/', escalada);
      return true;
    } catch (error: any) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }
}

export default new EscaladaService();
