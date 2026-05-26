# 🎨 Design System - Cumes Brasil Frontend

Documentação completa das regras de cores, tipografia e componentes do frontend. Peça para sua IA consultar essas informações ao fazer alterações visuais.

---

## Preferências de Interface (Quasar e PrimeVue)
- O Quasar é o framework base para estrutura, Progressive Web App (PWA), layout e componentes `q-*`.
- A PrimeVue deve ser priorizada quando existir equivalente adequado para o requisito e quando for possível aplicar as regras de estilo deste documento.
- Ao criar novos componentes, respeitar simultaneamente as regras de cores e contraste em tema escuro e o padrão de modais e formulários descritos neste arquivo.
- Ao sobrescrever estilos de componentes externos, aplicar `!important` quando necessário para garantir consistência visual.
- Ao estilizar internos de componentes em `<style scoped>`, usar `:deep(...)`.

---

## 📐 Paleta de Cores

### Cores Principais da Marca

```scss
$cumes-01: #F29340  // Laranja principal (identidade da marca — cor mais presente no UI)
$cumes-02: #546119  // Verde escuro
$cumes-03: #8CB369  // Verde (contraste / natureza / acentos secundários)
$cumes-04: #F4E285  // Amarelo (destaque)
$cumes-05: #BC4B51  // Vermelho/bordô (destaque alternativo)
```

### Cores de Fundo e Texto

```scss
$background: #1a1d22  // Fundo escuro principal (body, páginas)
$surface: #22262c     // Fundo de superfícies elevadas (cards, modais, topbar)
$offwhite: #ffffe4    // Branco suave (preferível ao white puro)
```

### Cores de Feedback

```scss
$error-color: #e74c3c  // Vermelho para erros/deletar
```

### Variáveis Semânticas - Ações do Usuário

```scss
$action-escaladas: $cumes-01  // Laranja - ação, movimento, energia
$action-favoritos: $cumes-04  // Amarelo - estrela, destaque
$action-colecoes: $cumes-02   // Verde escuro - organização
```

**Onde usar:**

- **Escaladas**: Botões de registrar escalada, cards de escaladas
- **Favoritos**: Botão de estrela, cards de favoritos
- **Coleções**: Botão de adicionar a coleção, cards de coleções

---

## 🎯 Regras de Uso das Cores

### 1. Backgrounds

| Elemento | Cor | Exemplo |
|----------|-----|---------|
| Cards principais | `$cumes-01` | ViaCard, ColecaoCard, navbar |
| Cards secundários/informativos | `$offwhite` | Cards de estatísticas, modais |
| Fundo geral da página | `$background` | Body, páginas |

### 2. Textos

| Contexto | Cor | Quando usar |
|----------|-----|-------------|
| Sobre fundo escuro/verde | `$offwhite` | Texto em navbar, hero sections |
| Sobre fundo claro | `$background` | Texto em cards brancos, modais |
| Títulos destaque (hero) | `$cumes-04` | Títulos grandes em hero sections |
| Títulos de páginas | `$cumes-01` | H2, H3 em páginas |

### 3. Botões

#### Botão Primário

- **Background**: `$cumes-01`
- **Texto**: `$offwhite`
- **Uso**: Ações principais (Salvar, Criar, Entrar, Confirmar)

#### Botão Secundário

- **Background**: `$cumes-03`
- **Texto**: `$offwhite`
- **Uso**: Ações secundárias (Ver mais, Filtrar, Editar)

#### Botão Terciário

- **Background**: `$offwhite` ou transparente
- **Borda**: `1px solid $cumes-01`
- **Texto**: `$cumes-01`
- **Uso**: Cancelar, Voltar

#### Botão Perigo

- **Background**: `$error-color`
- **Texto**: `$offwhite`
- **Uso**: Deletar, Sair, Remover

### 4. Ícones e Badges

| Tipo | Cor | Uso |
|------|-----|-----|
| Informativos | `$cumes-01` | Ícones gerais, informações, ações |
| Acento natureza | `$cumes-03` | Ícones relacionados a trilhas, vegetação, ambiente |
| Destaque | `$cumes-04` | Elementos que precisam chamar atenção |
| Status/Grau | Variável | Ver seção de Graus |

---

## 🎨 Transparências Padronizadas

Evite usar `rgba()` diretamente. Use as variáveis:

```scss
$overlay-light: rgba(255, 255, 255, 0.08)   // Overlay claro
$overlay-dark: rgba(0, 0, 0, 0.05)          // Overlay escuro
$text-shadow-default: rgba(0, 0, 0, 0.2)   // Sombra de texto padrão
$box-shadow-soft: rgba(0, 0, 0, 0.08)      // Sombra suave
$box-shadow-light: rgba(0, 0, 0, 0.12)     // Sombra leve
$box-shadow-medium: rgba(0, 0, 0, 0.15)    // Sombra média
$box-shadow-strong: rgba(0, 0, 0, 0.2)     // Sombra forte
$box-shadow-dark: rgba(0, 0, 0, 0.3)       // Sombra escura
```

---

## 🏔️ Cores de Grau/Dificuldade

Usadas nos badges de dificuldade das vias:

```scss
$c-color-yellow: #fffd5e
$c-color-green: #BCE9B4
$c-color-red: #ff5858
$c-color-blue: #7E9CE8
$c-color-purple: #ca74ef
$c-color-pink: #EF9D9D
$c-color-orange: #fcbd7b
$c-color-brown: #e4a16a
$c-color-grey: #757575
```

---

## 📏 Regra do 60-30-10

Princípio fundamental de design aplicado:

- **60%**: Cor dominante (fundo, espaços neutros - geralmente `$background` ou `$offwhite`)
- **30%**: Cor primária (`$cumes-01` - verde principal)
- **10%**: Cores secundárias/terciárias para acentos (`$cumes-03`, `$cumes-04`)

---

## 📱 Responsividade

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: >= 1024px

---

## 🚀 Checklist de Implementação

Ao criar um novo componente, verifique:

- [ ] Usa variáveis de cor do `app.scss` (nunca hardcoded)
- [ ] Usa `$offwhite` ao invés de `white`
- [ ] Usa variáveis de sombra ao invés de `rgba()` direto
- [ ] Segue a regra 60-30-10
- [ ] Tem contraste adequado entre texto e fundo
- [ ] É consistente com outros componentes similares
- [ ] Funciona em mobile e desktop
- [ ] Usa variáveis semânticas quando aplicável (`$action-*`)

---

## Componentes PrimeVue (principalmente em tema escuro)
- Paginação: preferir o padrão do componente `frontend/src/components/PaginacaoPadrao.vue`, que usa `Paginator` e `Dropdown` da PrimeVue.
- Dropdown: quando o tema deixar componentes com aparência branca, sobrescrever `p-dropdown`, `p-inputtext`, `p-dropdown-label`, `p-dropdown-trigger`, `p-dropdown-panel` e `p-dropdown-item` para usar `$background`, `$offwhite` e bordas com `$cumes-03`.
- Paginator: aplicar estilo em `p-paginator-page`, `p-paginator-prev`, `p-paginator-next`, `p-paginator-first` e `p-paginator-last`, usando `!important` quando necessário.
- Em estilos `scoped`, todas as seleções internas de componentes PrimeVue devem ser feitas com `:deep(...)`.

---

## 🎭 Modais e Formulários

### Estrutura Padrão de Modais

Todos os modais devem seguir esta estrutura:

```vue
<q-dialog v-model="isOpen" @hide="handleHide">
  <q-card class="modal-card">
    <q-card-section class="modal-header">
      <div class="modal-title">
        <q-icon name="icon_name" size="28px" class="title-icon" />
        <span>Título do Modal</span>
      </div>
    </q-card-section>

    <q-card-section class="modal-body">
      <q-form class="modal-form">
        <div class="form-field">
          <label class="field-label">Nome *</label>
          <q-input
            v-model="valor"
            outlined
            dense
            class="custom-input"
          />
        </div>
      </q-form>
    </q-card-section>

    <q-card-actions align="right" class="modal-actions">
      <q-btn label="Cancelar" class="btn-secondary-custom" v-close-popup unelevated no-caps />
      <q-btn label="Salvar" class="btn-primary-custom" unelevated no-caps />
    </q-card-actions>
  </q-card>
</q-dialog>
```

### Layout de Body e Ações

- `modal-card` deve ser um container flex em coluna.
- `modal-body` deve ocupar o espaço disponível e permitir scroll quando o conteúdo crescer.
- `modal-actions` deve ficar visível mesmo com scroll quando o modal tiver conteúdo longo (preferir `position: sticky` no rodapé da área de ações).

### Cores de Modais

```scss
.modal-card {
  background-color: $background;
  border: 2px solid $cumes-01;
  border-radius: 16px;
  box-shadow: 0 8px 32px $box-shadow-dark;
}

.modal-header {
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 8%) 100%);
  border-bottom: 3px solid $cumes-03;
}

.modal-title {
  color: $offwhite;

  .title-icon {
    color: $cumes-04;
  }
}
```

### Inputs em Formulários

**REGRA IMPORTANTE**: `q-input` em modais deve usar fundo claro com classe `custom-input`, para manter contraste em tema escuro.

```scss
.custom-input {
  :deep(.q-field__control) {
    background-color: $offwhite;
    border-radius: 8px;
    padding: 0 !important;

    &::before {
      border-color: $cumes-01;
      border-width: 2px;
    }
  }

  :deep(.q-field__native) {
    color: $background;
    font-size: 15px;
    font-weight: 500;
    padding: 10px 14px !important;
  }

  :deep(input) {
    padding: 10px 14px !important;
  }

  :deep(input::placeholder) {
    color: rgba($background, 0.5);
  }

  &:deep(.q-field--focused) {
    .q-field__control::before {
      border-color: $cumes-03;
      border-width: 2px;
    }
  }

  &:deep(.q-field--error) {
    .q-field__control::before {
      border-color: $error-color;
    }
  }
}
```

### Labels de Formulário

Regras para `label` e campos obrigatórios:

- `label` deve usar a classe `field-label`.
- Campos obrigatórios devem seguir o padrão `Campo *` (com asterisco separado por espaço).
- O texto do label deve estar em pt-BR e sem abreviações.

```scss
.field-label {
  font-size: 13px;
  font-weight: 700;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
```

### Botões em Modais

Regras para botões:

- Botão primário deve usar `btn-primary-custom`.
- Botão secundário deve usar `btn-secondary-custom`.
- Em ações de fechar/cancelar, quando o modal for controlado por `q-dialog`, preferir `v-close-popup` no botão secundário.

#### Botão Primário (Salvar, Confirmar)

```scss
.btn-primary-custom {
  background: $cumes-01 !important;
  color: $offwhite !important;
  padding: 12px 32px !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px $box-shadow-medium !important;

  &:hover {
    background: darken($cumes-01, 10%) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 16px $box-shadow-strong !important;
  }
}
```

#### Botão Secundário (Cancelar)

```scss
.btn-secondary-custom {
  background: transparent !important;
  color: $cumes-01 !important;
  border: 2px solid $cumes-01 !important;
  padding: 12px 32px !important;

  &:hover {
    background: rgba($cumes-01, 0.1) !important;
  }
}
```

### Tamanhos de Modais

```scss
width: 92vw;
max-width: 500px;

@media (min-width: 768px) {
  width: 600px;
}

@media (min-width: 1024px) {
  width: 700px;
}

@media (min-width: 1440px) {
  width: 800px;
}
```

### ⚠️ Regras Importantes

1. **Sempre use `!important`** em estilos de inputs e botões para evitar conflitos com o Quasar
2. **Padding controlado**: `padding: 0 !important` no container, `10px 14px` no input
3. **Contraste**: Fundo escuro (`$background`) + inputs claros (`$offwhite`)
4. **Labels**: Use `$cumes-04` (amarelo) para máxima visibilidade
5. **Borders**: `2px solid $cumes-01`, muda para `$cumes-03` no focus

### Exemplo Completo

Ver implementação de referência em:
- `frontend/src/components/Perfil/PerfilEditaForm.vue`
- `frontend/src/components/Perfil/PerfilEditaFormAddPrediletaModal.vue`

---

## Perfil — marcações na cordada

Registros em que a pessoa foi citada na cordada (guia/participante/misto) em **escaladas criadas por outros**:

- **Preview no perfil** (`PerfilEscaladasDestaque`): faixa compacta — fundo `rgba(0, 0, 0, 0.14)`, borda `rgba($cumes-01, 0.2)`, título curto **Na cordada**, badge com contagem em `$cumes-03`, bolhas **circulares 44px** com foto da via (scroll horizontal), link **Ver lista** em `$action-escaladas`. Não usar card grande tipo grade 3×N no perfil.
- **Lista autenticada** (`PerfilEscaladasLista` em `/perfil/:username/escaladas`): hero com gradiente (verde → fundo → verde escuro), ícone em caixa com borda laranja, tipografia alinhada ao restante do app; itens em **linhas** (`PerfilMarcacaoEscaladaRow`) — thumb 64px arredondado, nome da via em `$cumes-01`, meta linha com data (pt-BR) e **por @autor** quando disponível.

Utilitário `getViaImageUrl` também considera relação `viaImagens` vinda da API para miniaturas consistentes.

---

## 📚 Referências

### Arquivos Principais

- `frontend/src/css/app.scss` - Variáveis globais e classes utilitárias

---

## 🆘 Dúvidas Comuns

**P: Quando usar `$cumes-01` vs `$cumes-03`?**
R: `$cumes-01` (laranja) é a cor de identidade — navbar, botões primários, links ativos. `$cumes-03` (verde) é acento de natureza — ícones ambientais, acentos secundários.

**P: Posso usar `white`?**
R: Não! Use `$offwhite` que é mais suave e agradável aos olhos.

**P: Como escolher a sombra correta?**
R: Soft para cards sutis, Light para elevação leve, Medium para destaque, Strong/Dark para modais.

**P: Onde usar as variáveis `$action-*`?**
R: Em qualquer elemento relacionado às 3 ações principais do usuário: Escaladas, Favoritos, Coleções.

**P: Como estilizar inputs em modais?**
R: Sempre use fundo `$offwhite` com texto `$background`. Ver seção "Modais e Formulários" para código completo.

**P: Por que usar `!important` nos inputs?**
R: Para evitar conflitos com os estilos padrão do Quasar e garantir consistência visual.

---

---

## 🏷️ Convenção de Nomenclatura

### JavaScript / TypeScript (variáveis, funções, interfaces)
- **ptBR camelCase** obrigatório: `carregando`, `totalVias`, `aoClicarEscalada`
- Nomes de frameworks e libs mantêm originais: `useRouter`, `ref`, `onMounted`
- Constantes: `UPPER_SNAKE_CASE` em ptBR: `CHAVE_CACHE`, `DIAS_CACHE`
- Event handlers: prefixo **`ao*`** em ptBR: `aoSalvar`, `aoEditar`, `aoClicarFavorito`

### CSS (classes, IDs)
- **English kebab-case** é padrão web e deve ser mantido: `.modal-card`, `.btn-primary-custom`, `.field-label`
- Não renomear classes CSS existentes para ptBR (causaria breaking change e vai contra o padrão web)
- Novas classes também devem seguir English kebab-case

### Resumo da regra
| Contexto | Convenção | Exemplo |
|----------|-----------|---------|
| Variáveis JS/TS | ptBR camelCase | `const carregando = ref(false)` |
| Funções JS/TS | ptBR camelCase | `function aoSalvarPerfil() {}` |
| Interfaces/Types | ptBR camelCase | `interface CardExplorar {}` |
| Constantes | ptBR UPPER_SNAKE | `const DIAS_CACHE = 7` |
| Classes CSS | English kebab-case | `.modal-card`, `.via-card` |
| IDs CSS | English kebab-case | `#topbar-inner` |

---

*Última atualização: 2026-05-25*
*Versão: 1.3 — paleta sincronizada com código, $surface adicionada, convenções de nomenclatura*
