# Cumes Brasil - Backlog v3

## 📑 Índice

### ✅ CONCLUÍDOS

#### BUGS
- ~~[Corrigir z-index do botão "Voltar" na Via Detalhada (Desktop)](#corrigir-z-index-do-botão-voltar-na-via-detalhada-desktop)~~
- ~~[Ajustar tamanho das modais de Bio e Via Predileta no Perfil](#ajustar-tamanho-das-modais-de-bio-e-via-predileta-no-perfil)~~
- ~~[Corrigir layout das telas de Login e Registro](#corrigir-layout-das-telas-de-login-e-registro)~~

#### REFACTORS
- ~~[Padronizar middleware de erro em todas as controllers](#padronizar-middleware-de-erro)~~
- ~~[Revisar e padronizar camada de validação de dados nas controllers](#revisar-e-padronizar-validação)~~
- ~~[Garantir que services seguem padrões e usam middlewares corretamente](#garantir-padrões-services)~~
- ~~[Verificar herança de classes base em services, validations e repositories](#verificar-herança-classes)~~
- ~~[Implementar fallback inteligente de imagens](#implementar-fallback-imagens)~~
- ~~[Melhorar scroll na tela de Vias](#melhorar-scroll-vias)~~

#### EPICS
- ~~[Epic: Renovação da Home](#epic-renovação-da-home)~~
- ~~[Epic: Gestão de Perfil de Usuário](#epic-gestão-de-perfil-de-usuário)~~
- ~~[Epic: Versão Desktop/Responsiva](#epic-versão-desktopresponsiva)~~
- ~~[Epic: Ajustar Modais e Formulários](#epic-ajustar-modais-e-formulários)~~
- ~~[Epic: Paginação de Vias](#epic-paginação-de-vias)~~
- ~~[Epic: Reestruturação do Sistema de Localização Geográfica](#epic-reestruturação-do-sistema-de-localização-geográfica)~~

### 🔄 EM ANDAMENTO

#### BUGS
- [Ajustar Escolha de Via Predileta na tela de Perfil](#ajustar-escolha-de-via-predileta-na-tela-de-perfil)
- [Filtro de montanha na busca está desabilitado](#filtro-de-montanha-na-busca-está-desabilitado)
- [Ordenar coleções por data de adição na tela de Coleções](#ordenar-coleções-por-data-de-adição)

#### REFACTORS
- [Implementar interfaces nas camadas do backend](#implementar-interfaces-nas-camadas-do-backend)
- [Otimizar consultas SQL e TypeORM nos repositories](#otimizar-consultas-sql-e-typeorm-nos-repositories)
- [Melhoria do modal de atualização/remoção de foto do perfil](#melhoria-do-modal-de-atualizaçãoremoção-de-foto-do-perfil)

#### EPICS
- [Epic: Vias Clássicas do CERJ](#epic-vias-clássicas-do-cerj)
- [Epic: Sistema Colaborativo de Fotos de Vias](#epic-sistema-colaborativo-de-fotos-de-vias)
- [Epic: Refatorar Lógica de Filtros](#epic-refatorar-lógica-de-filtros)
- [Epic: Redesenhar Tela de Vias/Busca](#epic-redesenhar-tela-de-viasbusca)
- [Epic: Redesenhar Home no Estilo Rede Social](#epic-redesenhar-home-no-estilo-rede-social)
- [Epic: Sistema de Notificações Push via PWA](#epic-sistema-de-notificações-push-via-pwa)
- [Epic: Adicionar lógica de Imagem em Coleção](#epic-adicionar-lógica-de-imagem-em-coleção)
- [Epic: Refazer Design dos Filtros](#epic-refazer-design-dos-filtros)
- [Epic: Refazer Estilização da Barra de Busca](#epic-refazer-estilização-da-barra-de-busca)
- [Epic: Adicionar Propriedades de Tipo na Via](#epic-adicionar-propriedades-de-tipo-na-via)
- [Epic: Adicionar Vias do Bugim](#epic-adicionar-vias-do-bugim)
- [Epic: Painel de Administração](#epic-painel-de-administração)

---

<a id="bugs"></a>
## BUGS

- ~~Corrigir bug na **tela de perfil** - não permitia adicionar foto quando perfil não tinha foto~~
- <a id="ajustar-escolha-de-via-predileta-na-tela-de-perfil"></a>Ajustar Escolha de Via Predileta na **tela de Perfil**
- Delete não está funcionando. Deve deletar foto logicamente e usar foto padrão do sistema
- <a id="filtro-de-montanha-na-busca-está-desabilitado"></a>**Filtro de montanha na busca está desabilitado**
  - Após refatoração de localização, filtro de montanha foi removido
  - Precisa ser reimplementado usando a nova estrutura (via setor/face/montanha)

- <a id="corrigir-z-index-do-botão-voltar-na-via-detalhada-desktop"></a>~~**Corrigir z-index do botão "Voltar" na Via Detalhada (Desktop)**~~
  - ~~Botão estava aparecendo por cima da TopBar ao fazer scroll~~
  - ~~Ajustado z-index de 1000 para 999 (abaixo da TopBar)~~

- <a id="ajustar-tamanho-das-modais-de-bio-e-via-predileta-no-perfil"></a>~~**Ajustar tamanho das modais de Bio e Via Predileta no Perfil**~~
  - ~~Modais ocupavam muito espaço vertical para pouca informação~~
  - ~~Desktop: Reduzida altura (min-height: auto), centralizado conteúdo, padding reduzido (24px)~~
  - ~~Mobile: Ajustado padding e proporções, mantendo funcionalidade~~
  - ~~Proporção visual mais equilibrada~~

- <a id="corrigir-layout-das-telas-de-login-e-registro"></a>~~**Corrigir layout das telas de Login e Registro**~~
  - ~~Imagem de fundo ficou "estrangulada" após ajuste de `max-width` no MainLayout~~
  - ~~Páginas de autenticação devem ocupar 100% da largura (fullscreen)~~
  - ~~Excluir Login/Register da regra de padding do `MainLayout.vue`~~
  - ~~Aplicada classe condicional para rotas de autenticação (login, register, reset-password)~~

- <a id="ordenar-coleções-por-data-de-adição"></a>**Ordenar coleções por data de adição na tela de Coleções**
  - Coleções devem ser ordenadas por data de criação (mais recentes primeiro)
  - Adicionar ordenação padrão no ColecaoRepository
  - Atualizar frontend para exibir na ordem correta

---

<a id="refactors"></a>
## REFACTORS

- <a id="padronizar-middleware-de-erro"></a>~~**Padronizar middleware de erro em todas as controllers**~~
- <a id="revisar-e-padronizar-validação"></a>~~**Revisar e padronizar camada de validação de dados nas controllers**~~
- <a id="garantir-padrões-services"></a>~~**Garantir que services seguem padrões e usam middlewares corretamente**~~
- <a id="verificar-herança-classes"></a>~~**Verificar herança de classes base em services, validations e repositories**~~
- <a id="implementar-interfaces-nas-camadas-do-backend"></a>**Implementar interfaces nas camadas do backend**
  - Criar interfaces para **Services**
  - Criar interfaces para **Repositories**
  - Ajustar injeção de dependência para usar interfaces ao invés de classes concretas

- <a id="otimizar-consultas-sql-e-typeorm-nos-repositories"></a>**Otimizar consultas SQL e TypeORM nos repositories**
  - **Revisar índices**
  - Identificar N+1 queries
  - **Otimizar joins desnecessários**
  - Avaliar uso de eager/lazy loading

- <a id="implementar-fallback-imagens"></a>~~**Implementar fallback inteligente de imagens**~~
  - ~~Se via não tem foto → usar foto da montanha~~
  - ~~Se montanha não tem foto → usar placeholder padrão~~
  - ~~Função `getViaImageUrlFull` implementada em `utils.ts`~~
  - ~~Atualizado em componentes: ViaCard, ViaCardSmall, CardInfoPrincipal, EscaladaCard~~

- <a id="melhorar-scroll-vias"></a>~~**Melhorar scroll na tela de Vias**~~
  - ~~Scroll estava confuso/desorganizado~~
  - ~~Revisado comportamento de scroll e ajustado para melhor UX~~

- <a id="melhoria-do-modal-de-atualizaçãoremoção-de-foto-do-perfil"></a>Melhoria do modal de atualização/remoção de foto do perfil

---

<a id="epics"></a>
## EPICS

<a id="epic-renovação-da-home"></a>
### ~~Epic: Renovação da Home~~

**Objetivo:** Modernizar o visual da tela inicial e adicionar funcionalidades de contagem de status.

**Tarefas:**
- ~~Refazer visual da tela de home~~
- ~~Adicionar endpoint de contagem para status na tela de home~~

---

<a id="epic-gestão-de-perfil-de-usuário"></a>
### ~~Epic: Gestão de Perfil de Usuário~~

**Objetivo:** Permitir que usuários gerenciem suas informações de perfil, incluindo remoção de foto.

**Tarefas:**
- ~~Adicionar opção de remover foto do perfil do usuário~~

---

<a id="epic-versão-desktopresponsiva"></a>
### ~~Epic: Versão Desktop/Responsiva~~

**Objetivo:** Garantir que todas as versões desktop estejam desenvolvidas e compatíveis, com responsividade adequada em todas as telas do sistema.

**Tarefas:**
- ~~Desenvolver versões desktop para todas as telas (Home, Login, Register, Perfil, Vias, Coleções, Escaladas, Favoritas)~~
- ~~Ajustar largura máxima das telas em desktop (evitar 100% width)~~
- ~~Garantir responsividade em todas as telas~~

---

<a id="epic-ajustar-modais-e-formulários"></a>
### ~~Epic: Ajustar Modais e Formulários~~

**Objetivo:** Padronizar o código e estilização de todos os modais e formulários em todas as telas do sistema.

**Tarefas:**
- ~~Padronizar código de modais e formulários em todas as telas~~
- ~~Ajustar estilização dos modais e formulários~~

---

<a id="epic-paginação-de-vias"></a>
### ~~Epic: Paginação de Vias~~

**Objetivo:** Melhorar performance e experiência de navegação com paginação adequada e otimizações de carregamento.

**Tarefas:**
- ~~Criar componente reutilizável de paginação com PrimeVue Paginator~~
- ~~Adicionar controle de itens por página com persistência no localStorage~~
- ~~Implementar lazy loading de imagens e skeleton loading~~
- ~~Integrar paginação nas telas de Vias, Coleções e Coleção Detalhada~~

---

<a id="epic-reestruturação-do-sistema-de-localização-geográfica"></a>
### ~~Epic: Reestruturação do Sistema de Localização Geográfica~~

**Objetivo:** Implementar hierarquia geográfica completa (Continente → País → Região → Estado → Cidade → Bairro → Montanha → Setor → Via) para permitir categorização avançada, filtros precisos e integração futura com mapas interativos.

**Tarefas:**
- ~~Criar entidades e migrations no backend~~
- ~~Implementar services, repositories e endpoints~~
- ~~Criar models e services no frontend~~
- ~~Migrar dados existentes para nova estrutura~~
- ~~Atualizar componentes e formulários do frontend~~

---

<a id="epic-vias-clássicas-do-cerj"></a>
### Epic: Vias Clássicas do CERJ

**Objetivo:** Destacar e facilitar identificação das vias clássicas do Centro Excursionista Rio de Janeiro.

**Tarefas:**
- Adicionar campo `is_classica_cerj` na entidade Via (backend)
- Criar badge/tag visual para vias clássicas nos cards e tela detalhada
- Adicionar filtro de vias clássicas na busca
- Criar card personalizado "Clássicas do CERJ" na Home

---

<a id="epic-sistema-colaborativo-de-fotos-de-vias"></a>
### Epic: Sistema Colaborativo de Fotos de Vias

**Objetivo:** Permitir que usuários contribuam com fotos de vias, com sistema de moderação e créditos aos autores.

**Tarefas:**
- Criar entidade `ViaImageSuggestion` e endpoints RESTful para submissão e moderação
- Adicionar botão "Adicionar Foto" e modal de upload na tela de detalhes da via
- Criar carrossel de fotos em via detalhada com créditos aos autores
- Implementar sistema de moderação (aprovar/rejeitar) para administradores

---

<a id="epic-refatorar-lógica-de-filtros"></a>
### Epic: Refatorar Lógica de Filtros

**Objetivo:** Ajustar a busca e ordenação dos campos, deixando o código mais reutilizável e legível.

**Tarefas:**
- Refatorar lógica de filtros para melhor reutilização
- Refatorar visualmente os filtros
- Melhorar legibilidade e organização do código

---

<a id="epic-redesenhar-tela-de-viasbusca"></a>
### Epic: Redesenhar Tela de Vias/Busca

**Objetivo:** Transformar a tela de busca/vias em uma experiência de navegação por categorias, ao invés de carregar todas as vias de uma vez.

**Tarefas:**
- Criar seção inicial de navegação por categorias (Estados, Cidades, Vias Recentes)
- Migrar lógica de filtros personalizados da Home para tela de busca completa
- Criar tela de busca completa com paginação otimizada, ordenação e filtros avançados

---

<a id="epic-redesenhar-home-no-estilo-rede-social"></a>
### Epic: Redesenhar Home no Estilo Rede Social

**Objetivo:** Transformar a tela Home em um feed estilo rede social, mostrando atividades recentes da comunidade de escaladores.

**Tarefas:**
- Adicionar feed de últimas escaladas registradas com navegação para detalhes
- Adicionar seção de vias mais recentes cadastradas
- Adicionar seção de usuários ativos com estatísticas básicas
- Criar layout de feed vertical com scroll infinito ou paginação
- Melhorar experiência visual com design moderno e responsivo

---

<a id="epic-sistema-de-notificações-push-via-pwa"></a>
### Epic: Sistema de Notificações Push via PWA

**Objetivo:** Implementar notificações push simples: lembretes para planejar escaladas e avisos sobre novas vias adicionadas ao catálogo.

**Tarefas:**
- Configurar Web Push API no backend com VAPID keys e entidade `PushSubscription`
- Implementar serviço de notificações com jobs agendados e triggers
- Configurar Service Worker no frontend com handler de push notifications
- Criar UI de preferências no Perfil com toggles para lembretes e avisos
- Testar em Android, iOS e desktop

---

<a id="epic-adicionar-lógica-de-imagem-em-coleção"></a>
### Epic: Adicionar lógica de Imagem em Coleção

**Objetivo:** Permitir que a entidade de Coleção mostre a foto/imagem associada a ela nos cards de coleções.

**Tarefas:**
- Adicionar campo de imagem na entidade Coleção
- Exibir imagem nos cards de coleções
- Atualizar formulários de criação/edição

---

<a id="epic-refazer-design-dos-filtros"></a>
### Epic: Refazer Design dos Filtros

**Objetivo:** Modernizar e melhorar a experiência visual e funcional dos filtros de busca.

**Tarefas:**
- Redesenhar layout dos filtros com melhor organização visual
- Ajustar responsividade mobile e desktop
- Padronizar com design system do projeto

---

<a id="epic-refazer-estilização-da-barra-de-busca"></a>
### Epic: Refazer Estilização da Barra de Busca

**Objetivo:** Modernizar o componente de busca para melhorar a experiência do usuário.

**Tarefas:**
- Redesenhar componente de busca
- Melhorar feedback visual durante digitação
- Adicionar sugestões/autocomplete (opcional)
- Ajustar responsividade e acessibilidade

---

<a id="epic-adicionar-propriedades-de-tipo-na-via"></a>
### Epic: Adicionar Propriedades de Tipo na Via

**Objetivo:** Adicionar campos de tipo de rocha e tipo de escalada na entidade Via para melhor categorização e filtros.

**Tarefas:**
- Adicionar campos `tipo_rocha` e `tipo_escalada` na entidade Via (backend)
- Atualizar DTOs, validações e formulários de criação/edição
- Adicionar filtros na busca por tipo de rocha e tipo de escalada
- Analisar referências para definir valores possíveis

---

<a id="epic-adicionar-vias-do-bugim"></a>
### Epic: Adicionar Vias do Bugim

**Objetivo:** Importar e adaptar as vias do projeto cumes-crawler para o modelo de dados atual.

**Tarefas:**
- Analisar estrutura da planilha no projeto cumes-crawler
- Criar script de migração/importação
- Adaptar dados para o modelo de dados atual
- Validar, importar vias e verificar duplicatas

---

<a id="epic-painel-de-administração"></a>
### Epic: Painel de Administração

**Objetivo:** Criar painel de administração e endpoints de admin para facilitar o cadastro e gerenciamento de vias, locais e outros dados no banco.

**Tarefas:**
- Criar endpoints de administração para gerenciar vias, locais, montanhas, setores
- Implementar autenticação e autorização para usuários administradores
- Criar painel de administração no frontend com interface para cadastro e edição
- Adicionar funcionalidades de busca, filtros e validações no painel admin
- Implementar logs de auditoria para ações administrativas

---
