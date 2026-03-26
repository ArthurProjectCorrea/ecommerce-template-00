import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './lib/supabase/config';

export async function proxy(request: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Se as variáveis estiverem faltando, apenas continue sem o Supabase (ou trate o erro conforme necessário)
    // Para o proxy de auth, talvez queiramos lançar um erro ou apenas passar direto.
    // Como este proxy é usado no middleware, vamos retornar a resposta original para não quebrar o site
    // mas logar o erro se não estivermos em build.
    if (
      process.env.NODE_ENV !== 'production' ||
      process.env.NEXT_PHASE !== 'phase-production-build'
    ) {
      console.error('Missing Supabase environment variables in proxy');
    }
    return NextResponse.next({ request });
  }

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

  // if hitting /private, block unauthenticated users before rendering
  if (
    request.nextUrl.pathname === '/private' ||
    request.nextUrl.pathname.startsWith('/private/')
  ) {
    if (!user) {
      // redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
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
