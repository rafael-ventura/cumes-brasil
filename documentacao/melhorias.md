# Cumes Brasil - Backlog v3

## 🐛 FIXES

- ~~Corrigir bug na **tela de perfil**~~
  - ~~não permitia adicionar foto quando perfil não tinha foto~~
- ~~Ajustar Escolha de Via Predileta na **tela de Perfil**~~
  - ~~Modal não abria ao clicar no botão~~
  - ~~Foto e nome da montanha sumiam após salvar via predileta~~
- ~~Corrigir tamanho do SVG placeholder de croqui na Via Detalhada~~
  - ~~SVG estava muito grande (ocupava 100% do espaço)~~
  - ~~Reduzido para 80px e ajustado estilo~~
- ~~Corrigir atualização de coleção~~
  - ~~Validação exigia id no body, mas id vem da URL~~
- ~~Corrigir z-index do botão "Voltar" na Via Detalhada (Desktop)~~
  - ~~Botão estava aparecendo por cima da TopBar ao fazer scroll~~
  - ~~Ajustado z-index de 1000 para 999 (abaixo da TopBar)~~

- ~~Ajustar tamanho das modais de Bio e Via Predileta no Perfil~~
  - ~~Modais ocupavam muito espaço vertical para pouca informação~~
  - ~~Desktop: Reduzida altura (min-height: auto), centralizado conteúdo, padding reduzido (24px)~~
  - ~~Mobile: Ajustado padding e proporções, mantendo funcionalidade~~
  - ~~Proporção visual mais equilibrada~~

- ~~Corrigir layout das telas de Login e Registro~~
  - ~~Imagem de fundo ficou "estrangulada" após ajuste de `max-width` no MainLayout~~
  - ~~Páginas de autenticação devem ocupar 100% da largura (fullscreen)~~
  - ~~Excluir Login/Register da regra de padding do `MainLayout.vue`~~
  - ~~Aplicada classe condicional para rotas de autenticação (login, register, reset-password)~~

- ~~Ajustar botões de status no Perfil (Mobile)~~
  - ~~Botões (Coleções, Favoritas, Escaladas) devem ficar na mesma linha no mobile~~
  - ~~Ajustado flex-wrap para nowrap e tamanhos de fonte para caberem na mesma linha~~

---

## 🔧 REFATORAÇÃO & MELHORIAS

- ~~Padronizar middleware de erro em todas as controllers~~
- ~~Revisar e padronizar camada de validação de dados nas controllers~~
- ~~Garantir que services seguem padrões e usam middlewares corretamente~~
- ~~Verificar herança de classes base em services, validations e repositories~~
- **Implementar interfaces nas camadas do backend**
  - Criar interfaces para **Services**
  - Criar interfaces para **Repositories**
  - Ajustar injeção de dependência para usar interfaces ao invés de classes concretas

- **Otimizar consultas SQL e TypeORM nos repositories** 🔥
  - **Revisar índices**
  - Identificar N+1 queries
  - **Otimizar joins desnecessários**
  - Avaliar uso de eager/lazy loading

- ~~Implementar fallback inteligente de imagens~~
  - ~~Se via não tem foto → usar foto da montanha~~
  - ~~Se montanha não tem foto → usar placeholder padrão~~
  - ~~Função `getViaImageUrlFull` implementada em `utils.ts`~~
  - ~~Atualizado em componentes: ViaCard, ViaCardSmall, CardInfoPrincipal, EscaladaCard~~

- **Melhorar scroll na tela de Vias**
  - Scroll está confuso/desorganizado
  - Revisar comportamento de scroll e ajustar para melhor UX

---

## ✨ FEATURES

### Epic: Renovação da Home

- ~~Refazer visual da tela de home~~
- ~~Adicionar endpoint de contagem para status na tela de home~~

---

### Epic: Gestão de Perfil de Usuário

- ~~Adicionar opção de remover foto do perfil do usuário~~

---

### Epic: Versão Desktop/Responsiva 💻

- ~~Home~~
- ~~Login~~
- ~~Register~~
- ~~Perfil~~
- ~~Vias (listagem)~~
- ~~Via Detalhada~~
- ~~Coleções (listagem)~~
- ~~Coleção Detalhada~~
- ~~Escaladas~~
- ~~Favoritas~~
- ~~Ajustar largura maxima das telas em desktop (evitar 100% width)~~

---

### Epic: Ajustar Modais e Formulários 💻

- ~~Home~~
- ~~Perfil~~
- ~~Vias (listagem)~~
- ~~Via Detalhada~~
- ~~Coleções (listagem)~~
- ~~Coleção Detalhada~~
- ~~Escaladas~~
- ~~Favoritas~~
- ~~Auth(Login/Register/RedefinirSenha)~~

---

### Epic: Paginação de Vias 📄

**Objetivo:** Melhorar performance e experiência de navegação com paginação adequada.

**Tarefas:**

- Revisar paginação atual
  - Verificar implementação no ViaRepository
  - Validar retorno de totalPages e total items
  - Garantir consistência nos endpoints

- Melhorar componente de paginação no frontend
  - Adicionar controles de navegação (Anterior/Próximo)
  - Mostrar informação de página atual (ex: "Página 1 de 10")
  - Adicionar opção de "Ir para página"
  - Melhorar UX mobile e desktop

- Adicionar controle de itens por página
  - Dropdown para selecionar (10, 25, 50, 100)
  - Persistir preferência no localStorage
  - Atualizar query automaticamente

- Otimizar performance
  - Implementar lazy loading de imagens
  - Adicionar skeleton loading durante carregamento
  - Cache de páginas já visitadas (opcional)

---

### Epic: Reestruturação do Sistema de Localização Geográfica 🗺️

**Objetivo:** Implementar hierarquia geográfica detalhada para permitir categorização avançada, filtros precisos e integração futura com mapas interativos.

**Contexto Técnico:**

Atualmente temos:

- `Montanha` com nome e localização textual
- `Face` (relacionada a Montanha)
- `Via` (relacionada a Face e Montanha)
- Informações de localização limitadas e não estruturadas

Nova estrutura proposta:

- Hierarquia geográfica completa: Continente → País → Região → Estado → Cidade → Bairro
- `Setor` (renomeação de `Face`)
- Coordenadas geográficas (lat/long) em Vias
- Relacionamentos claros e navegáveis

**Modelo de Dados:**

```text
Continente
  └── País (1:N)
       └── Região (1:N, opcional)
            └── Estado (1:N)
                 └── Cidade (1:N)
                      └── Bairro (1:N, opcional)
                           └── Montanha (1:N)
                                └── Setor (1:N, opcional - antigo Face)
                                     └── Via (1:N)
```

**Ordem de Execução Sugerida:**

1. Backend: Criar entidades e migrations
2. Backend: Seed de dados iniciais
3. Backend: Services e repositories
4. Backend: Endpoints
5. Frontend: Models e services
6. Backend: Script de migração de dados existentes
7. Frontend: Atualizar componentes
8. Frontend: Formulários
9. Testes
10. Deploy e monitoramento

---

### Epic: Vias Clássicas do CERJ 🏔️

**Objetivo:** Destacar e facilitar identificação das vias clássicas do Centro Excursionista Rio de Janeiro.

**Tarefas:**

- Adicionar campo `is_classica_cerj` na entidade Via (backend)
  - Boolean/flag no banco de dados
  - Adicionar no DTO de Via
  - Atualizar validações e controllers

- Criar badge/tag visual para vias clássicas
  - Design do badge (ícone + texto)
  - Adicionar nos cards de via
  - Adicionar na tela de via detalhada
  - Usar cor de destaque da paleta ($cumes-04 ou $cumes-05)

- Adicionar filtro de vias clássicas na busca
  - Checkbox/toggle no filtro
  - Integrar com SearchService
  - Atualizar query no ViaRepository

- Criar card personalizado na Home
  - Card especial "Clássicas do CERJ"
  - Listar X vias clássicas aleatórias
  - Link para busca filtrada por clássicas

---

### Epic: Sistema Colaborativo de Fotos de Vias ⭐

**Objetivo:** Permitir que usuários contribuam com fotos de vias, com sistema de moderação e créditos aos autores.

**Contexto Técnico:**

- Entidade `Image` existente
- Relações atuais: Via → Image (nullable), Montanha → Image (nullable), Usuario → Image (nullable)
- Necessidade: permitir múltiplas fotos por via com autoria

**Tarefas:**

- Criar entidade `ViaImageSuggestion`
  - Campos: id, viaId, userId, imageId, status (pending/approved/rejected), createdAt

- Criar endpoints RESTful
  - POST `/api/vias/:id/images` - submeter nova foto
  - GET `/api/vias/:id/images` - listar fotos aprovadas da via
  - PATCH `/api/via-images/:id/approve` - aprovar sugestão (admin)
  - PATCH `/api/via-images/:id/reject` - rejeitar sugestão (admin)

- Adicionar botão "Adicionar Foto" na tela de detalhes da via

- Criar modal de upload de foto
  - Preview da imagem
  - Informações sobre moderação
  - Validação de formato/tamanho

- Criar Carrosel de fotos em via detalhada
  - Criar o Carrosel
  - Dar crédito para autor da foto
  - Criar lógica para mostrar autor somente quando for publicada por um usuario (e nao pelo cumes)
  - Navegação entre múltiplas fotos

- Criar sistema simples de moderação (MVP) (Alinhar com Rafael para organizar melhor o sistema)
  - Endpoint para listar sugestões pendentes
  - Botões de aprovar/rejeitar (apenas admin)
  - Notificação ao usuário sobre status (futuro)

---

### Epic: Redesenhar Tela de Vias/Busca 🔍 (Prioridade Mínima)

**Objetivo:** Transformar a tela de busca/vias em uma experiência de navegação por categorias, ao invés de carregar todas as vias de uma vez.

**Tarefas:**

- Criar seção inicial de navegação por tópicos/categorias
  - Seção de Estados do Brasil (navegação por estado)
  - Seção de Vias por Cidade
  - Seção de Vias Mais Recentes
  - Seção "Ver Todas as Vias" (leva para tela de busca completa)

- Migrar lógica de filtros personalizados da Home
  - Mover filtros personalizados para a tela de busca completa
  - Atualizar tela de busca com paginação, ordenação e filtros melhorados

- Criar tela de busca completa aprimorada
  - Paginação otimizada
  - Ordenação (por nome, data, grau, etc)
  - Sistema de filtros avançado
  - Melhorar UX de navegação

**Nota:** A Home será atualizada em outra epic para focar em atualizações e dicas do usuário de outras páginas.

---

### Epic: Redesenhar Home no Estilo Rede Social 📱

**Objetivo:** Transformar a tela Home em um feed estilo rede social, mostrando atividades recentes da comunidade de escaladores.

**Tarefas:**

- **Adicionar feed de últimas escaladas registradas**
  - Mostrar últimas escaladas de qualquer via do sistema por qualquer usuário
  - Exibir: nome da via, grau badge, usuário que registrou, preview do texto de observação
  - Permitir clicar e navegar para tela específica da escalada
  - Criar tela de escalada específica (detalhes da escalada)
  - Adicionar foto do usuário e data da escalada
  - Permitir interações (curtir, comentar - futuro)

- **Adicionar seção de vias mais recentes cadastradas**
  - Mostrar vias recém-cadastradas no sistema
  - Exibir card com foto, nome, grau e localização
  - Permitir navegação para via detalhada

- **Adicionar seção de usuários ativos**
  - Mostrar outros usuários da plataforma
  - Exibir foto de perfil, nome e localização
  - Permitir visualizar perfil de outros usuários
  - Mostrar estatísticas básicas (escaladas, favoritas, coleções)

- **Criar layout de feed vertical**
  - Scroll infinito ou paginação
  - Cards estilo timeline/post
  - Ordenação por data (mais recente primeiro)
  - Filtros opcionais (tipo de conteúdo, usuários seguidos - futuro)

- **Melhorar experiência visual**
  - Design moderno e limpo estilo rede social
  - Animações suaves de transição
  - Loading states e skeletons
  - Responsivo mobile e desktop

---

### Epic: Sistema de Notificações Push via PWA 📲

**Objetivo:** Implementar notificações push no celular usando recursos de PWA (Progressive Web App) para enviar notificações aos usuários, similar a um app nativo.

**Contexto Técnico:**

- Aplicação já é PWA (verificar configuração atual)
- Explorar Service Workers para notificações push
- Integrar com Web Push API
- Backend precisa suportar envio de notificações

**Tarefas:**

- **Configurar PWA para notificações**
  - Verificar e otimizar manifest.json
  - Configurar Service Worker
  - Implementar solicitação de permissão de notificações
  - Criar UI para gerenciar preferências de notificações

- **Implementar Web Push API no frontend**
  - Registrar service worker
  - Solicitar permissão do usuário
  - Obter subscription (endpoint, keys)
  - Enviar subscription para backend
  - Gerenciar estado de permissão

- **Criar endpoints no backend**
  - POST `/api/notifications/subscribe` - registrar subscription do usuário
  - GET `/api/notifications/subscriptions` - listar subscriptions do usuário
  - DELETE `/api/notifications/unsubscribe` - remover subscription
  - POST `/api/notifications/send` - enviar notificação (admin/sistema)

- **Implementar sistema de notificações no backend**
  - Integrar com biblioteca de push notifications (web-push)
  - Criar serviço para enviar notificações
  - Armazenar subscriptions no banco de dados
  - Criar fila/jobs para envio assíncrono (opcional)

- **Definir tipos de notificações**
  - Nova escalada registrada (seguindo usuário)
  - Nova via adicionada em coleção favorita
  - Comentário em escalada (futuro)
  - Mensagem direta (futuro)
  - Lembretes e atualizações do sistema

- **Criar sistema de preferências**
  - Permitir usuário escolher quais notificações receber
  - Toggle por tipo de notificação
  - Salvar preferências no perfil do usuário
  - Interface no perfil para gerenciar notificações

- **Implementar notificações em tempo real**
  - WebSocket ou Server-Sent Events (opcional)
  - Notificações instantâneas quando online
  - Notificações push quando offline/background

- **Testes e validação**
  - Testar em diferentes navegadores (Chrome, Firefox, Safari)
  - Testar em Android e iOS
  - Validar comportamento offline
  - Testar permissões e bloqueios

**Notas Técnicas:**

- iOS tem limitações com notificações push em PWA (requer iOS 16.4+)
- Chrome/Edge têm melhor suporte para Web Push
- Considerar fallback para notificações in-app se push não disponível
- Implementar badge de notificações não lidas

---
