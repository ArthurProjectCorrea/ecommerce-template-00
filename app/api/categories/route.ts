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
    const { name, description, is_active, fields } = body;

    // 1. Inserir Categoria
    const { data: category, error: catError } = await supabase
      .from('categories')
      .insert([
        {
          name,
          description,
          is_active: is_active ?? true,
        },
      ])
      .select()
      .single();

    if (catError) throw catError;

    // 2. Criar Template de Descrição (description_json)
    if (fields) {
      const { error: templateError } = await supabase
        .from('description_json')
        .insert([
          {
            name: `Template ${name}`,
            description: { fields },
            category_id: category.id,
          },
        ]);

      if (templateError) throw templateError;
    }

    return NextResponse.json(category);
  } catch (error: unknown) {
    console.error('[API_CATEGORIES_POST]', error);
    const message =
      error instanceof Error ? error.message : 'Erro ao criar categoria';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
