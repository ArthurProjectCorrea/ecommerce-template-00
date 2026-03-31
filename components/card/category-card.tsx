import * as React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Edit, Trash2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { Category } from '@/types/categories';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-start justify-between">
              <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg">
                <Package className="text-muted h-6 w-6" />
              </div>
              <Badge
                variant="default"
                className={cn(
                  'text-primary-foreground rounded-md border-none px-3 py-2 font-bold'
                )}
              >
                {category.is_active ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-2">
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-bold capitalize">{category.name}</h3>
            <p className="line-clamp-2 min-h-[40px] text-sm">
              {category.description ||
                'Nenhuma descrição informada para esta categoria.'}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm font-medium">
                {category.products_count || 0} produtos
              </span>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    className="gap-2"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2"
                    onSelect={(e) => {
                      e.preventDefault();
                      setShowDeleteAlert(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria{' '}
              <span className="text-foreground decoration-primary font-bold whitespace-nowrap underline decoration-2 underline-offset-4">
                {category.name}
              </span>
              ? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteAlert(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                onDelete(category.id);
                setShowDeleteAlert(false);
              }}
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
