-- Create table: categories
CREATE TABLE public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create table: products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description JSONB NOT NULL,
    category_id INT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create table: description_json
CREATE TABLE public.description_json (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description JSONB NOT NULL,
    category_id INT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.description_json ENABLE ROW LEVEL SECURITY;

-- Categories RLS Policies
CREATE POLICY "Leitura livre de categories" 
    ON public.categories FOR SELECT 
    USING (true);

CREATE POLICY "Alteracao de categories restrita para user admin" 
    ON public.categories FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_client = false));

-- Products RLS Policies
CREATE POLICY "Leitura livre de products" 
    ON public.products FOR SELECT 
    USING (true);

CREATE POLICY "Alteracao de products restrita para user admin" 
    ON public.products FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_client = false));

-- Description JSON RLS Policies
CREATE POLICY "Leitura livre de description_json" 
    ON public.description_json FOR SELECT 
    USING (true);

CREATE POLICY "Alteracao de description_json restrita para user admin" 
    ON public.description_json FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_client = false));
