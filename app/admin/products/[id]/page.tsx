import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProductsForm } from '@/components/form/products-form';
import { PageHeader } from '@/components/page-header';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Buscar o produto com as categorias e as capas
  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name), covers(url, order)')
    .eq('id', id)
    .single();

  if (!product) {
    notFound();
  }

  const breadcrumbs = [
    { title: 'Produtos', href: '/admin/products' },
    { title: `Editar ${product.name}` },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader breadcrumbs={breadcrumbs} />
      <div className="flex-1 space-y-8 p-8 pt-6">
        <ProductsForm initialData={product} />
      </div>
    </div>
  );
}
