import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { MontanhaRepository } from '../../Infrastructure/repositories/MontanhaRepository';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { Service } from 'typedi';

export interface IStats {
    vias: number;
    montanhas: number;
    usuarios: number;
}

@Service()
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
        const [vias, montanhas, usuarios] = await Promise.all([
            this.viaRepository.countAll(),
            this.montanhaRepository.countAll(),
            this.usuarioRepository.countAll()
        ]);

        return {
            vias,
            montanhas,
            usuarios
        };
    }
}

