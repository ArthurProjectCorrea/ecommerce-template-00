import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutButton } from '@/components/auth/logout-button';
import { ModeToggle } from '@/components/mode-toggle';
import { Badge } from '@/components/ui/badge';
import { getProjectVersion } from '@/lib/version';

export default async function PrivatePage() {
  const supabase = await createClient();
  const version = getProjectVersion();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const name =
    user.user_metadata?.full_name || user.user_metadata?.name || 'Usuário';
  const email = user.email;
  const avatarUrl = user.user_metadata?.avatar_url;
  const initials = name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center gap-4 text-center">
          <Avatar className="size-20">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-2xl">{name}</CardTitle>
            <CardDescription>{email}</CardDescription>
            <Badge
              variant="outline"
              className="mt-2 font-mono text-[10px] opacity-60"
            >
              v{version}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Você está autenticado e tem acesso à sua área restrita protegida
            pelo Supabase.
          </p>
        </CardContent>
        <FieldSeparator className="py-0" />
        <CardFooter className="flex justify-center gap-4 pt-6">
          <LogoutButton />
          <ModeToggle />
        </CardFooter>
      </Card>
    </main>
  );
}

// Internal helper for separation in the card
function FieldSeparator({ className }: { className?: string }) {
  return (
    <div className={`flex items-center px-6 ${className}`}>
      <div className="bg-border h-px w-full" />
    </div>
  );
}
