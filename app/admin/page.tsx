import { redirect } from 'next/navigation';
import { getProfile, createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/page-header';
import { CategoryStockChart } from '@/components/chart/category-stock-chart';
import { PriceRangeChart } from '@/components/chart/price-range-chart';
import { InventoryGrowthChart } from '@/components/chart/inventory-growth-chart';

export default async function PrivatePage() {
  const profile = await getProfile();
  const supabase = await createClient();

  if (!profile) {
    redirect('/auth/login');
  }

  // Fetch data for charts
  const { data: rawData } = await supabase
    .from('products')
    .select('price, created_at, categories(name), stocks(id)');

  type ChartProduct = {
    price: number | null;
    created_at: string;
    categories: { name: string } | { name: string }[] | null;
    stocks: { id: string }[];
  };

  const products = (rawData || []) as unknown as ChartProduct[];

  // 1. Data Aggregation: Category Stock Distribution
  const categoryMap: Record<string, number> = {};
  products.forEach((p) => {
    // Handle both object and array returns for joined data
    const cat = Array.isArray(p.categories) ? p.categories[0] : p.categories;
    const catName = cat?.name || 'Sem Categoria';
    categoryMap[catName] =
      (categoryMap[catName] || 0) + (p.stocks?.length || 0);
  });
  const categoryStockData = Object.entries(categoryMap)
    .map(([category, count]) => ({
      category,
      count,
      fill: `var(--color-${category.toLowerCase().replace(/\s+/g, '-')})`,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 categories

  // 2. Data Aggregation: Price Ranges
  const priceRanges = [
    { range: 'Até R$ 100', count: 0, fill: 'hsl(var(--chart-1))' },
    { range: 'R$ 100 - 500', count: 0, fill: 'hsl(var(--chart-2))' },
    { range: 'Acima de R$ 500', count: 0, fill: 'hsl(var(--chart-3))' },
  ];
  products.forEach((p) => {
    const price = p.price || 0;
    if (price <= 100) priceRanges[0].count++;
    else if (price <= 500) priceRanges[1].count++;
    else priceRanges[2].count++;
  });

  // 3. Data Aggregation: Inventory Growth (Last 30 Days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  });

  const growthMap = products.reduce((acc: Record<string, number>, p) => {
    const date = new Date(p.created_at).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const growthData = last30Days.map((date) => ({
    date,
    count: growthMap[date] || 0,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader breadcrumbs={[{ title: 'Dashboard' }]} />
      <div className="flex-1 space-y-12 p-8 pt-6">
        {/* Top Full-Width Section */}
        <section className="w-full">
          <InventoryGrowthChart data={growthData} />
        </section>

        {/* Bottom Split Section */}
        <section className="grid gap-8 md:grid-cols-2">
          <CategoryStockChart data={categoryStockData} />
          <PriceRangeChart data={priceRanges} />
        </section>

        <section className="bg-muted/30 flex min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed p-10">
          <div className="space-y-2 text-center">
            <h3 className="text-muted-foreground text-xl font-bold tracking-widest uppercase opacity-60">
              Área de Integração de Vendas
            </h3>
            <p className="text-muted-foreground/70 mx-auto max-w-lg text-sm">
              Ambiente reservado para insights de conversão e faturamento.
              Métricas financeiras detalhadas serão ativadas com a integração do
              Checkout.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
