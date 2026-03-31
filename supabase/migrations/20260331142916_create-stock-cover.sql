-- Create covers table
CREATE TABLE IF NOT EXISTS public.covers (
  id bigint generated always as identity primary key,
  url text not null,
  products_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create stocks table
CREATE TABLE IF NOT EXISTS public.stocks (
  id bigint generated always as identity primary key,
  products_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
