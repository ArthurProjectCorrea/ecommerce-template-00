import { LoginForm } from '@/components/form/login-form';
import { unauthorized } from 'next/navigation';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  if (error) {
    unauthorized();
  }

  return <LoginForm />;
}
