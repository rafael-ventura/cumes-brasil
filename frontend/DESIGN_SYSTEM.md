# Design System - Cumes Brasil

## 🎨 Paleta de Cores

### Cores Principais ($cumes)
```scss
$cumes-01: #8CB369  // Verde Aventura (Principal)
$cumes-02: #546119  // Verde Escuro
$cumes-03: #F29340  // Laranja Montanhismo
$cumes-04: #F4E285  // Amarelo Suave
$cumes-05: #BC4B51  // Vermelho/Bordô
$offwhite: #ffffe4  // Off-white
```

---

## 📐 Padrão de Uso de Cores

### 🎯 Títulos e Headers

**Títulos Principais (Hero, H1)**
- Cor: `$cumes-04` (amarelo)
- Uso: Títulos de destaque, hero sections
- Exemplo: Home hero title

**Títulos Secundários (H2, H3)**
- Cor: `$cumes-01` (verde principal)
- Uso: Seções, categorias
- Exemplo: "Explore por categoria"

**Subtítulos**
- Cor: `$cumes-03` (laranja)
- Uso: Descrições, subtextos
- Exemplo: Subtítulos de seções

---

### 📦 Cards

**Background dos Cards**
- Principal: `rgba($cumes-01, 0.75)` - Verde com 75% opacidade
- Alternativo: `$cumes-05` - Vermelho/Bordô para destaque
- Neutro: `white` com sombra

**Texto em Cards**
- Título: `black` (peso bold)
- Informações: `black` (peso normal)
- Metadados: `rgba(0, 0, 0, 0.7)`

---

### 🏷️ Badges e Tags

**Badges de Grau/Dificuldade**
- Background: `$cumes-03` (laranja)
- Texto: `black`
- Border radius: `10px`

**Badges de Status**
- Sucesso: `$cumes-01` (verde)
- Alerta: `$cumes-04` (amarelo)
- Erro: `$cumes-05` (vermelho)

---

### 🔘 Botões

**Botão Primário**
- Background: `transparent`
- Border: `1px solid $cumes-03`
- Texto: `$cumes-03`
- Hover: `background-color: $cumes-03`

**Botão Secundário**
- Background: `$cumes-02` (verde escuro)
- Texto: `$offwhite`
- Hover: `darken($cumes-02, 10%)`

**Botão de Ação (FAB)**
- Background: `$cumes-03` (laranja)
- Texto: `white`

---

### 🎭 Fundos e Seções

**Hero Section**
- Background: `linear-gradient(to bottom, $cumes-01 0%, darken($cumes-01, 8%) 100%)`
- Texto: `white` ou `$cumes-04`

**Seções Alternadas**
- Seção 1: `linear-gradient(180deg, rgba($cumes-05, 0.03) 0%, transparent 100%)`
- Seção 2: `white` ou `transparent`

**Cards/Containers de Destaque**
- Background: `$cumes-05` (vermelho)
- Texto: `$offwhite`

---

### 💬 Modais e Overlays

**Background do Modal**
- Background: `white`
- Header: `$cumes-01` ou `$cumes-05` (dependendo da ação)
- Texto: `black`

**Overlay**
- Background: `rgba(0, 0, 0, 0.6)`

---

### 📊 Stats e Números

**Ícones de Stats**
- Cor 1: `$cumes-04` (amarelo)
- Cor 2: `$cumes-05` (vermelho)
- Cor 3: `$cumes-03` (laranja)

**Valores/Números**
- Cor: `$cumes-01` (verde)
- Peso: bold

**Labels**
- Cor: `$cumes-03` (laranja)
- Texto: uppercase

---

## 🔧 Inconsistências Encontradas

### ❌ Problemas Atuais

1. **Cores Hardcoded**
   - `frontend/src/pages/Perfil.vue` usa cores hardcoded (#546119, #F4E285, #BC4B51)
   - Deveria usar as variáveis ($cumes-02, $cumes-04, $cumes-05)

2. **Uso Inconsistente de Transparência**
   - Alguns cards usam `rgba($cumes-01, 0.75)`
   - Outros usam cores sólidas sem padrão

3. **Texto em Cards**
   - Alguns usam `black`, outros `white`
   - Precisa padronizar baseado no background

---

## ✅ Próximos Passos

1. Substituir cores hardcoded por variáveis
2. Padronizar backgrounds de cards
3. Criar classes utilitárias no `app.scss`
4. Revisar modais e overlays
5. Documentar componentes que seguem o padrão

