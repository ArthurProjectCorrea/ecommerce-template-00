import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/page-header';
import { Indicators } from '@/components/indicators';
import { CategoriesTable } from '@/components/table/categories-table';
import { Category } from '@/types/categories';

export default async function CategoriesPage() {
  const supabase = await createClient();

  // Buscar categorias com contagem de produtos e templates
  const { data: categoriesData } = await supabase
    .from('categories')
    .select(
      `
      *,
      products:products(count),
      template:description_json(description)
    `
    )
    .order('id', { ascending: true });

  // Buscar total de produtos geral
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  type CategoriesResponse = Category & {
    products: { count: number }[];
    template: { description: { fields: unknown[] } }[];
  };

  const categories = (
    (categoriesData as unknown as CategoriesResponse[]) || []
  ).map((cat) => ({
    ...cat,
    products_count: cat.products?.[0]?.count || 0,
    template_fields: cat.template?.[0]?.description?.fields || [],
  })) as Category[];

  const activeCategories = categories.filter((c) => c.is_active).length;
  const totalCategories = categories.length;

  const breadcrumbs = [{ title: 'Categorias' }];

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader breadcrumbs={breadcrumbs} />

      <div className="flex-1 space-y-8 p-4 pt-4">
        <Indicators
          items={[
            { label: 'Total de Categorias', value: totalCategories },
            { label: 'Categorias Ativas', value: activeCategories },
            { label: 'Total de Produtos', value: totalProducts || 0 },
          ]}
        />

        <CategoriesTable initialCategories={categories as Category[]} />
      </div>
    </div>
  );
}
