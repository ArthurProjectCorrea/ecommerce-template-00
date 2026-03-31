'use client';

import * as React from 'react';
import { Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFilter } from './data-table-filter';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  newRecordForm?: (onClose: () => void) => React.ReactNode;
  newRecordDialogTitle?: string;
  newRecordDialogDescription?: string;
  dialogSize?: string;
  newRecordLink?: string;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder,
  newRecordForm,
  newRecordDialogTitle,
  newRecordDialogDescription,
  dialogSize,
  newRecordLink,
}: DataTableToolbarProps<TData>) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <DataTableFilter
          table={table}
          searchKey={searchKey}
          searchPlaceholder={searchPlaceholder}
        />
        <DataTableViewOptions table={table} />
        {newRecordLink ? (
          <Button variant="default" size="sm" className="gap-2 px-4" asChild>
            <Link href={newRecordLink}>
              <Plus className="h-4 w-4" />
              Novo Registro
            </Link>
          </Button>
        ) : (
          newRecordForm && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="gap-2 px-4">
                  <Plus className="h-4 w-4" />
                  Novo Registro
                </Button>
              </DialogTrigger>
              <DialogContent className={cn('sm:max-w-lg', dialogSize)}>
                <DialogHeader>
                  <DialogTitle>
                    {newRecordDialogTitle || 'Novo Registro'}
                  </DialogTitle>
                  {newRecordDialogDescription && (
                    <DialogDescription>
                      {newRecordDialogDescription}
                    </DialogDescription>
                  )}
                </DialogHeader>
                <div className="py-4">
                  {newRecordForm(() => setIsOpen(false))}
                </div>
              </DialogContent>
            </Dialog>
          )
        )}
      </div>
    </div>
  );
}
