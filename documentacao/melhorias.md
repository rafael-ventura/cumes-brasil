# Cumes Brasil - Backlog v3

## 🐛 FIXES

- ~~Corrigir bug na **tela de perfil** - não permitia adicionar foto quando perfil não tinha foto~~
- Ajustar Escolha de Via Predileta na **tela de Perfil**

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

- **Implementar fallback inteligente de imagens**
  - **Se via não tem foto → usar foto da montanha**
  - **Se montanha não tem foto → usar placeholder padrão**
  - Atualizar componentes de exibição de via

---

## ✨ FEATURES

### Epic: Renovação da Home

- ~~Refazer visual da tela de home~~
- ~~Adicionar endpoint de contagem para status na tela de home~~

---

### Epic: Gestão de Perfil de Usuário

- ~~Adicionar opção de remover foto do perfil do usuário~~

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

### Epic: Versão Desktop/Responsiva 💻

**Objetivo:** Adaptar todas as telas do sistema para versão desktop, garantindo melhor experiência em telas maiores.

**Tarefas:**

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
- ~~**Ajustar largura maxima das telas em desktop (evitar 100% width)**~~

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

### Epic: Padronização do Design System 🎨

**Objetivo:** Aplicar consistentemente as cores e padrões do design system em todo o projeto.

**Contexto:** DESIGN_SYSTEM.md criado com padrões unificados. Removido constants/colors.ts (usar SCSS diretamente).

**Tarefas:**

- ✅ **CONCLUÍDO** - Revisar e aplicar cores nos componentes de Via
  - ✅ ViaCard padronizado com $cumes-01 sólido
  - ✅ CardInfoPrincipal ajustado
  - ✅ SecaoMaisDetalhes com cores consistentes
  - ✅ Badges e tags padronizados

- ✅ **CONCLUÍDO** - Revisar e aplicar cores nos componentes de Coleção
  - ✅ ColecaoCard mudou de $cumes-03 para $cumes-01
  - ✅ Badges em cards com transparência suave

- ✅ **CONCLUÍDO** - Padronizar Perfil Mobile e Desktop
  - ✅ PerfilBar (mobile) mudou de $cumes-05 para $cumes-01
  - ✅ Desktop mantém $cumes-01
  - ✅ Consistência total entre mobile e desktop

- Revisar e aplicar cores nos componentes de Escalada
  - EscaladaCard
  - ModalCriarEscalada

- Revisar e aplicar cores em modais e overlays
  - Garantir consistência de headers
  - Padronizar botões de ação
  - Uniformizar fundos e textos

- Criar classes utilitárias no app.scss
  - .text-primary, .text-secondary, etc.
  - .bg-primary, .bg-secondary, etc.
  - .badge-primary, .badge-success, etc.

---
