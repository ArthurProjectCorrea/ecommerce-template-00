import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      category_id,
      description,
      price,
      is_active,
      stock,
      cover_urls,
    } = body;

    // 1. Criar o Produto
    const { data: product, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          category_id,
          description: description || {},
          price: price || 0,
          is_active: is_active ?? true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // 2. Criar as Capas (Covers)
    if (cover_urls && Array.isArray(cover_urls) && cover_urls.length > 0) {
      const coverRecords = cover_urls.map((url, index) => ({
        products_id: product.id,
        url,
        order: index + 1,
      }));

      const { error: coverError } = await supabase
        .from('covers')
        .insert(coverRecords);

      if (coverError) console.error('[API_PRODUCTS_COVER_ERROR]', coverError);
    }

    // 3. Criar Registros de Estoque (Stock) em massa
    const stockCount = parseInt(stock) || 0;
    if (stockCount > 0) {
      const stockRecords = Array.from({ length: stockCount }).map(() => ({
        products_id: product.id,
      }));

      const { error: stockError } = await supabase
        .from('stocks')
        .insert(stockRecords);

      if (stockError) console.error('[API_PRODUCTS_STOCK_ERROR]', stockError);
    }

    return NextResponse.json(product);
  } catch (error: unknown) {
    console.error('[API_PRODUCTS_POST]', error);
    const message =
      error instanceof Error ? error.message : 'Erro ao criar produto';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
