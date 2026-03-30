'use client';

import { useState, ReactNode } from 'react';
import { GalleryVerticalEnd } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import TermsContent from '@/content/terms.mdx';
import PrivacyContent from '@/content/privacy.mdx';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col justify-between gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="w-full">{children}</div>
        <div className="text-muted-foreground mt-8 flex items-center justify-center text-center text-xs text-balance">
          <p>Ao continuar, você concorda com nossos </p>
          <Button
            variant="link"
            onClick={() => setOpenTerms(true)}
            className="hover:text-primary cursor-pointer text-xs transition-colors"
          >
            Termos de Serviço
          </Button>{' '}
          <p>e </p>
          <Button
            variant="link"
            onClick={() => setOpenPrivacy(true)}
            className="hover:text-primary cursor-pointer text-xs transition-colors"
          >
            Política de Privacidade.
          </Button>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/auth.jpg"
          alt="Imagem de fundo"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      <Dialog open={openTerms} onOpenChange={setOpenTerms}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4 py-4">
            <div className="prose prose-sm dark:prose-invert">
              <TermsContent />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openPrivacy} onOpenChange={setOpenPrivacy}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4 py-4">
            <div className="prose prose-sm dark:prose-invert">
              <PrivacyContent />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
