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

---

*Última atualização: 2025-01-08*
*Versão: 1.0*
