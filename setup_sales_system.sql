-- Adicionar colunas faltantes na tabela de produtos
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost_price numeric;

-- Tabela de vendas
CREATE TABLE IF NOT EXISTS public.sales (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products(id),
    product_name text NOT NULL,
    product_color text,
    product_image text,
    cost_price numeric,
    sale_price numeric NOT NULL,
    sale_date date NOT NULL DEFAULT CURRENT_DATE,
    notes text,
    created_at timestamptz DEFAULT now()
);

-- RLS para sales
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    CREATE POLICY "Allow auth full access to sales" ON public.sales FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
    CREATE POLICY "Deny public access to sales" ON public.sales FOR SELECT TO anon USING (false);
EXCEPTION WHEN duplicate_object THEN null;
END $$;
