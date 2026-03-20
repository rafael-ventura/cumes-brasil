# 🎨 Design System - Cumes Brasil Frontend

Documentação completa das regras de cores, tipografia e componentes do frontend. Peça para sua IA consultar essas informações ao fazer alterações visuais.

---

## 📐 Paleta de Cores

### Cores Principais da Marca

```scss
$cumes-01: #8CB369  // Verde principal (identidade da marca)
$cumes-02: #546119  // Verde escuro
$cumes-03: #F29340  // Laranja (ação/energia)
$cumes-04: #F4E285  // Amarelo (destaque)
$cumes-05: #BC4B51  // Vermelho/bordô (destaque alternativo)
```

### Cores de Fundo e Texto

```scss
$background: #2c2c2c  // Fundo escuro / texto principal em fundos claros
$offwhite: #ffffe4   // Branco suave (preferível ao white puro)
```

### Cores de Feedback

```scss
$error-color: #e74c3c  // Vermelho para erros/deletar
```

### Variáveis Semânticas - Ações do Usuário

```scss
$action-escaladas: $cumes-03  // Laranja - movimento, energia
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
| Informativos | `$cumes-03` | Ícones gerais, informações |
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

## 🎭 Modais e Formulários

### Estrutura Padrão de Modais

Todos os modais devem seguir esta estrutura:

```vue
<q-card class="modal-card">
  <!-- Header com gradiente -->
  <q-card-section class="modal-header">
    <div class="modal-title">
      <q-icon name="icon_name" size="28px" class="title-icon" />
      <span>Título do Modal</span>
    </div>
  </q-card-section>

  <!-- Body com fundo escuro -->
  <q-card-section class="modal-body">
    <!-- Conteúdo aqui -->
  </q-card-section>

  <!-- Actions (opcional) -->
  <q-card-actions class="modal-actions">
    <!-- Botões aqui -->
  </q-card-actions>
</q-card>
```

### Cores de Modais

```scss
// Card principal
.modal-card {
  background-color: $background;  // Fundo escuro
  border: 2px solid $cumes-01;    // Borda verde
  border-radius: 16px;
  box-shadow: 0 8px 32px $box-shadow-dark;
}

// Header com gradiente
.modal-header {
  background: linear-gradient(135deg, $cumes-01 0%, darken($cumes-01, 8%) 100%);
  border-bottom: 3px solid $cumes-03;
}

// Título
.modal-title {
  color: $offwhite;  // Texto branco suave
  
  .title-icon {
    color: $cumes-04;  // Ícone amarelo
  }
}
```

### Inputs em Formulários

**REGRA IMPORTANTE**: Inputs sempre com fundo claro em modais escuros.

```scss
.custom-input {
  :deep(.q-field__control) {
    background-color: $offwhite;  // Fundo claro
    border-radius: 8px;
    padding: 0 !important;  // Remove padding do container
    
    &::before {
      border-color: $cumes-01;  // Borda verde
      border-width: 2px;
    }
  }

  :deep(.q-field__native) {
    color: $background;  // Texto escuro sobre fundo claro
    font-size: 15px;
    font-weight: 500;
    padding: 10px 14px !important;  // Padding controlado
  }

  :deep(input) {
    padding: 10px 14px !important;
  }

  :deep(input::placeholder) {
    color: rgba($background, 0.5);  // Placeholder translúcido
  }

  // Estado focused
  &:deep(.q-field--focused) {
    .q-field__control::before {
      border-color: $cumes-03;  // Muda para laranja
      border-width: 2px;
    }
  }

  // Estado de erro
  &:deep(.q-field--error) {
    .q-field__control::before {
      border-color: $error-color;
    }
  }
}
```

### Labels de Formulário

```scss
.field-label {
  font-size: 13px;
  font-weight: 700;
  color: $cumes-04;  // Amarelo - destaca sobre fundo escuro
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
```

### Botões em Modais

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
// Mobile
width: 92vw;
max-width: 500px;

// Tablet
@media (min-width: 768px) {
  width: 600px;
}

// Desktop
@media (min-width: 1024px) {
  width: 700px;
}

// Large Desktop
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
R: `$cumes-01` (verde) é para identidade/primário. `$cumes-03` (laranja) é para ações/secundário.

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

*Última atualização: 2026-03-19*
*Versão: 1.2 — seção Perfil / marcações na cordada*
