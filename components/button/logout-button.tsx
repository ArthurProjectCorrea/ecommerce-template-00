'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { notify } from '@/lib/notifications';
import { Spinner } from '@/components/ui/spinner';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      notify.error(error.message);
      setLoading(false);
    } else {
      notify.success('Logout realizado com sucesso!');
      router.push('/auth/login');
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
