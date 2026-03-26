import { ResetPasswordForm } from '@/components/forms/reset-password-form';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <ResetPasswordForm email={user?.email} />
      </div>
    </div>
  );
}
