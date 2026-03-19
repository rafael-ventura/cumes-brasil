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
- **Vias Clássicas do CERJ** — backend e frontend concluídos (badge nos cards, filtro na busca, card na home e na explorar)
- **Redesenho da tela de Vias/Busca** — concluído: tela Explorar com categorias, filtros avançados em painel lateral, Home com cards visuais com foto, padronização ptBR
- **Sistema Colaborativo de Fotos** — entidade `ViaImageSuggestion` + upload por usuários + moderação
- **Imagem em Coleção** — adicionar campo de imagem na entidade `Colecao`

### Refactors pendentes
- Interfaces para Services e Repositories no backend (TypeDI com interfaces, não classes concretas)
- Otimização de queries TypeORM (N+1, índices, eager/lazy loading)

---

## Convenções Git

### Branches

Formato: `#<numero-tarefa>-<nome>-<descricao-kebab-case>`

- O número vem do Trello (card da tarefa)
- Nome é o primeiro nome de quem está trabalhando
- Descrição curta em kebab-case

Exemplos reais:
```
#2-rafael-vias-classicas-do-CERJ
#22-rafael-ajustar-sql
#13-ELMO-ordenar-colecao-por-data-de-adicao
#17-vitor-otimizar-consultas-sql
```

### Commits

Formato: **Conventional Commits** em português.

```
<tipo>: <descrição curta em português>
```

Tipos usados no projeto:
- `feat:` — funcionalidade nova
- `fix:` — correção de bug
- `refactor:` — reestruturação sem mudar comportamento
- `style:` — ajustes visuais (CSS, layout, cores)
- `docs:` — documentação
- `chore:` — manutenção, configs, deps

Exemplos reais:
```
feat: implementa estrutura de localização e refatora componentes relacionados
fix: corrige inconsistencias de cores entre paginas
refactor: reorganizar pasta assets e corrigir upload de fotos
style: ajusta espacamentos na hero section da Home
docs: adicionar índice com navegação no arquivo melhorias.md
```

Quando o commit está vinculado a uma tarefa específica, pode prefixar com `#N`:
```
#14- filtro de montanha na tela de busca
#2-rafael: Vias Classicas do CERJ
```

---

## Padrões de Código

### Nomes de variáveis e funções

- **ptBR camelCase** em todo código do projeto (variáveis, funções, interfaces, campos)
- Nomes de frameworks/libs mantêm seus nomes originais (`useRouter`, `ref`, `onMounted`)
- Constantes em `UPPER_SNAKE_CASE` com palavras em ptBR (`CHAVE_CACHE`, `DIAS_CACHE`)

### Exemplos

```typescript
// Variáveis
const carregando = ref(true);
const totalVias = ref(0);
const filtrosLocalizacaoAtual = ref({});

// Funções
function irParaBuscaFiltrada(tipoFiltro: string) { ... }
function aoMudarLocalizacao(filtros: Record<string, number>) { ... }
async function obterEstatisticas(): Promise<IEstatisticas> { ... }

// Interfaces
interface CardExplorar {
  titulo: string;
  tipoFiltro: string;
  contagem: number | null;
}
```

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
