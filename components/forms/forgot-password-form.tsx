'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { translateError } from '@/lib/supabase/errors';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    if (error) {
      toast.error(translateError(error.message));
      setLoading(false);
    } else {
      toast.success('E-mail de recuperação enviado!');
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div
      className={cn('mx-auto flex w-full max-w-xs flex-col gap-6', className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Recuperar senha</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {sent
              ? 'Verifique seu e-mail para o link de redefinição.'
              : 'Insira seu e-mail e enviaremos um link.'}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="grid gap-4">
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
            <Button type="submit" disabled={loading}>
              {loading && <Spinner className="mr-2" />}
              {loading ? 'Enviando…' : 'Enviar Link'}
            </Button>
          </form>
        ) : (
          <Button variant="outline" onClick={() => setSent(false)}>
            Tentar outro e-mail
          </Button>
        )}

        <FieldDescription className="text-center">
          <Link
            href="/auth/login"
            className="flex items-center justify-center underline underline-offset-4 hover:opacity-80"
          >
            <ChevronLeft className="mr-1 size-4" />
            Voltar para o login
          </Link>
        </FieldDescription>
      </FieldGroup>
    </div>
  );
}
