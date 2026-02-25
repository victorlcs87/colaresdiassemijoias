-- Adiciona a coluna 'color' à tabela de produtos
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color text;
