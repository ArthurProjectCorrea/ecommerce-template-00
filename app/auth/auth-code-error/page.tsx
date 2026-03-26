'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlertIcon } from 'lucide-react';

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
          <p className="text-muted-foreground">
            Não foi possível validar seu link de confirmação. Isso pode
            acontecer se o link já foi usado ou se ele expirou.
          </p>
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
