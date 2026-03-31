import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
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
    const { data, error } = await supabase
      .from('description_json')
      .select('description')
      .eq('category_id', id)
      .maybeSingle();

    if (error) throw error;

    // Retorna a lista de campos ou um array vazio se não existir
    const fields = data?.description?.fields || [];
    return NextResponse.json({ fields });
  } catch (error: unknown) {
    console.error('[API_CATEGORIES_TEMPLATE_GET]', error);
    const message =
      error instanceof Error ? error.message : 'Erro ao buscar template';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
