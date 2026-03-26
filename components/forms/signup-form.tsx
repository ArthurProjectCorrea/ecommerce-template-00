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
import { cn } from '@/lib/utils';
import { OAuthButtons } from '@/components/auth/oauth-buttons';
import { InfoIcon } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      notify.error('As senhas não coincidem');
      return;
    }
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: name,
          },
        },
      });

      if (authError) {
        notify.error(authError.message);
      } else if (data.user && data.session) {
        notify.success('Cadastro realizado com sucesso!');
        router.push('/');
        router.refresh();
      } else if (data.user && !data.session) {
        notify.success(
          'Cadastro realizado. Verifique seu e-mail para confirmar a conta.'
        );
        router.push('/login');
      }
    } catch {
      notify.error('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn('mx-auto flex w-full max-w-xs flex-col gap-6', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup className="grid grid-cols-1 gap-x-8 gap-y-6">
        <div className="col-span-full flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Crie sua conta</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Preencha o formulário abaixo para criar sua conta
          </p>
        </div>
        <Field className="col-span-full md:col-span-1">
          <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="João Silva"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field className="col-span-full md:col-span-1">
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="email"
              type="email"
              placeholder="m@exemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <HoverCard openDelay={10} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <InfoIcon />
                </HoverCardTrigger>
                <HoverCardContent className="flex w-64 flex-col gap-0.5">
                  <FieldDescription>
                    Usaremos isso para contatá-lo. Não compartilharemos seu
                    e-mail com ninguém.
                  </FieldDescription>
                </HoverCardContent>
              </HoverCard>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field className="col-span-full md:col-span-1">
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FieldDescription>Deve ter pelo menos 8 caracteres.</FieldDescription>
        </Field>
        <Field className="col-span-full md:col-span-1">
          <FieldLabel htmlFor="confirm-password">Confirmar Senha</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <FieldDescription>Por favor, confirme sua senha.</FieldDescription>
        </Field>
        <Field className="col-span-full">
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Spinner className="mr-2" />}
            {loading ? 'Criando Conta…' : 'Criar Conta'}
          </Button>
        </Field>
        <FieldSeparator className="col-span-full">
          Ou continue com
        </FieldSeparator>
        <Field className="col-span-full">
          <OAuthButtons />
        </Field>
        <FieldDescription className="col-span-full text-center">
          Já tem uma conta?{' '}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:opacity-80"
          >
            Entrar
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
