'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { translateError } from '@/lib/supabase/errors';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(translateError(error.message));
      setLoading(false);
    } else {
      toast.success('Logout realizado com sucesso!');
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={loading}
      className="w-full sm:w-auto"
    >
      {loading ? (
        <Spinner className="mr-2" />
      ) : (
        <LogOut className="mr-2 size-4" />
      )}
      {loading ? 'Saindo...' : 'Sair da conta'}
    </Button>
  );
}
