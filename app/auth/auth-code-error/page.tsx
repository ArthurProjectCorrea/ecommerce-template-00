'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlertIcon } from 'lucide-react';

function ErrorMessage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const description = searchParams.get('error_description');

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        {description ||
          (error === 'missing_code'
            ? 'Não foi possível validar seu link de confirmação.'
            : 'Ocorreu um erro inesperado durante a autenticação.')}
      </p>
      {error && error !== 'missing_code' && (
        <div className="bg-muted text-muted-foreground rounded-md p-2 font-mono text-xs">
          Erro: {error}
        </div>
      )}
      <p className="text-muted-foreground text-sm">
        Isso pode acontecer se o link já foi usado ou se ele expirou.
      </p>
    </div>
  );
}

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <ShieldAlertIcon className="size-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Erro na Confirmação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense
            fallback={
              <p className="text-muted-foreground text-sm">
                Carregando detalhes do erro...
              </p>
            }
          >
            <ErrorMessage />
          </Suspense>
          <div className="space-y-2 pt-4">
            <Button asChild className="w-full">
              <Link href="/login">Voltar para o Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Ir para a Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
