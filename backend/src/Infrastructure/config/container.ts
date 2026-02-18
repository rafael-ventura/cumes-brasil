import 'reflect-metadata';
import { Container } from 'typedi';

// Repositories
import { ViaRepository } from '../repositories/ViaRepository';
import { ColecaoRepository } from '../repositories/ColecaoRepository';
import { CroquiRepository } from '../repositories/CroquiRepository';
import { EscaladaRepository } from '../repositories/EscaladaRepository';
import { FaceRepository } from '../repositories/FaceRepository';
import { FonteRepository } from '../repositories/FonteRepository';
import { ImagemRepository } from '../repositories/ImagemRepository';
import { MontanhaRepository } from '../repositories/MontanhaRepository';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { ViaColecaoRepository } from '../repositories/ViaColecaoRepository';
import { ViaCroquiRepository } from '../repositories/ViaCroquiRepository';

// Services
import { ViaService } from '../../Application/services/ViaService';
import { ColecaoService } from '../../Application/services/ColecaoService';
import { CroquiService } from '../../Application/services/CroquiService';
import { EscaladaService } from '../../Application/services/EscaladaService';
import { ImagemService } from '../../Application/services/ImagemService';
import { UsuarioService } from '../../Application/services/UsuarioService';
import { SearchService } from '../../Application/services/SearchService';
import { FonteService } from '../../Application/services/FonteService';
import { MontanhaService } from '../../Application/services/MontanhaService';
import { FaceService } from '../../Application/services/FaceService';
import { StatsService } from '../../Application/services/StatsService';

// Controllers
import { ViaController } from '../../Api/Controllers/ViaController';
import { ColecaoController } from '../../Api/Controllers/ColecaoController';
import { CroquiController } from '../../Api/Controllers/CroquiController';
import { EscaladaController } from '../../Api/Controllers/EscaladaController';
import { ImagemController } from '../../Api/Controllers/ImagemController';
import { UsuarioController } from '../../Api/Controllers/UsuarioController';
import { SearchController } from '../../Api/Controllers/SearchController';
import { FonteController } from '../../Api/Controllers/FonteController';
import { MontanhaController } from '../../Api/Controllers/MontanhaController';
import { FaceController } from '../../Api/Controllers/FaceController';
import { StatsController } from '../../Api/Controllers/StatsController';
import AuthController from '../../Api/Controllers/AuthenticateController';

/**
 * Configuração do Container de Dependency Injection do TypeDI.
 * 
 * Este arquivo centraliza o registro de todas as dependências do sistema,
 * permitindo injeção automática sem necessidade de instanciação manual.
 * 
 * Hierarquia de dependências:
 * Controllers → Services → Repositories
 * 
 * @example
 * ```typescript
 * // Uso no router (ANTES - manual):
 * const viaRepo = new ViaRepository();
 * const viaService = new ViaService(viaRepo);
 * const viaController = new ViaController(viaService);
 * 
 * // Uso no router (DEPOIS - automático):
 * import { Container } from 'typedi';
 * const viaController = Container.get(ViaController);
 * ```
 */
export class DIContainer {
    
    /**
     * Inicializa o Container de DI com todas as dependências.
     * 
     * IMPORTANTE: Deve ser chamado ANTES de importar os routers.
     * 
     * Ordem de registro:
     * 1. Repositories (sem dependências ou com DI entre eles)
     * 2. Services (dependem de repositories)
     * 3. Controllers (dependem de services)
     */
    static initialize(): void {
        // ========================================
        // LAYER 1: REPOSITORIES
        // ========================================
        
        // Repositories sem dependências
        Container.set(FonteRepository, new FonteRepository());
        Container.set(ImagemRepository, new ImagemRepository());
        Container.set(MontanhaRepository, new MontanhaRepository());
        Container.set(FaceRepository, new FaceRepository());
        Container.set(UsuarioRepository, new UsuarioRepository());
        Container.set(EscaladaRepository, new EscaladaRepository());
        
        // Repositories de relacionamento (sem outras dependências)
        Container.set(ViaColecaoRepository, new ViaColecaoRepository());
        Container.set(ViaCroquiRepository, new ViaCroquiRepository());
        
        // Repositories com DI (dependem de outros repositories)
        // ViaRepository agora requer ViaColecaoRepository
        Container.set(ViaRepository, new ViaRepository(
            Container.get(ViaColecaoRepository)
        ));
        
        Container.set(ColecaoRepository, new ColecaoRepository(
            Container.get(ViaColecaoRepository)
        ));
        
        Container.set(CroquiRepository, new CroquiRepository(
            Container.get(ViaCroquiRepository)
        ));
        
        // ========================================
        // LAYER 2: SERVICES
        // ========================================
        
        // Services básicos (1 dependência)
        Container.set(ViaService, new ViaService(
            Container.get(ViaRepository)
        ));
        
        Container.set(FonteService, new FonteService(
            Container.get(FonteRepository)
        ));
        
        Container.set(MontanhaService, new MontanhaService(
            Container.get(MontanhaRepository)
        ));
        
        Container.set(ImagemService, new ImagemService(
            Container.get(ImagemRepository)
        ));
        
        Container.set(ColecaoService, new ColecaoService(
            Container.get(ColecaoRepository)
        ));
        
        // Services com múltiplas dependências
        Container.set(UsuarioService, new UsuarioService(
            Container.get(UsuarioRepository),
            Container.get(ImagemService),
            Container.get(ViaRepository),
            Container.get(ImagemRepository)
        ));
        
        Container.set(FaceService, new FaceService(
            Container.get(FaceRepository),
            Container.get(FonteService),
            Container.get(MontanhaService)
        ));
        
        Container.set(CroquiService, new CroquiService(
            Container.get(CroquiRepository),
            Container.get(ViaRepository),
            Container.get(ViaCroquiRepository)
        ));
        
        Container.set(EscaladaService, new EscaladaService(
            Container.get(EscaladaRepository),
            Container.get(UsuarioService),
            Container.get(ViaService)
        ));
        
        Container.set(StatsService, new StatsService(
            Container.get(ViaRepository),
            Container.get(MontanhaRepository),
            Container.get(UsuarioRepository)
        ));
        
        // ========================================
        // LAYER 3: CONTROLLERS
        // ========================================
        
        Container.set(ViaController, new ViaController(
            Container.get(ViaService)
        ));
        
        Container.set(ColecaoController, new ColecaoController(
            Container.get(ColecaoService)
        ));
        
        Container.set(CroquiController, new CroquiController(
            Container.get(CroquiService)
        ));
        
        Container.set(EscaladaController, new EscaladaController(
            Container.get(EscaladaService)
        ));
        
        Container.set(ImagemController, new ImagemController(
            Container.get(ImagemService)
        ));
        
        Container.set(UsuarioController, new UsuarioController(
            Container.get(UsuarioService)
        ));
        
        Container.set(FonteController, new FonteController(
            Container.get(FonteService)
        ));
        
        Container.set(MontanhaController, new MontanhaController(
            Container.get(MontanhaService)
        ));
        
        Container.set(FaceController, new FaceController(
            Container.get(FaceService)
        ));
        
        Container.set(StatsController, new StatsController(
            Container.get(StatsService)
        ));
        
        // Controllers sem dependências
        Container.set(SearchController, new SearchController());
        Container.set(AuthController, new AuthController());
        
        console.log('TypeDI Container inicializado com sucesso');
    }
    
    /**
     * Limpa o Container (útil para testes).
     * 
     * Remove todas as instâncias registradas.
     */
    static reset(): void {
        Container.reset();
        console.log('TypeDI Container resetado');
    }
}
