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
import { EventBus } from '../../Infrastructure/events/EventBus';
import { AuthEventSubscriber } from '../../Application/subscribers/AuthEventSubscriber';

/**
 * ✅ Configuração do Container de Dependency Injection com TypeDI Auto-wiring.
 * 
 * IMPORTANTE: Este arquivo utiliza AUTO-WIRING completo do TypeDI!
 * 
 * Como funciona:
 * 1. Todas as classes (Controllers, Services, Repositories) possuem o decorator @Service()
 * 2. O TypeDI lê os tipos dos parâmetros do constructor via reflect-metadata
 * 3. Quando você faz Container.get(ViaController), o TypeDI automaticamente:
 *    - Cria ViaController
 *    - Detecta que precisa de ViaService no constructor
 *    - Cria ViaService automaticamente
 *    - Detecta que ViaService precisa de ViaRepository
 *    - Cria ViaRepository automaticamente
 *    - Injeta tudo na ordem correta! ✨
 * 
 * Hierarquia de dependências (gerenciada automaticamente):
 * Controllers → Services → Repositories
 * 
 * @example
 * ```typescript
 * // ANTES (Manual - 150+ linhas de Container.set):
 * const viaRepo = new ViaRepository(Container.get(ViaColecaoRepository));
 * const viaService = new ViaService(viaRepo);
 * const viaController = new ViaController(viaService);
 * 
 * // DEPOIS (Auto-wiring - TypeDI faz tudo):
 * import { Container } from 'typedi';
 * const viaController = Container.get(ViaController);
 * // TypeDI criou ViaController → ViaService → ViaRepository → ViaColecaoRepository
 * 
 * // Para testes (Mocking):
 * Container.set(ViaRepository, mockViaRepository);
 * const service = Container.get(ViaService); // Usa o mock!
 * ```
 */
export class DIContainer {
    
    /**
     * Inicializa o Container de DI.
     * 
     * IMPORTANTE: Deve ser chamado ANTES de importar os routers para garantir
     * que todas as classes decoradas com @Service() sejam carregadas na memória.
     * 
     * Com auto-wiring, NÃO é necessário registrar manualmente cada dependência.
     * Os imports acima garantem que as classes sejam carregadas e os decorators
     * @Service() configurem o Container automaticamente.
     */
    static initialize(): void {
        // ✅ Auto-wiring ativo!
        // TypeDI gerencia TODAS as dependências automaticamente via @Service()
        // 
        // A hierarquia completa é resolvida em tempo de execução:
        // - 11 Repositories (ViaRepository, ColecaoRepository, UsuarioRepository, etc.)
        // - 9 Services (ViaService, ColecaoService, EscaladaService, etc.)
        // - 10 Controllers (ViaController, ColecaoController, UsuarioController, etc.)
        //
        // Redução: 150+ linhas de Container.set() → 0 linhas! 🎉
        Container.get(AuthEventSubscriber);
        
        console.log('✅ TypeDI Auto-wiring habilitado - Container DI inicializado com sucesso!');
    }
    
    /**
     * Limpa o Container (útil para testes).
     * 
     * Remove todas as instâncias registradas, permitindo re-configuração
     * com mocks ou stubs para testes unitários.
     * 
     * @example
     * ```typescript
     * // Em um teste:
     * DIContainer.reset();
     * Container.set(ViaRepository, mockViaRepository);
     * const service = Container.get(ViaService); // Usa o mock!
     * ```
     */
    static reset(): void {
        Container.reset();
        console.log('TypeDI Container resetado');
    }
}
