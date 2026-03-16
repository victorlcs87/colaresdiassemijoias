-- Bootstrap completo do banco Supabase para Colares Dias Semijoias
-- Execução sugerida: rodar este arquivo em banco novo e, em seguida, rodar o seed_colares_catalog.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL DEFAULT 0,
    image_url text,
    image_gallery jsonb DEFAULT '[]'::jsonb,
    is_available boolean NOT NULL DEFAULT true,
    sizes jsonb,
    category text,
    stock_quantity integer NOT NULL DEFAULT 1,
    color text,
    cost_price numeric(10,2),
    promotional_price numeric(10,2),
    condition text NOT NULL DEFAULT 'novo' CHECK (condition IN ('novo', 'seminovo'))
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Tabela de configurações da loja
CREATE TABLE IF NOT EXISTS public.store_settings (
    key text PRIMARY KEY,
    value text NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

DROP TRIGGER IF EXISTS trg_store_settings_updated_at ON public.store_settings;
CREATE TRIGGER trg_store_settings_updated_at
BEFORE UPDATE ON public.store_settings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Tabela de vendas
CREATE TABLE IF NOT EXISTS public.sales (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
    product_name text NOT NULL,
    product_color text,
    product_image text,
    cost_price numeric(10,2),
    sale_price numeric(10,2) NOT NULL,
    sale_date date NOT NULL DEFAULT CURRENT_DATE,
    notes text,
    created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Tabela de perfis administrativos (lookup username -> email)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username text NOT NULL UNIQUE,
    email text NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Produtos: leitura pública, escrita autenticada
DO $$
BEGIN
    CREATE POLICY "products_public_read" ON public.products
    FOR SELECT TO public USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "products_auth_write" ON public.products
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Store settings: leitura pública, escrita autenticada
DO $$
BEGIN
    CREATE POLICY "settings_public_read" ON public.store_settings
    FOR SELECT TO public USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "settings_auth_write" ON public.store_settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Sales: somente autenticados
DO $$
BEGIN
    CREATE POLICY "sales_auth_read_write" ON public.sales
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Admin profiles:
-- SELECT público para permitir login por username na tela inicial.
-- Escrita restrita a autenticados.
DO $$
BEGIN
    CREATE POLICY "admin_profiles_public_read" ON public.admin_profiles
    FOR SELECT TO public USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "admin_profiles_auth_write" ON public.admin_profiles
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Storage bucket para imagens
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
    CREATE POLICY "product_images_public_read" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "product_images_auth_insert" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "product_images_auth_update" ON storage.objects
    FOR UPDATE TO authenticated USING (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "product_images_auth_delete" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Seeds iniciais de configurações
INSERT INTO public.store_settings (key, value) VALUES
('store_name', 'Colares Dias Semijoias'),
('store_description', 'Catálogo virtual de acessórios e semijoias com curadoria exclusiva da Colares Dias.'),
('contact_email', 'contato@colaresdias.com.br'),
('whatsapp_number', '+5561982865191'),
('instagram_user', 'colares.dias.semijoias'),
('tiktok_user', 'colares.dias.semijoias'),
('theme_mode', 'light')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Seed de perfil admin inicial (ajuste conforme operação)
INSERT INTO public.admin_profiles (username, email)
VALUES ('admin', 'admin@colaresdias.com.br')
ON CONFLICT (username) DO UPDATE SET email = EXCLUDED.email;

