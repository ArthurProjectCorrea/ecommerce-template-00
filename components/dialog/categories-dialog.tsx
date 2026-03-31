'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CategoriesForm } from '@/components/form/categories-form';
import { Category } from '@/types/categories';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CategoriesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  showTrigger?: boolean;
  onTriggerClick?: () => void;
}

export function CategoriesDialog({
  isOpen,
  onOpenChange,
  category,
  showTrigger,
  onTriggerClick,
}: CategoriesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button
            onClick={onTriggerClick}
            className="bg-primary text-primary-foreground rounded-lg px-6 font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Categoria
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="flex h-[650px] max-h-[90vh] flex-col overflow-hidden p-6 sm:max-w-5xl">
        <DialogHeader className="flex-none pb-4">
          <DialogTitle className="text-2xl">
            {category ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
          <DialogDescription>
            {category
              ? 'Atualize as informações e a estrutura de campos desta categoria.'
              : 'Preencha os dados abaixo e defina a estrutura de campos para os produtos desta categoria.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <CategoriesForm
            initialData={category}
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
