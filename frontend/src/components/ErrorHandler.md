# ErrorHandler Component

Componente reutilizável para tratamento de erros em toda a aplicação.

## Uso Básico

```vue
<template>
  <div>
    <ErrorHandler :error="error" @close="clearError" />
    <!-- resto do conteúdo -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ErrorHandler from 'src/components/ErrorHandler.vue';

const error = ref(null);

const clearError = () => {
  error.value = null;
};
</script>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `error` | `Error \| null` | `null` | Objeto de erro a ser exibido |
| `showNotification` | `boolean` | `true` | Se deve mostrar notificação toast |
| `position` | `string` | `'top'` | Posição da notificação |
| `timeout` | `number` | `5000` | Tempo da notificação em ms |

## Events

| Event | Payload | Descrição |
|-------|---------|-----------|
| `close` | - | Emitido quando o usuário fecha o erro |

## Exemplos de Uso

### 1. Com notificação automática
```vue
<ErrorHandler :error="error" />
```

### 2. Sem notificação (apenas banner)
```vue
<ErrorHandler :error="error" :show-notification="false" />
```

### 3. Com posição personalizada
```vue
<ErrorHandler
  :error="error"
  position="top-right"
  :timeout="3000"
/>
```

### 4. Em formulários
```vue
<template>
  <q-form @submit="handleSubmit">
    <ErrorHandler :error="formError" />
    <!-- campos do formulário -->
  </q-form>
</template>
```

### 5. Em listas de dados
```vue
<template>
  <div>
    <ErrorHandler :error="loadError" />
    <div v-if="!loadError">
      <!-- lista de itens -->
    </div>
  </div>
</template>
```

## Integração com APIs

```vue
<script setup>
const fetchData = async () => {
  try {
    const data = await api.getData();
    // processar dados
  } catch (err) {
    error.value = err instanceof Error ? err : new Error('Erro desconhecido');
  }
};
</script>
```

## Estilização

O componente usa as cores do tema Quasar:
- `bg-negative` para o fundo do banner
- `text-white` para o texto
- Ícone de erro em branco

## Responsividade

O componente é responsivo por padrão e se adapta a diferentes tamanhos de tela.
