# Refatoração #17 - Otimização de Queries SQL

## Resumo da Revisão

**Data:** 26/01/2026  
**Status:** ✅ Testado parcialmente - Backend funcionando

---

## Arquivos Modificados

### 1. `backend/src/Infrastructure/repositories/ViaRepository.ts`

**Mudanças:**
- ✅ Criado helper `withRelations()` (linhas 14-68) para reutilização de joins
- ✅ Métodos refatorados para usar o helper:
  - `getById()`
  - `getAllPaginated()`
  - `getAllWithoutPagination()`
  - `getRandom()`
  - `getViasByColecaoId()`
  - `getViasNotInColecaoForUser()`
- ✅ `search()` mantém joins inline (necessário para customizações como `data_adicao`)
- ✅ `countByBairro()` com joins específicos para contagem

**Observação:** Há duplicação de código entre `withRelations()` e `search()`, mas é intencional pois o search tem customizações específicas.

### 2. `backend/src/Infrastructure/repositories/ColecaoRepository.ts`

**Mudanças:**
- ✅ Joins de localização adicionados em todos os métodos
- ✅ Ordenação por `updated_at` implementada (em memória com subquery)

**Observações:**
- ⚠️ **Não tem helper**: Diferente do ViaRepository, não foi criado um `withColecaoRelations()` - há duplicação em `getById`, `getAll`, `getByUsuarioId`, `search`
- ⚠️ **Faltam joins** de `setorFace.localizacoes` e `setorMontanha.localizacoes` (presentes no ViaRepository)
- ⚠️ **Ordenação `updated_at` em memória**: Pode ter problema de performance com muitas coleções

### 3. `backend/src/Infrastructure/helpers/QueryRelations.ts` (mencionado, mas NÃO existe)

O arquivo helper mencionado na descrição original **não foi criado**. O ViaRepository tem seu próprio helper interno.

---

## Resultados dos Testes

### ✅ Backend - Endpoints de Via

| Endpoint | Status | Observação |
|----------|--------|------------|
| `GET /api/vias?page=1&itemsPerPage=10` | ✅ OK | `localizacoes[]` vazios na listagem (performance?) |
| `GET /api/vias/1` | ✅ OK | **Localização completa** retornada |
| `POST /api/search (via)` | ✅ OK | Filtros funcionando |
| `GET /api/vias/random` | Não testado | - |

**Detalhes:**
- Busca por `unifiedSearch` é **case-sensitive** ("leme" ≠ "Leme")
- Busca por `bairro` é **case-insensitive** (usa `LOWER()`)
- Busca por `selectedMountain` funciona

### ⚠️ Backend - Endpoints de Coleção

| Endpoint | Status | Observação |
|----------|--------|------------|
| `POST /api/search (colecao)` | ✅ OK | Precisa de `usuarioId` |
| Endpoints protegidos | ⚠️ Não testado | Requer autenticação JWT |

### ✅ Frontend Visual

| Tela | Status | Observação |
|------|--------|------------|
| Catálogo de Vias (`/busca`) | ✅ OK | Cards mostram ", Leme" (falta montanha no card) |
| Detalhe da Via (`/vias/:id`) | ✅ **Perfeito** | Localização completa: Montanha, Face, Estado, Cidade, Bairro, Região, País, Continente |
| Coleções | ⚠️ Não testado | Requer login |

---

## Checklist para Completar os Testes

### Backend - Via
- [x] `GET /api/vias?page=1&itemsPerPage=10` - Listagem paginada
- [x] `GET /api/vias/1` - Detalhe com localização completa
- [ ] `GET /api/vias/random` - Via aleatória com localização
- [x] `POST /api/search` com `entityType=via`:
  - [x] `unifiedSearch` (nome da via, montanha, bairro)
  - [x] `bairro` (filtro exato)
  - [ ] `selectedMountain` (ID)
  - [ ] `selectedDifficulty`, `selectedCrux`, `selectedExtensionCategory`

### Backend - Coleção (precisa de login)
- [ ] `GET /api/colecoes/:id` - Detalhe com vias e localização
- [ ] `GET /api/colecoes/usuario/:usuarioId` - Lista do usuário
- [ ] `POST /api/search` com `entityType=colecao`:
  - [ ] Listagem básica
  - [ ] `sortField=updated_at&sortOrder=DESC` - Ordenação por última atualização
  - [ ] `searchQuery` - Busca por nome

### Frontend
- [x] **Catálogo de Vias** (`/busca`):
  - [x] Cards mostram localização (verificar se falta montanha)
  - [ ] Filtros funcionam
  - [ ] Paginação funciona
- [x] **Detalhe da Via** (`/vias/:id`):
  - [x] Localização completa expandível
  - [ ] Croquis carregam
- [ ] **Coleções** (`/colecoes`) - precisa login:
  - [ ] Lista coleções do usuário
  - [ ] Ordenar por "última atualização"
  - [ ] Detalhe mostra vias com localização

### Erros a observar
- [ ] `"setorBairro is not defined"` ou similar
- [ ] Campos de localização `null`/`undefined` onde deveriam ter valor
- [ ] Erros 500 ao ordenar coleções

---

## Possíveis Melhorias Futuras

1. **Criar helper no ColecaoRepository**: Extrair joins repetidos para um método `withColecaoRelations()`

2. **Adicionar joins faltantes no ColecaoRepository**:
   ```typescript
   .leftJoinAndSelect('setorFace.localizacoes', 'setorFaceLocalizacoes')
   .leftJoinAndSelect('setorMontanha.localizacoes', 'setorMontanhaLocalizacoes')
   ```

3. **Otimizar ordenação por `updated_at`**: Usar subquery SQL em vez de ordenar em memória

4. **Busca case-insensitive**: Usar `ILIKE` ou `LOWER()` no `unifiedSearch`

---

## Comandos para Testar

### Backend (PowerShell)
```powershell
# Via - Listagem
Invoke-RestMethod -Uri "http://localhost:8080/api/vias?page=1&itemsPerPage=10" | ConvertTo-Json -Depth 5

# Via - Detalhe
Invoke-RestMethod -Uri "http://localhost:8080/api/vias/1" | ConvertTo-Json -Depth 10

# Via - Busca
Invoke-RestMethod -Uri "http://localhost:8080/api/search" -Method POST -ContentType "application/json" -Body '{"entityType":"via","unifiedSearch":"Morro","page":1,"itemsPerPage":5}' | ConvertTo-Json -Depth 5

# Via - Busca por bairro
Invoke-RestMethod -Uri "http://localhost:8080/api/search" -Method POST -ContentType "application/json" -Body '{"entityType":"via","bairro":"leme","page":1,"itemsPerPage":5}' | ConvertTo-Json -Depth 5

# Coleção - Busca (precisa de usuarioId válido)
Invoke-RestMethod -Uri "http://localhost:8080/api/search" -Method POST -ContentType "application/json" -Body '{"entityType":"colecao","usuarioId":1,"page":1,"itemsPerPage":5}' | ConvertTo-Json -Depth 5
```

### Frontend
- http://localhost:9200/busca - Catálogo de Vias
- http://localhost:9200/vias/1 - Detalhe da Via
- http://localhost:9200/colecoes - Coleções (precisa login)
