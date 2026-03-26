'use client';

import { useState } from 'react';
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
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { translateError } from '@/lib/supabase/errors';

export function ResetPasswordForm({
  email,
  className,
  ...props
}: { email?: string } & React.ComponentProps<'div'>) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('As senhas não coincidem');
      return;
    }
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      toast.error(translateError(error.message));
      setLoading(false);
    } else {
      toast.success('Senha atualizada com sucesso!');
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="flex min-h-[480px] flex-col justify-center p-6 text-balance md:p-8"
            onSubmit={handleSubmit}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Nova senha</h1>
                <p className="text-muted-foreground text-sm">
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
    </div>
  );
}
