import { toast } from 'sonner';
import { translateError } from '@/lib/supabase/errors';

/**
 * Centralizador de notificações (Toasts)
 */
export const notify = {
  /**
   * Exibe uma mensagem de sucesso
   */
  success: (message: string) => {
    toast.success(message);
  },

  /**
   * Exibe uma mensagem de erro, traduzindo automaticamente mensagens do Supabase
   */
  error: (error: unknown) => {
    let message = 'Ocorreu um erro inesperado. Tente novamente.';

    if (typeof error === 'string') {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = (error as { message: string }).message;
    }

    toast.error(translateError(message));
  },
};
