import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';
import { ResetPasswordForm } from '@/components/forms/reset-password-form';

export default async function ResetPasswordPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return <ResetPasswordForm email={user?.email} />;
}
