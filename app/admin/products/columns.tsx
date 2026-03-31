'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { TableDeleteDialog } from '@/components/table/table-delete-dialog';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Product } from '@/types/products';

const ActionsCell = ({ product }: { product: Product }) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir produto');
      }

      toast.success('Produto excluído com sucesso');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao excluir produto');
      console.error(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(product.id)}
        >
          Copiar ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/admin/products/${product.id}`}>Editar</Link>
        </DropdownMenuItem>

        <TableDeleteDialog
          onConfirm={handleDelete}
          title="Excluir Produto?"
          description={`Esta ação excluirá permanentemente o produto ${product.name} e todo o seu estoque.`}
          trigger={
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="text-destructive font-medium"
            >
              Excluir Produto
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    id: 'produto',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Produto" />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const cover =
        product.covers?.find((c) => c.order === 1) || product.covers?.[0];
      const imageUrl = cover?.url || '/placeholder-product.jpg';

      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted relative h-10 w-10 overflow-hidden rounded-md border">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <span className="font-medium">{product.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'price',
    id: 'preço',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Preço" />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('preço'));
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'is_active',
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('status') as boolean;
      return (
        <Badge variant={isActive ? 'default' : 'destructive'}>
          {isActive ? 'Ativo' : 'Inativo'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'categories.name',
    id: 'categorias',
    header: 'Categorias',
    cell: ({ row }) => {
      const categoryName = row.original.categories?.name;
      return <Badge variant="outline">{categoryName || 'Sem Categoria'}</Badge>;
    },
  },
  {
    accessorKey: 'description',
    id: 'descrição',
    header: 'Detalhes',
    cell: ({ row }) => {
      const product = row.original;
      const description =
        (product.description as Record<
          string,
          string | number | boolean | null
        >) || {};
      const metadata = Object.entries(description).filter(
        ([key]) => key !== 'general_description'
      );

      return (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              Ver Detalhes
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 border-2 shadow-xl">
            <div className="space-y-2">
              <h4 className="text-primary border-primary/20 border-b-2 pr-2 pb-1 text-sm font-bold tracking-wider uppercase">
                Especificações Técnicas
              </h4>
              <div className="mt-3 grid gap-1">
                {metadata.length > 0 ? (
                  metadata.map(([key, value]) => (
                    <div
                      key={key}
                      className="border-muted hover:bg-muted/30 flex items-center justify-between rounded border-b px-1 py-1.5 text-xs transition-colors last:border-0"
                    >
                      <span className="text-muted-foreground font-bold capitalize">
                        {key.replace('_', ' ')}:
                      </span>
                      <span className="text-foreground font-semibold">
                        {String(value)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground py-2 text-xs italic">
                    Nenhuma especificação disponível.
                  </p>
                )}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: 'created_at',
    id: 'data de criação',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('data de criação'));
      return date.toLocaleDateString('pt-BR');
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsCell product={row.original} />,
  },
];
