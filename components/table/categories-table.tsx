'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { CategoryCard } from '@/components/card/category-card';
import { CategoriesDialog } from '@/components/dialog/categories-dialog';
import { DataTableFilter } from '@/components/ui/data-table';
import { Category } from '@/types/categories';

interface CategoriesTableProps {
  initialCategories: Category[];
}

export function CategoriesTable({ initialCategories }: CategoriesTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category | null>(null);

  // Definindo as colunas apenas para o motor de filtragem/ordenação do TanStack
  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
    },
  ];

  const table = useReactTable({
    data: initialCategories,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir');
      }

      toast.success('Categoria excluída com sucesso!');
      router.refresh();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error('Erro ao excluir: ' + errorMessage);
    }
  };

  const filteredCategories = table
    .getRowModel()
    .rows.map((row) => row.original);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <DataTableFilter
          table={table}
          searchKey="name"
          searchPlaceholder="Filtrar categorias por nome..."
        />
        <CategoriesDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          category={selectedCategory}
          showTrigger={true}
          onTriggerClick={handleOpenCreate}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        ))}

        {filteredCategories.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed p-12">
            <p className="text-slate-500">Nenhuma categoria encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}
