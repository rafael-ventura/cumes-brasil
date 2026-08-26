# 🎨 Design System - Cumes Brasil Frontend

Full documentation of color rules, typography, and component conventions for the frontend. Point your AI assistant at this file when making visual changes.

---

## UI Preferences (Quasar and PrimeVue)

**Direction: PrimeVue-first for UI components; Quasar stays as the base (shell).** Quasar was **never** meant to leave the project — it's the build system, PWA layer, routing/scaffolding, and the layouts (`q-layout`, `q-page`, `MainLayout`/`TopBar`/`NavBar`). Swapping that base out would mean rewriting the whole app, with no real benefit to the user. What changes is the preference for **widget-level components**:

| Layer | Technology | Examples |
|-------|-----------|----------|
| Shell / build / PWA / layout | **Quasar** (keep) | `q-layout`, `q-page`, structural `q-dialog`, boot files, `quasar.config` |
| UI widgets (forms, tables, selects, buttons) | **PrimeVue** (prefer) | `Select`, `DataTable`, `Paginator`, `Button`, `InputText` |

- **New components**: use PrimeVue when a suitable equivalent exists (PrimeVue v4 + PassThrough `pt` is much more configurable than `q-*` for visual customization — hence the preference). Fall back to `q-*` when there's no equivalent.
- **Migrating existing components is incremental**: when touching an area (a feature), migrate that area's `q-*` components to PrimeVue consistently — avoid leaving the same screen half Quasar, half PrimeVue.
- New components must respect both the dark-theme color/contrast rules and the modal/form patterns described in this file.
- When overriding external component styles, use `!important` where necessary for visual consistency.
- When styling internals of components in `<style scoped>`, use `:deep(...)`.

---

## 📐 Color Palette

### Primary Brand Colors

```scss
$cumes-01: #F29340  // Main orange — brand identity, the most-used color in the UI
$cumes-02: #546119  // Dark green
$cumes-03: #8CB369  // Green (contrast / nature / secondary accents)
$cumes-04: #F4E285  // Yellow (highlight)
$cumes-05: #BC4B51  // Red/maroon (alternative highlight)
```

### Background & Text Colors

```scss
$background: #1a1d22  // Main dark background (body, pages)
$surface: #22262c     // Elevated surfaces (cards, modals, top bar)
$offwhite: #ffffe4    // Soft white (preferred over pure white)
```

### Feedback Colors

```scss
$error-color: #e74c3c  // Red for errors/delete actions
```

### Semantic Variables — User Actions

```scss
$action-escaladas: $cumes-01  // Orange — action, movement, energy
$action-favoritos: $cumes-04  // Yellow — star, highlight
$action-colecoes: $cumes-02   // Dark green — organization
```

**Where to use them:**

- **Climbs (Escaladas)**: log-a-climb buttons, climb cards
- **Favorites**: star button, favorite cards
- **Collections**: add-to-collection button, collection cards

---

## 🎯 Color Usage Rules

### 1. Backgrounds

| Element | Color | Example |
|---------|-------|---------|
| Primary cards | `$cumes-01` | ViaCard, ColecaoCard, navbar |
| Secondary/informational cards | `$offwhite` | Stat cards, modals |
| General page background | `$background` | Body, pages |

### 2. Text

| Context | Color | When to use |
|---------|-------|-------------|
| On dark/green background | `$offwhite` | Text on navbar, hero sections |
| On light background | `$background` | Text on white cards, modals |
| Highlight titles (hero) | `$cumes-04` | Large titles in hero sections |
| Page titles | `$cumes-01` | H2, H3 on pages |

### 3. Buttons

#### Primary Button

- **Background**: `$cumes-01`
- **Text**: `$offwhite`
- **Use**: primary actions (Save, Create, Log in, Confirm)

#### Secondary Button

- **Background**: `$cumes-03`
- **Text**: `$offwhite`
- **Use**: secondary actions (See more, Filter, Edit)

#### Tertiary Button

- **Background**: `$offwhite` or transparent
- **Border**: `1px solid $cumes-01`
- **Text**: `$cumes-01`
- **Use**: Cancel, Back

#### Danger Button

- **Background**: `$error-color`
- **Text**: `$offwhite`
- **Use**: Delete, Log out, Remove

### 4. Icons & Badges

| Type | Color | Use |
|------|-------|-----|
| Informational | `$cumes-01` | General icons, information, actions |
| Nature accent | `$cumes-03` | Icons related to trails, vegetation, environment |
| Highlight | `$cumes-04` | Elements that need to grab attention |
| Status/Grade | Varies | See the Grades section |

---

## 🎨 Standardized Transparencies

Avoid using `rgba()` directly. Use these variables instead:

```scss
$overlay-light: rgba(255, 255, 255, 0.08)   // Light overlay
$overlay-dark: rgba(0, 0, 0, 0.05)          // Dark overlay
$text-shadow-default: rgba(0, 0, 0, 0.2)   // Default text shadow
$box-shadow-soft: rgba(0, 0, 0, 0.08)      // Soft shadow
$box-shadow-light: rgba(0, 0, 0, 0.12)     // Light shadow
$box-shadow-medium: rgba(0, 0, 0, 0.15)    // Medium shadow
$box-shadow-strong: rgba(0, 0, 0, 0.2)     // Strong shadow
$box-shadow-dark: rgba(0, 0, 0, 0.3)       // Dark shadow
```

---

## 🏔️ Grade/Difficulty Colors

Used on route difficulty badges:

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

## 📏 The 60-30-10 Rule

The core design principle applied throughout:

- **60%**: dominant color (background, neutral space — usually `$background` or `$offwhite`)
- **30%**: primary color (`$cumes-01` — main brand color)
- **10%**: secondary/tertiary accent colors (`$cumes-03`, `$cumes-04`)

---

## 📱 Responsiveness

- **Mobile**: < 768px
- **Tablet**: 768px – 1024px
- **Desktop**: ≥ 1024px

---

## 🚀 Implementation Checklist

When building a new component, check:

- [ ] Uses color variables from `app.scss` (never hardcoded)
- [ ] Uses `$offwhite` instead of `white`
- [ ] Uses shadow variables instead of raw `rgba()`
- [ ] Follows the 60-30-10 rule
- [ ] Has adequate text/background contrast
- [ ] Is consistent with similar existing components
- [ ] Works on both mobile and desktop
- [ ] Uses semantic variables where applicable (`$action-*`)

---

## PrimeVue Components (mostly dark theme)

> **PrimeVue v4** (no theme preset): components are imported per-file and styled manually. Watch for **v4 class names** — `Dropdown` became `Select` (`p-select`, `p-select-label`, `p-select-dropdown`, `p-select-option`, `p-select-overlay`). The v3 classes (`p-dropdown*`) don't exist anymore.

**Reference implementations (copy the styling pattern from these):**
- **Tables / admin panels** → `frontend/src/pages/Admin/AdminUsuarios.vue` (PrimeVue `DataTable` + `Column` + `Select` + `Tag` + `Button` + `InputText`, all with dark-theme overrides).
- **Pagination** → `frontend/src/components/PaginacaoPadrao.vue` (`Paginator` + `Select`).

- Select: when the theme makes the component look washed-out white, override `p-select`, `p-inputtext`, `p-select-label`, `p-select-dropdown`, `p-select-overlay`, and `p-select-option` to use `$background`/`$offwhite` with `$cumes-03` borders.
- Paginator: style `p-paginator-page`, `p-paginator-prev/next/first/last` (the active page is `p-paginator-page-selected` in v4), with `!important` where needed.
- **Overlays** (`p-select-overlay`, menus rendered on `body`) need `:global(...)`, not `:deep(...)`.
- In `scoped` styles, all other internal PrimeVue component selectors should use `:deep(...)`.

---

## 🎭 Modals & Forms

### Standard Modal Structure

Every modal should follow this structure:

```vue
<q-dialog v-model="isOpen" @hide="handleHide">
  <q-card class="modal-card">
    <q-card-section class="modal-header">
      <div class="modal-title">
        <q-icon name="icon_name" size="28px" class="title-icon" />
        <span>Modal Title</span>
      </div>
    </q-card-section>

    <q-card-section class="modal-body">
      <q-form class="modal-form">
        <div class="form-field">
          <label class="field-label">Name *</label>
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
      <q-btn label="Cancel" class="btn-secondary-custom" v-close-popup unelevated no-caps />
      <q-btn label="Save" class="btn-primary-custom" unelevated no-caps />
    </q-card-actions>
  </q-card>
</q-dialog>
```

### Body & Actions Layout

- `modal-card` should be a flex column container.
- `modal-body` should fill the available space and scroll once content grows.
- `modal-actions` should stay visible while scrolling for modals with long content (prefer `position: sticky` at the bottom of the actions area).

### Modal Colors

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

### Form Inputs

**IMPORTANT RULE**: `q-input` inside modals must use a light background via the `custom-input` class, to keep contrast readable on the dark theme.

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

### Form Labels

Rules for `label`s and required fields:

- Labels should use the `field-label` class.
- Required fields follow the `Field *` pattern (asterisk separated by a space).
- Label text should read naturally, without unnecessary abbreviations.

```scss
.field-label {
  font-size: 13px;
  font-weight: 700;
  color: $cumes-04;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
```

### Modal Buttons

Button rules:

- Primary buttons use `btn-primary-custom`.
- Secondary buttons use `btn-secondary-custom`.
- For close/cancel actions on a `q-dialog`-controlled modal, prefer `v-close-popup` on the secondary button.

#### Primary Button (Save, Confirm)

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

#### Secondary Button (Cancel)

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

### Modal Sizes

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

### ⚠️ Important Rules

1. **Always use `!important`** on input and button styles to avoid conflicts with Quasar's defaults
2. **Controlled padding**: `padding: 0 !important` on the container, `10px 14px` on the input
3. **Contrast**: dark background (`$background`) + light inputs (`$offwhite`)
4. **Labels**: use `$cumes-04` (yellow) for maximum visibility
5. **Borders**: `2px solid $cumes-01`, switching to `$cumes-03` on focus

### Full Example

See reference implementations at:
- `frontend/src/components/Perfil/PerfilEditaForm.vue`
- `frontend/src/components/Perfil/PerfilEditaFormAddPrediletaModal.vue`

---

## Profile — "On the Rope" Mentions

Records where a person was mentioned in the rope team (guide/participant/mixed) in **climbs logged by other people**:

- **Profile preview** (`PerfilEscaladasDestaque`): a compact strip — background `rgba(0, 0, 0, 0.14)`, border `rgba($cumes-01, 0.2)`, short title **On the Rope**, count badge in `$cumes-03`, **44px circular** bubbles with the route's photo (horizontal scroll), a **See list** link in `$action-escaladas`. Don't use a large 3×N grid card on the profile for this.
- **Authenticated list** (`PerfilEscaladasLista` at `/perfil/:username/escaladas`): a hero with a gradient (green → background → dark green), an icon in a box with an orange border, typography matching the rest of the app; items shown as **rows** (`PerfilMarcacaoEscaladaRow`) — a rounded 64px thumbnail, route name in `$cumes-01`, a meta line with the date (localized) and **by @author** when available.

The `getViaImageUrl` utility also considers the `viaImagens` relation coming from the API for consistent thumbnails.

---

## 📚 References

### Main Files

- `frontend/src/css/app.scss` - global variables and utility classes

---

## 🆘 Common Questions

**Q: When should I use `$cumes-01` vs. `$cumes-03`?**
A: `$cumes-01` (orange) is the identity color — navbar, primary buttons, active links. `$cumes-03` (green) is the nature accent — environmental icons, secondary accents.

**Q: Can I use `white`?**
A: No! Use `$offwhite`, which is softer and easier on the eyes.

**Q: How do I pick the right shadow?**
A: Soft for subtle cards, Light for slight elevation, Medium for emphasis, Strong/Dark for modals.

**Q: Where should I use the `$action-*` variables?**
A: On any element tied to the app's three main user actions: Climbs, Favorites, Collections.

**Q: How do I style inputs inside modals?**
A: Always use an `$offwhite` background with `$background` text. See the "Modals & Forms" section for the full code.

**Q: Why use `!important` on inputs?**
A: To avoid conflicts with Quasar's default styles and keep visual consistency.

---

## 🏷️ Naming Conventions

### JavaScript / TypeScript (variables, functions, interfaces)
- **pt-BR camelCase** is mandatory: `carregando`, `totalVias`, `aoClicarEscalada`
- Framework and library names keep their originals: `useRouter`, `ref`, `onMounted`
- Constants: `UPPER_SNAKE_CASE` in pt-BR: `CHAVE_CACHE`, `DIAS_CACHE`
- Event handlers: pt-BR **`ao*`** prefix: `aoSalvar`, `aoEditar`, `aoClicarFavorito`

### CSS (classes, IDs)
- **English kebab-case** is the web standard and is kept as such: `.modal-card`, `.btn-primary-custom`, `.field-label`
- Existing CSS classes are never renamed to Portuguese (that would be a breaking change and go against web convention)
- New classes also follow English kebab-case

### Convention summary
| Context | Convention | Example |
|---------|-----------|---------|
| JS/TS variables | pt-BR camelCase | `const carregando = ref(false)` |
| JS/TS functions | pt-BR camelCase | `function aoSalvarPerfil() {}` |
| Interfaces/types | pt-BR camelCase | `interface CardExplorar {}` |
| Constants | pt-BR UPPER_SNAKE | `const DIAS_CACHE = 7` |
| CSS classes | English kebab-case | `.modal-card`, `.via-card` |
| CSS IDs | English kebab-case | `#topbar-inner` |

---

*Last updated: 2026-08-25*
*Version: 2.0 — translated to English for the project's archival; content otherwise unchanged from v1.3*
