'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { notify } from '@/lib/notifications';
import { Spinner } from '@/components/ui/spinner';
import { isUnconfirmedEmailError } from '@/lib/supabase/errors';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { OAuthButtons } from '@/components/auth/oauth-buttons';

import { cn } from '@/lib/utils';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showUnconfirmedAlert, setShowUnconfirmedAlert] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (isUnconfirmedEmailError(authError.message)) {
        setShowUnconfirmedAlert(true);
      } else {
        notify.error(authError.message);
      }
      setLoading(false);
    } else {
      notify.success('Login realizado com sucesso!');
      router.push('/private');
      router.refresh();
    }
  };

  const handleResendConfirmation = async () => {
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      notify.error(error.message);
    } else {
      notify.success('E-mail de confirmação reenviado com sucesso!');
      setShowUnconfirmedAlert(false);
    }
    setResending(false);
  };

  return (
    <>
      <form
        className={cn('mx-auto flex w-full max-w-xs flex-col gap-6', className)}
        onSubmit={handleSubmit}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Entre na sua conta</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Insira seu e-mail abaixo para entrar na sua conta
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@exemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Link
                href="/auth/forgot-password"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field>
            <Button type="submit" disabled={loading}>
              {loading && <Spinner className="mr-2" />}
              {loading ? 'Entrando…' : 'Entrar'}
            </Button>
          </Field>
          <FieldSeparator>Ou continue com</FieldSeparator>
          <Field>
            <OAuthButtons />
          </Field>
          <FieldDescription className="text-center">
            Não tem uma conta?{' '}
            <Link
              href="/auth/signup"
              className="underline underline-offset-4 hover:opacity-80"
            >
              Cadastrar-se
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>

      <AlertDialog
        open={showUnconfirmedAlert}
        onOpenChange={setShowUnconfirmedAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirme seu e-mail</AlertDialogTitle>
            <AlertDialogDescription>
              Seu e-mail ainda não foi confirmado. Verifique sua caixa de
              entrada para completar o cadastro ou clique abaixo para reenviar o
              link de confirmação para <strong>{email}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Agora não</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResendConfirmation}
              disabled={resending}
            >
              {resending && <Spinner className="mr-2" />}
              {resending ? 'Reenviando…' : 'Reenviar e-mail'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
