import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/page-header';
import { ProductsTable } from '@/components/table/products-table';
import { Indicators } from '@/components/indicators';
import { Product } from '@/types/products';

export default async function ProductsPage() {
  const supabase = await createClient();

  // Buscando produtos com as informações da categoria e estoque
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name), covers(url, order), stocks(id)')
    .order('created_at', { ascending: false });

  const initialProducts = (products || []) as (Product & {
    stocks: { id: string }[];
  })[];
  const totalProducts = initialProducts.length;

  // Cálculo de estoque e valor financeiro
  const totalStockItems = initialProducts.reduce(
    (acc, p) => acc + (p.stocks?.length || 0),
    0
  );
  const totalStockValue = initialProducts.reduce(
    (acc, p) => acc + (p.price || 0) * (p.stocks?.length || 0),
    0
  );

  const formattedStockValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact', // Formato resumido como solicitado: R$ 1.2M, R$ 10K
  }).format(totalStockValue);

  const breadcrumbs = [{ title: 'Produtos' }];

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader breadcrumbs={breadcrumbs} />

      <div className="flex-1 space-y-8 p-4 pt-4">
        <Indicators
          items={[
            { label: 'Total de Produtos', value: totalProducts },
            { label: 'Valor em Estoque', value: formattedStockValue },
            { label: 'Total em Estoque', value: totalStockItems },
          ]}
        />

        <ProductsTable initialProducts={initialProducts} />
      </div>
    </div>
  );
}
