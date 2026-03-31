import Image from 'next/image';
import Link from 'next/link';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { getUser } from '@/lib/supabase/server';
import { getProjectVersion } from '@/lib/version';
import { Badge } from '@/components/ui/badge';

export default async function Home() {
  const user = await getUser();
  const version = getProjectVersion();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        <div className="flex items-center gap-3">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <Badge
            variant="secondary"
            className="font-mono text-[10px] opacity-70"
          >
            v{version}
          </Badge>
        </div>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50">
            {user ? 'Bem-vindo de volta!' : 'Acesse sua conta para começar.'}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {user
              ? 'Você já está autenticado. Acesse seu perfil para gerenciar sua conta e ver suas informações privadas.'
              : 'Experimente o poder do Next.js integrado com Supabase Auth. Sistema robusto de login, cadastro e recuperação de senha.'}
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          {user ? (
            <Link
              className="bg-foreground text-background flex h-12 w-full items-center justify-center gap-2 rounded-full px-8 transition-colors hover:bg-[#383838] md:w-auto dark:hover:bg-[#ccc]"
              href="/admin"
            >
              <ShieldCheck className="size-4" />
              Acessar Área Privada
            </Link>
          ) : (
            <>
              <Link
                className="bg-foreground text-background flex h-12 w-full items-center justify-center gap-2 rounded-full px-8 transition-colors hover:bg-[#383838] md:w-auto dark:hover:bg-[#ccc]"
                href="/auth/login"
              >
                <LogIn className="size-4" />
                Entrar
              </Link>
              <Link
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-solid border-black/[.08] px-8 transition-colors hover:border-transparent hover:bg-black/[.04] md:w-auto dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                href="/auth/signup"
              >
                <UserPlus className="size-4" />
                Cadastre-se
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
