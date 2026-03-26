export function translateError(message: string): string {
  const translations: Record<string, string> = {
    'Invalid login credentials': 'Credenciais de login inválidas.',
    'Email not confirmed':
      'E-mail não confirmado. Verifique sua caixa de entrada.',
    'User already registered': 'Usuário já cadastrado.',
    'Password should be at least 6 characters':
      'A senha deve ter pelo menos 6 caracteres.',
    'Invalid email address': 'Endereço de e-mail inválido.',
    'Signup is currently unavailable':
      'O cadastro está indisponível no momento.',
    'Database error saving new user':
      'Erro ao salvar o novo usuário no banco de dados.',
    'User not found': 'Usuário não encontrado.',
  };

  return translations[message] || message;
}
export function isUnconfirmedEmailError(message: string): boolean {
  return message === 'Email not confirmed';
}
