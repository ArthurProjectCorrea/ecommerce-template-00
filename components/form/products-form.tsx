'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';

import { supabase } from '@/lib/supabase/client';
import { ImageUpload } from '@/components/ui/image-upload';
import { Product } from '@/types/products';
import { Category } from '@/types/categories';

interface ProductsFormProps {
  initialData?: Product | null;
  onSuccess?: () => void;
}

export function ProductsForm({ initialData, onSuccess }: ProductsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [categories, setCategories] = React.useState<
    Pick<Category, 'id' | 'name'>[]
  >([]);
  const [templateFields, setTemplateFields] = React.useState<string[]>([]);

  // Imagens existentes no banco (URLs)
  const existingCovers =
    initialData?.covers?.sort((a, b) => a.order - b.order).map((c) => c.url) ||
    [];

  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    price: initialData?.price?.toString() || '',
    is_active: initialData?.is_active ?? true,
    category_id: initialData?.category_id?.toString() || '',
    description:
      (initialData?.description as Record<
        string,
        string | number | boolean | null
      >) || {},
    stock: '',
  });

  // Lista mista de imagens (URLs e Arquivos)
  const [images, setImages] = React.useState<(string | File)[]>(existingCovers);
  // Lista de URLs marcadas para exclusão no Storage
  const [deletedUrls, setDeletedUrls] = React.useState<string[]>([]);

  // Fetch Categories
  React.useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Erro ao buscar categorias:', error);
        return;
      }
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  // Fetch Template when category changes
  React.useEffect(() => {
    if (formData.category_id) {
      const fetchTemplate = async () => {
        const { data, error } = await supabase
          .from('description_json')
          .select('description')
          .eq('category_id', formData.category_id)
          .maybeSingle();

        if (error) {
          console.error('Erro ao buscar template:', error);
          return;
        }

        if (data?.description?.fields) {
          const fields = data.description.fields;
          setTemplateFields(fields);

          setFormData((prev) => {
            const currentDesc = { ...prev.description };
            fields.forEach((field: string) => {
              if (currentDesc[field] === undefined) {
                currentDesc[field] = '';
              }
            });
            return { ...prev, description: currentDesc };
          });
        } else {
          setTemplateFields([]);
        }
      };
      fetchTemplate();
    } else {
      setTemplateFields([]);
    }
  }, [formData.category_id]);

  const handleDescriptionChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [field]: value,
      },
    }));
  };

  const handleUploadToStorage = async (file: File) => {
    if (!file || !file.name) {
      throw new Error('Arquivo inválido para upload');
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from('products').getPublicUrl(filePath);

    return publicUrl;
  };

  const deleteFromStorage = async (url: string) => {
    if (!url) return;
    try {
      const parts = url.split('/public/products/');
      if (parts.length > 1) {
        const path = parts[1];
        await supabase.storage.from('products').remove([path]);
      }
    } catch (error) {
      console.error('Erro ao deletar imagem antiga:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) {
      toast.error('Selecione uma categoria');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Processar todas as imagens (Upload das novas)
      const finalUrls: string[] = [];

      for (const item of images) {
        if (item instanceof File) {
          const url = await handleUploadToStorage(item);
          finalUrls.push(url);
        } else if (typeof item === 'string') {
          finalUrls.push(item);
        }
      }

      // 2. Chamada à API
      const url = initialData?.id
        ? `/api/products/${initialData.id}`
        : '/api/products';
      const method = initialData?.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category_id: parseInt(formData.category_id),
          price: parseFloat(formData.price) || 0,
          cover_urls: finalUrls, // Notar plural: cover_urls
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao salvar');
      }

      // 3. Limpeza do Storage (Apenas se salvou com sucesso)
      for (const urlToDelete of deletedUrls) {
        await deleteFromStorage(urlToDelete);
      }

      toast.success(initialData ? 'Produto atualizado!' : 'Produto criado!');
      router.refresh();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/products');
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('[PRODUCTS_FORM_ERROR]', error);
      toast.error('Erro ao salvar: ' + message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {initialData ? 'Editar Produto' : 'Criar Produto'}
            </h2>
            <p className="text-muted-foreground text-sm">
              Preencha os campos para gerenciar seu item.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
      >
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Dados principais e especificações.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Field>
                <FieldLabel htmlFor="name">Nome do Produto</FieldLabel>
                <Input
                  id="name"
                  placeholder="Ex: iPhone 15 Pro..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="general_description">Descrição</FieldLabel>
                <Textarea
                  id="general_description"
                  placeholder="Fale sobre este produto..."
                  rows={4}
                  value={
                    (formData.description.general_description as string) || ''
                  }
                  onChange={(e) =>
                    handleDescriptionChange(
                      'general_description',
                      e.target.value
                    )
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="category">Categoria</FieldLabel>
                <Select
                  value={formData.category_id}
                  onValueChange={(val) =>
                    setFormData({ ...formData, category_id: val })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="description_field">
                  Descrição das Especificações
                </FieldLabel>
                {templateFields.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {templateFields.map((field) => (
                      <div key={field} className="space-y-2">
                        <FieldLabel htmlFor={field} className="text-xs">
                          {field}
                        </FieldLabel>
                        <Input
                          id={field}
                          value={
                            (formData.description[field] as string | number) ||
                            ''
                          }
                          onChange={(e) =>
                            handleDescriptionChange(field, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-xs italic">
                    Selecione uma categoria para habilitar especificações.
                  </p>
                )}
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preços</CardTitle>
            </CardHeader>
            <CardContent>
              <Field>
                <FieldLabel htmlFor="price">Preço de Venda (R$)</FieldLabel>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Imagens do Produto</CardTitle>
              <CardDescription>
                Adicione várias imagens. A primeira será a principal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={images}
                onChange={(newImages) => setImages(newImages)}
                onRemove={(url) => setDeletedUrls((prev) => [...prev, url])}
                disabled={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Ativo</p>
                  <p className="text-muted-foreground text-xs">
                    Exibir na loja
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <Field>
                <FieldLabel htmlFor="stock">Quantidade</FieldLabel>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required={!initialData}
                />
                <p className="text-muted-foreground mt-2 text-[10px]">
                  {initialData
                    ? 'Adicionar itens ao estoque.'
                    : 'Quantidade inicial limitada.'}
                </p>
              </Field>
            </CardContent>
          </Card>

          <div className="sticky top-8 flex flex-col gap-3">
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner />
                  <span>Salvando...</span>
                </div>
              ) : initialData ? (
                'Salvar Alterações'
              ) : (
                'Criar Produto'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => router.push('/admin/products')}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
