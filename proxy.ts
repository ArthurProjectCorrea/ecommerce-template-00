import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './lib/supabase/config';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se o usuário estiver autenticado, verificar o perfil (com cache em cookies)
  if (user) {
    const cachedProfileValue = request.cookies.get('app-user-profile')?.value;
    let profile = null;

    if (cachedProfileValue) {
      try {
        profile = JSON.parse(cachedProfileValue);
      } catch {
        // Ignorar erro de parse e buscar no banco
      }
    }

    // Se não estiver no cache, buscar no banco
    if (!profile) {
      const { data: dbProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      profile = dbProfile;

      if (profile) {
        // Salva o perfil no cookie da resposta para que as próximas requisições (incluindo Server Components) vejam
        supabaseResponse.cookies.set(
          'app-user-profile',
          JSON.stringify(profile),
          {
            maxAge: 60 * 60 * 24, // 1 dia
            path: '/',
          }
        );
      }
    }

    // Se o perfil não existir nem no cache nem no banco, forçar logout
    if (!profile) {
      const response = NextResponse.redirect(
        new URL('/auth/login', request.url)
      );
      // Limpa os cookies relacionados ao Supabase e o cache do perfil
      request.cookies.getAll().forEach((cookie) => {
        if (
          cookie.name.includes('supabase-auth') ||
          cookie.name.startsWith('sb-') ||
          cookie.name === 'app-user-profile'
        ) {
          response.cookies.delete(cookie.name);
        }
      });
      return response;
    }

    // Se estiver acessando /admin e for um cliente, redirecionar para a home (/) imediato
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (profile.is_client) {
        const response = NextResponse.redirect(new URL('/', request.url));
        // Passar o cookie de perfil adiante no redirecionamento para evitar recarga
        response.cookies.set('app-user-profile', JSON.stringify(profile), {
          maxAge: 60 * 60 * 24,
          path: '/',
        });
        return response;
      }
    }
  } else if (request.nextUrl.pathname.startsWith('/admin')) {
    // Bloquear usuários não autenticados na rota /admin
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
