'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Github } from 'lucide-react';
import { translateError } from '@/lib/supabase/errors';
import { Spinner } from '@/components/ui/spinner';

export function OAuthButtons() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuthLogin = async (provider: 'github') => {
    setLoadingProvider(provider);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/private`,
      },
    });

    if (error) {
      toast.error(translateError(error.message));
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        type="button"
        disabled={!!loadingProvider}
        onClick={() => handleOAuthLogin('github')}
        className="w-full"
      >
        {loadingProvider === 'github' ? (
          <Spinner className="mr-2" />
        ) : (
          <Github className="mr-2 size-4" />
        )}
        Continuar com GitHub
      </Button>

      {/* 
        Para adicionar novos provedores no futuro:
        1. Adicione o ícone correspondente
        2. Crie um novo botão chamando handleOAuthLogin('provider_name')
        3. Certifique-se de configurar o provedor no Dashboard do Supabase
      */}
    </div>
  );
}
