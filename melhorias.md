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
- Vias (listagem)
- Via Detalhada
- Coleções (listagem)
- Coleção Detalhada
- Escaladas
- Favoritas
- ~~Perfil~~

---