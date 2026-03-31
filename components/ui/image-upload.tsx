'use client';

import * as React from 'react';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: (string | File)[];
  onChange: (value: (string | File)[]) => void;
  onRemove: (url: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value = [],
  onChange,
  onRemove,
  className,
  disabled,
}: ImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      onChange([...value, ...newFiles]);
    }
  };

  const removeItem = (index: number) => {
    const itemToRemove = value[index];
    if (typeof itemToRemove === 'string') {
      onRemove(itemToRemove);
    }
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {value.map((item, index) => {
          const url =
            typeof item === 'string' ? item : URL.createObjectURL(item);
          return (
            <div
              key={index}
              className="bg-muted group relative aspect-square overflow-hidden rounded-lg border shadow-sm"
            >
              <div className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  onClick={() => removeItem(index)}
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 shadow-md"
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Image
                fill
                className="object-cover"
                alt="Imagem do Produto"
                src={url}
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          );
        })}
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={cn(
            'border-muted-foreground/25 bg-muted/30 hover:bg-muted/60 hover:border-muted-foreground/40 relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <Plus className="text-muted-foreground mb-2 h-8 w-8" />
          <span className="text-muted-foreground px-2 text-center text-xs font-medium">
            Adicionar Imagem
          </span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onUpload}
            className="hidden"
            accept="image/*"
            multiple
          />
        </div>
      </div>
    </div>
  );
}
