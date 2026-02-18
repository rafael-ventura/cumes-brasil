# Campos dos PDFs CERJ – para adicionar no futuro

Este documento lista campos presentes nos PDFs "Vias Clássicas do CERJ" que **ainda não existem** no schema atual do Cumes Brasil. Use como referência para evoluções futuras.

---

## Campos sugeridos para entidade Via (ou relacionadas)

| Campo nos PDFs | Descrição | Status |
|----------------|-----------|--------|
| **Equipamentos** | Lista de material necessário (cordas, costuras, peças móveis, etc.) | ✅ Implementado – `via.equipamentos` (texto) |
| **Tracklog de aproximação** | Link/URL para baixar ou visualizar o tracklog da trilha | ✅ Implementado – `via.tracklog_aproximacao` (URL) |
| **Legenda do croqui** | Ex.: "Grampo de aço carbono", "Chapeleta rapelável" | ✅ Implementado – `croqui.legenda` (texto) |
| **Número de repetições** | Quantas vezes a via foi repetida | Futuro |
| **Vídeo comemorativo / documentário** | Links para vídeos | Futuro |
| **Reformas / manutenções** | Datas e descrições de reformas | Futuro |
| **Descrição detalhada por enfiada** | Texto longo descrevendo cada lance | Futuro – `detalhes` já existe |
| **Variantes nomeadas** | Ex.: Variante Play, Chaminé do Suplício Chinês | Já existe `viaPrincipal` |
| **Histórico de conquista** | Relato textual da conquista | Futuro |

---

## Campos que já existem e foram usados

- `nome`, `grau`, `crux`, `artificial`, `duracao`, `exposicao`, `extensao`
- `conquistadores`, `data`, `detalhes`
- `montanha`, `face`, `fonte`, `viaPrincipal`

---

## Múltiplas imagens por via

**Implementado (fev/2025):** O modelo agora suporta **múltiplas imagens por via** via entidade `ViaImagem` (via_id, imagem_id, ordem). O `ViaDTO` expõe `imagem` (primeira) e `imagens` (array ordenado). O endpoint `GET /imagens/via/:id` retorna array de imagens.

---

## Observações

1. **Equipamentos** – Implementado. Ex.: "Corda de 60m; 5 a 9 costuras; Fitas longas".
2. **Tracklog** – Implementado. Campo `tracklog_aproximacao` armazena URL para baixar/visualizar o tracklog (ex.: GPX, Wikiloc). O front pode exibir ícone/link.
3. **Repetições** – Dado histórico relevante (ex.: Chaminé Brasília com apenas 10 repetições).
4. **Vídeos** – Links para YouTube e documentários.
5. **Manutenções** – Importante para vias antigas que passam por reformas.

---

*Documento gerado a partir da inclusão das 10 vias clássicas do CERJ (fev/2025).*
