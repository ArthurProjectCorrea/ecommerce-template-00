'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { translateError, isUnconfirmedEmailError } from '@/lib/supabase/errors';
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showUnconfirmedAlert, setShowUnconfirmedAlert] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (isUnconfirmedEmailError(authError.message)) {
        setShowUnconfirmedAlert(true);
      } else {
        toast.error(translateError(authError.message));
      }
      setLoading(false);
    } else {
      toast.success('Login realizado com sucesso!');
      router.push('/private');
      router.refresh();
    }
  };

  const handleResendConfirmation = async () => {
    setResending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(translateError(error.message));
    } else {
      toast.success('E-mail de confirmação reenviado com sucesso!');
      setShowUnconfirmedAlert(false);
    }
    setResending(false);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="flex min-h-[480px] flex-col justify-center p-6 md:p-8"
            onSubmit={handleSubmit}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
                <p className="text-muted-foreground text-balance">
                  Faça login na sua conta da Acme Inc
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
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
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
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Ou continue com
              </FieldSeparator>
              <Field>
                <OAuthButtons />
              </Field>
              <FieldDescription className="text-center">
                Não tem uma conta?{' '}
                <Link href="/signup" className="underline hover:opacity-80">
                  Cadastre-se
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/auth.jpg"
              alt="Imagem de fundo"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Ao clicar em continuar, você concorda com nossos{' '}
        <Link href="/terms">Termos de Serviço</Link> e{' '}
        <Link href="/privacy">Política de Privacidade</Link>.
      </FieldDescription>

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
    </div>
  );
}
