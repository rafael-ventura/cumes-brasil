import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { MontanhaRepository } from '../../Infrastructure/repositories/MontanhaRepository';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';

export interface IStats {
    vias: number;
    montanhas: number;
    usuarios: number;
}

export class StatsService {
    private viaRepository: ViaRepository;
    private montanhaRepository: MontanhaRepository;
    private usuarioRepository: UsuarioRepository;

    constructor(
        viaRepository: ViaRepository,
        montanhaRepository: MontanhaRepository,
        usuarioRepository: UsuarioRepository
    ) {
        this.viaRepository = viaRepository;
        this.montanhaRepository = montanhaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    async getGeneralStats(): Promise<IStats> {
        // Busca os totais diretamente dos repositórios usando TypeORM
        // @ts-ignore - Acessa propriedade protegida do BaseRepository
        const viaRepo = this.viaRepository.repository;
        // @ts-ignore
        const montanhaRepo = this.montanhaRepository.repository;
        // @ts-ignore
        const usuarioRepo = this.usuarioRepository.repository;

        const [vias, montanhas, usuarios] = await Promise.all([
            viaRepo.count(),
            montanhaRepo.count(),
            usuarioRepo.count()
        ]);

        return {
            vias,
            montanhas,
            usuarios
        };
    }
}

