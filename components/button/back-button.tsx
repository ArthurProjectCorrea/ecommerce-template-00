'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="mb-8 p-0 hover:bg-transparent"
      onClick={() => router.back()}
    >
      <ChevronLeft className="mr-2 size-4" />
      Voltar
    </Button>
  );
}
