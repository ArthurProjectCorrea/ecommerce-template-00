import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    // 1. Atualizar o Produto
    const { error: productError } = await supabase
      .from('products')
      .update({
        name,
        category_id,
        description: description || {},
        price: price || 0,
        is_active: is_active ?? true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (productError) throw productError;

    // 2. Atualizar as Capas (Covers)
    if (cover_urls && Array.isArray(cover_urls)) {
      // Remover capas antigas e inserir as novas
      await supabase.from('covers').delete().eq('products_id', id);

      if (cover_urls.length > 0) {
        const coverRecords = cover_urls.map((url, index) => ({
          products_id: id,
          url,
          order: index + 1,
        }));
        await supabase.from('covers').insert(coverRecords);
      }
    }

    // 3. Adicionar Registros de Estoque (Stock) em massa (se houver quantidade positiva)
    const stockCount = parseInt(stock) || 0;
    if (stockCount > 0) {
      const stockRecords = Array.from({ length: stockCount }).map(() => ({
        products_id: id,
      }));

      await supabase.from('stocks').insert(stockRecords);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[API_PRODUCTS_PATCH]', error);
    const message =
      error instanceof Error ? error.message : 'Erro ao atualizar produto';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    // 1. Buscar as URLs das capas para limpar o Storage
    const { data: covers } = await supabase
      .from('covers')
      .select('url')
      .eq('products_id', id);

    // 2. Deletar o produto (Cascateia para covers e stocks no DB)
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) throw error;

    // 3. Limpar o Storage se houver imagens
    if (covers && covers.length > 0) {
      const paths = covers
        .map((c) => {
          const parts = c.url.split('/public/products/');
          return parts.length > 1 ? parts[1] : null;
        })
        .filter(Boolean) as string[];

      if (paths.length > 0) {
        await supabase.storage.from('products').remove(paths);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[API_PRODUCTS_DELETE]', error);
    const message =
      error instanceof Error ? error.message : 'Erro ao excluir produto';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
