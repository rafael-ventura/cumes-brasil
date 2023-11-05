import { Request, Response } from 'express';
import store from '../../Infrastructure/config/db';

class ConexaoController {
    testConnection = async (req: Request, res: Response) => {
        try {
            // Tentativa de obter as estatísticas do banco de dados como teste de conexão
            const session = store.openSession();

            // Se a conexão for bem-sucedida e as estatísticas forem obtidas
            res.status(200).json({
                message: "Conexão com o banco de dados RavenDB foi bem-sucedida!"
            });
        } catch (error) {
            // Se houver um erro na conexão com o banco de dados
            res.status(500).json({
                message: "Falha ao conectar com o banco de dados RavenDB.",
                error: error
            });

        }
    };
}

export default new ConexaoController();
