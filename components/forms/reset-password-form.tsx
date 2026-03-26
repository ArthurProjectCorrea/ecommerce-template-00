'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { notify } from '@/lib/notifications';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export function ResetPasswordForm({
  email,
  className,
  ...props
}: { email?: string } & React.ComponentProps<'form'>) {
  const router = useRouter();
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

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      notify.error(error.message);
      setLoading(false);
    } else {
      notify.success('Senha atualizada com sucesso!');
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <form
      className={cn('mx-auto flex w-full max-w-xs flex-col gap-6', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Nova senha</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Crie uma nova senha segura para sua conta
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input id="email" type="email" value={email} disabled />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Nova Senha</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">
            Confirmar Nova Senha
          </FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        <Field>
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Spinner className="mr-2" />}
            {loading ? 'Atualizando…' : 'Redefinir Senha'}
          </Button>
        </Field>
        <FieldDescription>
          Certifique-se de que a senha tenha pelo menos 8 caracteres.
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
