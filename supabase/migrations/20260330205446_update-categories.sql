-- Adicionar coluna is_active na tabela categories
ALTER TABLE public.categories 
ADD COLUMN is_active BOOLEAN DEFAULT true;
