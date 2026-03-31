import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';
import { ResetPasswordForm } from '@/components/form/reset-password-form';

export default async function ResetPasswordPage() {
  const user = await getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <ResetPasswordForm email={user?.email} />;
}
