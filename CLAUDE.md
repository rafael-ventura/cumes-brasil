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

# Só seed (incremental, idempotente) — sincroniza usuarios-teste.yaml (senha, is_admin)
npm run seed

# Em dev, `npm run dev` aplica migrations pendentes ao subir; seed continua manual

# Nova migration (sempre fazer build antes)
npm run build && npm run migration:generate
# → renomear arquivo gerado para algo descritivo
npm run migration:run:dev
```

---

## Trabalho em Andamento

> Rastreamento detalhado no Trello. Aqui ficam apenas itens que dão contexto relevante para o código atual.

### Bugs ativos
- _(nenhum no momento — ver "Bugs resolvidos recentemente")_

### Bugs resolvidos recentemente
- **Ordenação de coleções** — resolvido: `ColecaoRepository.getByUsuarioId`/`getAll` agora ordenam por `created_at ASC` (antes vinham em ordem arbitrária do `getMany()`)
- **Modal de foto do perfil** — resolvido em `FotoPerfilUpload.vue`: preview agora usa `ref` com `URL.revokeObjectURL` (antes era `computed` que vazava blob a cada render), `q-file` usa `@update:model-value` + `pickFiles()` (idiom Quasar 2), botões "Cancelar"/"Salvar" no padrão do design system, e estado inicial com call-to-action claro
- **Filtro de montanha na busca** — verificado resolvido (estava como bug ativo por nota desatualizada). Wiring completo ponta a ponta: front (`BuscaFiltros.vue` → `localFilters.montanhaId` → `emitFilters` → `Busca.aoAplicarFiltros` → payload) e back (`FiltrosBuscaVia.montanhaId` → `BuscaValidation` → `BuscaViaService` → `ViaRepository.construirQueryBusca`/`CONDICAO_MONTANHA` via `setor/face/montanha`). Recomendado um smoke-test manual na tela de busca.

### Epics em andamento
- **Vias Clássicas do CERJ** — backend e frontend concluídos (badge nos cards, filtro na busca, card na home e na explorar)
- **Conquistas persistidas** — badges por tier calculadas no backend e salvas em `usuario_conquistas` (perfil próprio e público)
- **Redesenho da tela de Vias/Busca** — concluído: tela Explorar com categorias, filtros avançados em painel lateral, Home com cards visuais com foto, padronização ptBR
- **Perfil público/privado** — concluído: campo `perfil_publico` em Usuario (default true), toggle no PerfilEditaForm, feed e rota `GET /u/:username` filtram perfis privados
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
- **UI: PrimeVue-first, Quasar na base** — componentes novos preferem PrimeVue (mais configurável); Quasar permanece como shell (build, PWA, roteamento, layouts `q-layout`/`q-page`). Não remover o Quasar do projeto. Migração de `q-*` existentes é incremental, por área. Detalhes em `DESIGN_FRONTEND.md`.
- **Type-check do frontend limpo** — `npx vue-tsc --noEmit` deve ficar em **0 erros** (`skipLibCheck: true` no `tsconfig.json` ignora `.d.ts` de terceiros). Mantenha assim ao mexer no front.
- **`aws-sdk` v2** no `S3Helper` — débito técnico consciente, migração para v3 está pendente
- **YAMLs são a fonte de verdade dos dados** — não editar diretamente no banco; sempre via `src/Infrastructure/data/*.yaml` + `npm run seed`
- **Imagens precisam de `@JoinColumn`** — relações com `Imagem` na entidade `Usuario` usam `foto_perfilId` (com maiúscula no I)
- **Perfil público/privado** — `Usuario.perfil_publico` (default `true`). Perfis privados: não aparecem no feed nem em `GET /u/:username` (404). Toggle em PerfilEditaForm.
- **Autorização por papel (`role`)** — `Usuario.role` (enum `PapelUsuario`: `usuario`/`moderador`/`admin`, default `usuario`) é a **única fonte de verdade** da autorização no backend. `is_admin` virou **getter derivado** (`role === admin`), sem coluna no banco — usado só como dica de UI no front (login/DTO/localStorage). Backend autoriza via `requireRole(...papeis)`/`requireAdmin`, que relê `role` no banco a cada request (alterar localStorage no cliente não concede acesso real). Seed: YAML aceita `role:` explícito ou `is_admin: true` (compat → `admin`). Painel: `PATCH /admin/usuarios/:id/papel` (definir papel) e `.../toggle-admin` (compat).
- **Rota de perfil** — `/perfil/:username` (próprio ou visitante). `/perfil` e `/perfil/me` redirecionam para o perfil do usuário logado. Guard em `PerfilPageWrapper` diferencia dono (edição) de visitante (somente leitura).
- **Marcações na cordada** — preview no perfil: faixa compacta com bolhas (fotos da via) e “Ver lista”; página `/perfil/:username/escaladas` (login obrigatório) usa linhas (`PerfilMarcacaoEscaladaRow`), não `EscaladaCard` em grade. API: `como=marcado`; repo carrega `viaImagens` para thumbnails.
- **Usuários de teste** — seed (`usuarios-teste.yaml`): senha comum `teste123` — `teste@cumes.com.br` (`cumes_teste`), `maria.dev@cumes.com.br` (`maria_escaladora`), `privado.dev@cumes.com.br` (`usuario_privado`, perfil privado), `rafael.dev@cumes.com.br` (`rafael`). Escaladas e coleções: `escaladas-teste.yaml`, `colecoes-vias-teste.yaml`.
- **Infra AWS desativada** por falta de créditos — ver `documentacao/LEGADO-AWS.md` se precisar reativar

---

## Documentação

| Arquivo | Conteúdo |
|---------|----------|
| `documentacao/ARQUITETURA-BACKEND.md` | DDD, entidades, seed, migrations, padrões |
| `documentacao/ARQUITETURA-FRONTEND.md` | Vue 3, serviços, roteamento, auth, componentes |
| `documentacao/DESIGN_FRONTEND.md` | Paleta de cores, tipografia, botões, modais, convenções CSS |
| `backend/README.md` | Setup local, scripts, variáveis de ambiente |
