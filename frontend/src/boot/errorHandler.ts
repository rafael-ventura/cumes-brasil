import { boot } from 'quasar/wrappers';
import { Notify } from 'quasar';
import { createNotifyConfig } from 'src/utils/utils';

// Interface para erros customizados
interface CustomError extends Error {
  statusCode?: number;
  originalError?: any;
}

// Função para tratar erros globais
function handleGlobalError(error: unknown, vm?: any, info?: string) {
  console.error('Erro global capturado:', error);
  console.error('Componente:', vm);
  console.error('Info:', info);

  let message = 'Ocorreu um erro inesperado';

  // Tratamento específico por tipo de erro
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const customError = error as CustomError;
    switch (customError.statusCode) {
      case 401:
        message = 'Sessão expirada. Faça login novamente.';
        // Redirecionar para login se necessário
        break;
      case 403:
        message = 'Acesso negado';
        break;
      case 404:
        message = 'Recurso não encontrado';
        break;
      case 429:
        message = 'Muitas requisições. Tente novamente em alguns minutos.';
        break;
      case 500:
        message = 'Erro interno do servidor';
        break;
      default:
        message = customError.message || 'Erro inesperado';
    }
  } else if (error && typeof error === 'object' && 'name' in error) {
    const err = error as Error;
    if (err.name === 'NetworkError') {
      message = 'Erro de conexão. Verifique sua internet.';
    } else if (err.name === 'TypeError') {
      message = 'Erro de tipo de dados';
    } else if (err.message) {
      message = err.message;
    }
  } else if (error && typeof error === 'object' && 'message' in error) {
    const err = error as Error;
    message = err.message;
  }

  // Mostrar notificação de erro
  Notify.create(createNotifyConfig('negative', message, 'top', 5000));
}

// Função para tratar erros de promessas não capturadas
function handleUnhandledRejection(event: PromiseRejectionEvent) {
  console.error('Promise rejeitada não tratada:', event.reason);

  let message = 'Erro inesperado na aplicação';

  if (event.reason?.message) {
    message = event.reason.message;
  } else if (typeof event.reason === 'string') {
    message = event.reason;
  }

    Notify.create(createNotifyConfig('negative', message, 'top', 5000));
}

// Função para tratar erros de JavaScript
function handleJavaScriptError(event: ErrorEvent) {
  console.error('Erro JavaScript:', event.error);

  const message = event.error?.message || 'Erro JavaScript inesperado';
  Notify.create(createNotifyConfig('negative', message, 'top', 5000));
}

export default boot(({ app }) => {
  // Configurar handler de erro global do Vue
  app.config.errorHandler = handleGlobalError;

  // Configurar handlers de erro do navegador
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  window.addEventListener('error', handleJavaScriptError);

  // Limpar event listeners quando necessário
  app.config.globalProperties.$cleanupErrorHandlers = () => {
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    window.removeEventListener('error', handleJavaScriptError);
  };
});
