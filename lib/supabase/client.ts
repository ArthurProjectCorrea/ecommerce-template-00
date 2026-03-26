import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

/**
 * Cria uma nova instância do cliente Supabase para o navegador.
 */
export function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY). Please check your .env.local file.'
    );
  }
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Instância única (Singleton) do cliente Supabase para uso em Client Components.
 * Evita a necessidade de chamar createClient() repetidamente.
 * NOTA: Só deve ser acessado no navegador.
 */
export const supabase =
  typeof window !== 'undefined'
    ? createClient()
    : (null as unknown as ReturnType<typeof createClient>);
