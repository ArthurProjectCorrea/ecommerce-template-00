import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

export async function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY). Please check your .env.local file.'
    );
  }

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

/**
 * Atalho para obter o usuário atual em Server Components.
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Atalho para obter o perfil do usuário atual.
 * Tenta ler do cache (cookies) primeiro para evitar consultas ao banco.
 */
export async function getProfile() {
  const cookieStore = await cookies();
  const cachedProfile = cookieStore.get('app-user-profile')?.value;

  if (cachedProfile) {
    try {
      return JSON.parse(cachedProfile);
    } catch {
      // Ignorar erro de parse e buscar no banco
    }
  }

  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Nota: cookies().set não funciona em Server Components comuns,
  // por isso dependemos do proxy.ts para popular esse cache inicialmente.
  return profile;
}
