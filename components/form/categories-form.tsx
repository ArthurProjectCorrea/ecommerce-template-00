'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import { Plus, Trash2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface CategoriesFormProps {
  initialData?: Category | null;
  onSuccess: () => void;
}

export function CategoriesForm({
  initialData,
  onSuccess,
}: CategoriesFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  // Estado básico da categoria
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    is_active: initialData?.is_active ?? true,
  });

  // Estado das colunas/campos dinâmicos do JSON
  const [newFieldName, setNewFieldName] = React.useState('');
  const [fields, setFields] = React.useState<string[]>(
    initialData?.template_fields || []
  );

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    if (fields.includes(newFieldName.trim())) {
      toast.error('Este campo já existe');
      return;
    }
    setFields([...fields, newFieldName.trim()]);
    setNewFieldName('');
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = initialData?.id
        ? `/api/categories/${initialData.id}`
        : '/api/categories';

      const method = initialData?.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          fields,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar');
      }

      toast.success(
        initialData ? 'Categoria atualizada!' : 'Categoria criada!'
      );
      router.refresh();
      onSuccess();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error('Erro ao salvar: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto pr-2 pb-4">
        {/* Seção 1: Dados Básicos */}
        <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field className="col-span-1">
            <FieldLabel htmlFor="name">Nome da Categoria</FieldLabel>
            <Input
              id="name"
              placeholder="Ex: Eletrônicos, Roupas..."
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </Field>
          <Field className="col-span-2">
            <FieldLabel htmlFor="description">Descrição Curta</FieldLabel>
            <Textarea
              id="description"
              placeholder="Breve resumo da categoria..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
            />
          </Field>
        </FieldGroup>

        <Field className="col-span-2">
          <FieldLabel htmlFor="is_active">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Categoria Ativa</FieldTitle>
                <FieldDescription>
                  Habilite ou desabilite esta categoria para exibição na loja.
                </FieldDescription>
              </FieldContent>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
            </Field>
          </FieldLabel>
        </Field>

        <Separator />

        {/* Seção 2: Template de Descrição Dinâmica */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div>
              <h4 className="font-bold">Estrutura de Descrição do Produto</h4>
              <p className="text-muted-foreground text-xs">
                Defina quais campos os produtos desta categoria deverão
                preencher.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Field className="flex-1">
              <Input
                placeholder="Nome do campo (Ex: Cor, Voltagem, Material...)"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), handleAddField())
                }
              />
            </Field>
            <Button
              type="button"
              variant="default"
              onClick={handleAddField}
              className="shrink-0 self-end"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>

          <div className="border-muted rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80%] px-4">Nome do Campo</TableHead>
                  <TableHead className="px-4 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-muted-foreground h-24 text-center"
                    >
                      Nenhum campo definido. Adicione campos para criar o modelo
                      de JSON.
                    </TableCell>
                  </TableRow>
                ) : (
                  fields.map((field, index) => (
                    <TableRow key={index}>
                      <TableCell className="px-4 font-medium">
                        {field}
                      </TableCell>
                      <TableCell className="px-4 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveField(index)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-none justify-end gap-3 pt-6">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="default"
          disabled={isLoading}
          className="min-w-[140px]"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner />
              <span>{initialData ? 'Salvando...' : 'Criando...'}</span>
            </div>
          ) : initialData ? (
            'Salvar Alterações'
          ) : (
            'Criar Categoria'
          )}
        </Button>
      </div>
    </form>
  );
}
