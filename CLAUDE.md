# Cumes Brasil

PWA de catálogo de escalada focado no Rio de Janeiro. Permite explorar vias, montar coleções, ver croquis e acessar dados offline.

Stack: **Vue 3 + Quasar** (frontend) · **Node.js + Express + TypeORM** (backend) · **PostgreSQL**

---

## Arquitetura

@documentacao/ARQUITETURA-BACKEND.md
@documentacao/ARQUITETURA-FRONTEND.md

---

## Design System

@documentacao/DESIGN_FRONTEND.md

---

## Comandos Essenciais

```bash
# Setup completo do zero
cd backend && npm run db:fresh && npm run dev

# Só seed (incremental, idempotente)
npm run seed

# Nova migration (sempre fazer build antes)
npm run build && npm run migration:generate
# → renomear arquivo gerado para algo descritivo
npm run migration:run:dev
```

---

## Trabalho em Andamento

> Rastreamento detalhado no Trello. Aqui ficam apenas itens que dão contexto relevante para o código atual.

### Bugs ativos
- **Filtro de montanha na busca desabilitado** — foi removido durante refatoração de localização, precisa ser reimplementado via nova estrutura `setor/face/montanha`
- **Ordenação de coleções** — falta ordenar por data de criação no `ColecaoRepository`
- **Modal de foto do perfil** — modal de atualização/remoção precisa de melhoria

### Epics em andamento
- **Vias Clássicas do CERJ** — backend concluído (`via_cerj: true` no seed, field na entidade); frontend ainda precisa: badge visual nos cards, filtro na busca, card "Clássicas do CERJ" na home
- **Sistema Colaborativo de Fotos** — entidade `ViaImageSuggestion` + upload por usuários + moderação
- **Redesenho da tela de Vias/Busca** — navegação por categorias, filtros avançados
- **Imagem em Coleção** — adicionar campo de imagem na entidade `Colecao`

### Refactors pendentes
- Interfaces para Services e Repositories no backend (TypeDI com interfaces, não classes concretas)
- Otimização de queries TypeORM (N+1, índices, eager/lazy loading)

---

## Decisões e Contexto que não ficam óbvios no código

- **Sem Pinia/Vuex** — estado é local por componente. Para estado compartilhado, discutir antes de implementar.
- **`aws-sdk` v2** no `S3Helper` — débito técnico consciente, migração para v3 está pendente
- **YAMLs são a fonte de verdade dos dados** — não editar diretamente no banco; sempre via `src/Infrastructure/data/*.yaml` + `npm run seed`
- **Imagens precisam de `@JoinColumn`** — relações com `Imagem` na entidade `Usuario` usam `foto_perfilId` (com maiúscula no I)
- **Infra AWS desativada** por falta de créditos — ver `documentacao/LEGADO-AWS.md` se precisar reativar

---

## Documentação

| Arquivo | Conteúdo |
|---------|----------|
| `documentacao/ARQUITETURA-BACKEND.md` | DDD, entidades, seed, migrations, padrões |
| `documentacao/ARQUITETURA-FRONTEND.md` | Vue 3, serviços, roteamento, auth, componentes |
| `documentacao/DESIGN_FRONTEND.md` | Paleta de cores, tipografia, botões, modais |
| `documentacao/LEGADO-AWS.md` | Infra AWS antiga e como reativar |
| `backend/README.md` | Setup local, scripts, variáveis de ambiente |
