# Cumes Brasil - Backlog v3

## 📑 Índice

### Seções Principais
- [🐛 FIXES](#fixes)
- [🔧 REFATORAÇÃO & MELHORIAS](#refatoração--melhorias)
- [✨ FEATURES](#features)

### FIXES
- [Ajustar Escolha de Via Predileta na tela de Perfil](#ajustar-escolha-de-via-predileta-na-tela-de-perfil)
- [Filtro de montanha na busca está desabilitado](#filtro-de-montanha-na-busca-está-desabilitado)
- [Corrigir z-index do botão "Voltar" na Via Detalhada (Desktop)](#corrigir-z-index-do-botão-voltar-na-via-detalhada-desktop)
- [Ajustar tamanho das modais de Bio e Via Predileta no Perfil](#ajustar-tamanho-das-modais-de-bio-e-via-predileta-no-perfil)
- [Corrigir layout das telas de Login e Registro](#corrigir-layout-das-telas-de-login-e-registro)

### REFATORAÇÃO & MELHORIAS
- [Implementar interfaces nas camadas do backend](#implementar-interfaces-nas-camadas-do-backend)
- [Otimizar consultas SQL e TypeORM nos repositories](#otimizar-consultas-sql-e-typeorm-nos-repositories)
- [Melhoria do modal de atualização/remoção de foto do perfil](#melhoria-do-modal-de-atualizaçãoremoção-de-foto-do-perfil)

### FEATURES - Epics
- [Epic: Renovação da Home](#epic-renovação-da-home)
- [Epic: Gestão de Perfil de Usuário](#epic-gestão-de-perfil-de-usuário)
- [Epic: Versão Desktop/Responsiva 💻](#epic-versão-desktopresponsiva)
- [Epic: Ajustar Modais e Formulários 💻](#epic-ajustar-modais-e-formulários)
- [Epic: Paginação de Vias 📄](#epic-paginação-de-vias)
- [Epic: Vias Clássicas do CERJ 🏔️](#epic-vias-clássicas-do-cerj)
- [Epic: Reestruturação do Sistema de Localização Geográfica 🗺️](#epic-reestruturação-do-sistema-de-localização-geográfica)
- [Epic: Sistema Colaborativo de Fotos de Vias ⭐](#epic-sistema-colaborativo-de-fotos-de-vias)
- [Epic: Refatorar Lógica de Filtros 🔍](#epic-refatorar-lógica-de-filtros)

---

<a id="fixes"></a>
## 🐛 FIXES

- ~~Corrigir bug na **tela de perfil** - não permitia adicionar foto quando perfil não tinha foto~~
- <a id="ajustar-escolha-de-via-predileta-na-tela-de-perfil"></a>Ajustar Escolha de Via Predileta na **tela de Perfil**
- Delete não está funcionando. Deve deletar foto logicamente e usar foto padrão do sistema
- <a id="filtro-de-montanha-na-busca-está-desabilitado"></a>**Filtro de montanha na busca está desabilitado**
  - Após refatoração de localização, filtro de montanha foi removido
  - Precisa ser reimplementado usando a nova estrutura (via setor/face/montanha)

- <a id="corrigir-z-index-do-botão-voltar-na-via-detalhada-desktop"></a>**Corrigir z-index do botão "Voltar" na Via Detalhada (Desktop)**
  - Botão está aparecendo por cima da TopBar ao fazer scroll
  - Ajustar z-index para ficar abaixo da navbar
  - Testar comportamento no scroll

- <a id="ajustar-tamanho-das-modais-de-bio-e-via-predileta-no-perfil"></a>**Ajustar tamanho das modais de Bio e Via Predileta no Perfil**
  - Modais ocupam muito espaço vertical para pouca informação
  - Desktop: Reduzir altura e centralizar melhor
  - Mobile: Ajustar padding interno para aproveitar melhor o espaço
  - Manter proporção visual equilibrada

- <a id="corrigir-layout-das-telas-de-login-e-registro"></a>**Corrigir layout das telas de Login e Registro**
  - Imagem de fundo ficou "estrangulada" após ajuste de `max-width` no MainLayout
  - Páginas de autenticação devem ocupar 100% da largura (fullscreen)
  - Excluir Login/Register da regra de padding do `MainLayout.vue`
  - Alternativa: Criar layout separado para autenticação sem constraints de width

---

<a id="refatoração--melhorias"></a>
## 🔧 REFATORAÇÃO & MELHORIAS

- ~~Padronizar middleware de erro em todas as controllers~~
- ~~Revisar e padronizar camada de validação de dados nas controllers~~
- ~~Garantir que services seguem padrões e usam middlewares corretamente~~
- ~~Verificar herança de classes base em services, validations e repositories~~
- <a id="implementar-interfaces-nas-camadas-do-backend"></a>**Implementar interfaces nas camadas do backend**
  - Criar interfaces para **Services**
  - Criar interfaces para **Repositories**
  - Ajustar injeção de dependência para usar interfaces ao invés de classes concretas

- <a id="otimizar-consultas-sql-e-typeorm-nos-repositories"></a>**Otimizar consultas SQL e TypeORM nos repositories** 🔥
  - **Revisar índices**
  - Identificar N+1 queries
  - **Otimizar joins desnecessários**
  - Avaliar uso de eager/lazy loading

- ~~Implementar fallback inteligente de imagens~~
  - ~~Se via não tem foto → usar foto da montanha~~
  - ~~Se montanha não tem foto → usar placeholder padrão~~
  - ~~Função `getViaImageUrlFull` implementada em `utils.ts`~~
  - ~~Atualizado em componentes: ViaCard, ViaCardSmall, CardInfoPrincipal, EscaladaCard~~

- ~~Melhorar scroll na tela de Vias~~
  - ~~Scroll está confuso/desorganizado~~
  - ~~Revisar comportamento de scroll e ajustar para melhor UX~~

- <a id="melhoria-do-modal-de-atualizaçãoremoção-de-foto-do-perfil"></a>Melhoria do modal de atualização/remoção de foto do perfil

---

<a id="features"></a>
## ✨ FEATURES

<a id="epic-renovação-da-home"></a>
### ~~Epic: Renovação da Home~~

- Refazer visual da tela de home
- Adicionar endpoint de contagem para status na tela de home
- Refazer visual da tela de home
- Adicionar endpoint de contagem para status na tela de home

---

<a id="epic-gestão-de-perfil-de-usuário"></a>
### ~~Epic: Gestão de Perfil de Usuário~~

- Adicionar opção de remover foto do perfil do usuário
- Adicionar opção de remover foto do perfil do usuário

---

<a id="epic-versão-desktopresponsiva"></a>
### ~~Epic: Versão Desktop/Responsiva 💻~~

- Home
- Login
- Register
- Perfil
- Vias (listagem)
- Via Detalhada
- Coleções (listagem)
- Coleção Detalhada
- Escaladas
- Favoritas
- Ajustar largura maxima das telas em desktop (evitar 100% width)
- Home
- Login
- Register
- Perfil
- Vias (listagem)
- Via Detalhada
- Coleções (listagem)
- Coleção Detalhada
- Escaladas
- Favoritas
- Ajustar largura maxima das telas em desktop (evitar 100% width)

---

<a id="epic-ajustar-modais-e-formulários"></a>
### ~~Epic: Ajustar Modais e Formulários 💻~~

- Home
- Perfil
- Vias (listagem)
- Via Detalhada
- Coleções (listagem)
- Coleção Detalhada
- Escaladas
- Favoritas
- Auth(Login/Register/RedefinirSenha)

---

<a id="epic-paginação-de-vias"></a>
### ~~Epic: Paginação de Vias 📄~~

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

<a id="epic-vias-clássicas-do-cerj"></a>
### ~~Epic: Vias Clássicas do CERJ 🏔️~~

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

<a id="epic-reestruturação-do-sistema-de-localização-geográfica"></a>
### ~~Epic: Reestruturação do Sistema de Localização Geográfica 🗺️~~

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

<a id="epic-sistema-colaborativo-de-fotos-de-vias"></a>
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

<a id="epic-refatorar-lógica-de-filtros"></a>
### Epic: Refatorar Lógica de Filtros 🔍

**Objetivo:** Ajustar a busca e ordenação dos campos, tentar deixar mais reutilizável e legível.

**Tarefas:**

- Refatorar lógica de filtros
- Refatorar visualmente os filtros
- Melhorar reutilização e legibilidade do código

---
