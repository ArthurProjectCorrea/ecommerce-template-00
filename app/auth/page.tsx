import { redirect } from 'next/navigation';

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const error = params.error as string | undefined;
  const description = params.error_description as string | undefined;

  if (error || description) {
    redirect(
      `/auth/auth-code-error?error=${encodeURIComponent(error || '')}&error_description=${encodeURIComponent(description || '')}`
    );
  }

  redirect('/login');
}
