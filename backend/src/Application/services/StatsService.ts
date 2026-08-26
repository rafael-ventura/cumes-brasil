import { ViaRepository } from '../../Infrastructure/repositories/ViaRepository';
import { MontanhaRepository } from '../../Infrastructure/repositories/MontanhaRepository';
import { UsuarioRepository } from '../../Infrastructure/repositories/UsuarioRepository';
import { CroquiRepository } from '../../Infrastructure/repositories/CroquiRepository';

export interface IStats {
    vias: number;
    montanhas: number;
    croquis: number;
    usuarios: number;
}

export class StatsService {
    private viaRepository: ViaRepository;
    private montanhaRepository: MontanhaRepository;
    private usuarioRepository: UsuarioRepository;
    private croquiRepository: CroquiRepository;

    constructor(
        viaRepository: ViaRepository,
        montanhaRepository: MontanhaRepository,
        usuarioRepository: UsuarioRepository,
        croquiRepository: CroquiRepository
    ) {
        this.viaRepository = viaRepository;
        this.montanhaRepository = montanhaRepository;
        this.usuarioRepository = usuarioRepository;
        this.croquiRepository = croquiRepository;
    }

    async getGeneralStats(): Promise<IStats> {
        const [vias, montanhas, usuarios, croquis] = await Promise.all([
            this.viaRepository.count(),
            this.montanhaRepository.count(),
            this.usuarioRepository.count(),
            this.croquiRepository.count()
        ]);

        return {
            vias,
            montanhas,
            croquis,
            usuarios
        };
    }
}

