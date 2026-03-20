# Roadmap — social / perfil / descoberta

Lista ordenada para implementar no futuro (do mais independente ao mais acoplado). Itens já **feitos** neste repo estão marcados.

## Concluído recentemente

- [x] Explorar: grade de **graus** (7 + “sem grau”) em **uma linha** em telas largas; categorias mais compactas; seção **Duração D1–D4** + filtro no painel de busca e no backend (`duracao` em `FiltrosBuscaVia`).
- [x] Perfil: faixa compacta **Na cordada** (bolhas horizontais + link **Ver lista**) e rota `/perfil/:username/escaladas` (lista em linhas, hero) para visitante logado.

---

## Fase 1 — baixo acoplamento, bom impacto

### 1.1 Compartilhar escalada (estilo WhatsApp / link rico)

- **Frontend**: botão “Compartilhar” na `EscaladaDetalhada.vue`.
  - Usar `navigator.share` quando existir; senão copiar URL canônica (`/escaladas/:id`) + texto curto (nome da via, data).
  - Opcional: gerar imagem/Open Graph fica para quando houver meta tags por rota no servidor ou página estática.
- **Esforço**: pequeno; sem mudança obrigatória de API.

### 1.2 Link externo no perfil

- **Backend**: coluna opcional `usuario.link_externo` (string URL) ou `website`; migration + DTO + `GET/PATCH` perfil.
- **Frontend**: campo no `PerfilEditaForm` + ícone clicável no `PerfilBar` / header (abre em nova aba, `rel="noopener"`).
- **Validação**: URL http(s) simples no backend.

### 1.3 Feed: filtro “quem eu sigo” (depende de seguir)

- Requer **1.4** antes ou junto.

### 1.4 Seguir escaladores

- **Backend**:
  - Tabela `seguidor` (`seguidor_id`, `seguido_id`, `created_at`), unique (`seguidor_id`, `seguido_id`).
  - `POST/DELETE /usuarios/:username/seguir` (ou por id), `GET /usuarios/:id/seguidores` (opcional).
  - No feed `GET /escaladas/feed`, query `apenasSeguidos=true` filtrando autores seguidos.
- **Frontend**: botão “Seguir” no perfil público; contador; no feed, chip/filtro “Seguindo”.
- **Esforço**: médio (bem definido).

---

## Fase 2 — engajamento na via

### 2.1 Comentários em via

- Tabela `comentario_via` (usuario_id, via_id, texto, created_at, moderacao opcional).
- API CRUD + listagem paginada; componente na `ViaDetalhada`.
- **Esforço**: médio-alto (moderação, spam).

### 2.2 Menções e notificações

- Parser de `@username` no comentário ou observação; tabela `notificacao`; preferências “não receber menções”.
- **Esforço**: alto (tempo real opcional, push opcional).

---

## Fase 3 — dados e coleções avançadas

### 3.1 Calendário “GitHub” no perfil (dias escalados)

- Agregar por `data` das escaladas do usuário; endpoint retorna mapa `data -> contagem` ou só flags.
- **Frontend**: grid de calendário mensal (CSS ou lib leve).
- **Esforço**: médio.

### 3.2 Playlists / coleções cruzadas ao registrar escalada

- Ao criar escalada, opção “marcar como feita nas minhas listas” (várias coleções).
- Ver coleções públicas de outros (read-only).
- **Esforço**: alto (regras de negócio + UI).

### 3.3 Conquistas (achievements)

- Tabela `conquista` + `usuario_conquista`; regras no seed ou serviço (ex.: “10 vias”, “1ª CERJ”).
- **Esforço**: médio (design das regras pesa mais que código).

---

## Ordem sugerida de execução

1. Compartilhar escalada (1.1)  
2. Link externo (1.2)  
3. Seguir + feed filtrado (1.4 + 1.3)  
4. Comentários (2.1)  
5. Calendário perfil (3.1)  
6. Menções (2.2)  
7. Playlists cruzadas (3.2)  
8. Achievements (3.3)

---

## Notas técnicas — filtro duração

- Query string: `filterType=duracao=d1` → busca normaliza para `D1` e o repositório filtra `LOWER(via.duracao) = 'd1'`.
- Contagem: `GET /vias/count/duracao=d1` (já suportado pelo `ViaService`).
