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
    const { name, description, is_active, fields } = body;

    // 1. Atualizar Categoria
    const { error: catError } = await supabase
      .from('categories')
      .update({
        name,
        description,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (catError) throw catError;

    // 2. Atualizar Template de Descrição (description_json)
    if (fields) {
      const { error: templateError } = await supabase
        .from('description_json')
        .upsert(
          {
            category_id: id,
            name: `Template ${name || ''}`,
            description: { fields },
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'category_id' }
        );

      if (templateError) throw templateError;
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[API_CATEGORIES_PATCH]', error);
    const message =
      error instanceof Error ? error.message : 'Erro ao atualizar categoria';
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
    // 1. Deletar Templates Associados (Evitar violação de FK)
    await supabase.from('description_json').delete().eq('category_id', id);

    // 2. Deletar Categoria
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[API_CATEGORIES_DELETE]', error);
    const message =
      error instanceof Error ? error.message : 'Erro ao excluir categoria';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
