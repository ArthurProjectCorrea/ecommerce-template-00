'use client';

import * as React from 'react';
import { Product } from '@/types/products';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/app/admin/products/columns';

interface ProductsTableProps {
  initialProducts: Product[];
}

export function ProductsTable({ initialProducts }: ProductsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={initialProducts}
      searchKey="produto"
      searchPlaceholder="Filtrar por nome de produto..."
      newRecordLink="/admin/products/create"
    />
  );
}
