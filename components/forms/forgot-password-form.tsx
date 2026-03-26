'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { ChevronLeft } from 'lucide-react';

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

    const supabase = createClient();
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
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="flex min-h-[480px] flex-col justify-center p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center text-balance">
                <h1 className="text-2xl font-bold">Recuperar senha</h1>
                <p className="text-muted-foreground text-sm">
                  {sent
                    ? 'Verifique seu e-mail para o link de redefinição.'
                    : 'Insira seu e-mail e enviaremos um link para você.'}
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
                  href="/login"
                  className="flex items-center justify-center underline hover:opacity-80"
                >
                  <ChevronLeft className="mr-1 size-4" />
                  Voltar para o login
                </Link>
              </FieldDescription>
            </FieldGroup>
          </div>
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
