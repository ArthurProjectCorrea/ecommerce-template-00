import { toast } from 'sonner';

/**
 * Mapeamento de mensagens do Supabase para o português
 */
const translations: Record<string, string> = {
  'Invalid login credentials': 'Credenciais de login inválidas.',
  'Email not confirmed':
    'E-mail não confirmado. Verifique sua caixa de entrada.',
  'User already registered': 'Usuário já cadastrado.',
  'Password should be at least 6 characters':
    'A senha deve ter pelo menos 6 caracteres.',
  'Invalid email address': 'Endereço de e-mail inválido.',
  'Signup is currently unavailable': 'O cadastro está indisponível no momento.',
  'Database error saving new user':
    'Erro ao salvar o novo usuário no banco de dados.',
  'User not found': 'Usuário não encontrado.',
};

/**
 * Traduz mensagens de erro do Supabase
 */
export function translateError(message: string): string {
  return translations[message] || message;
}

/**
 * Verifica se o erro é de e-mail não confirmado
 */
export function isUnconfirmedEmailError(message: string): boolean {
  return message === 'Email not confirmed';
}

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
