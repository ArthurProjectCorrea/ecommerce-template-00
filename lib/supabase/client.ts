import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

/**
 * Cria uma nova instância do cliente Supabase para o navegador.
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Instância única (Singleton) do cliente Supabase para uso em Client Components.
 * Evita a necessidade de chamar createClient() repetidamente.
 */
export const supabase = createClient();
