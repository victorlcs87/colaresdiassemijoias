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

-- Tabela de feedbacks com moderação
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
    customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 2 AND 80),
    comment text NOT NULL CHECK (char_length(comment) BETWEEN 10 AND 800),
    rating smallint NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    moderated_at timestamptz,
    moderated_by text
);

CREATE INDEX IF NOT EXISTS idx_feedbacks_status_created_at
ON public.feedbacks(status, created_at DESC);

DROP TRIGGER IF EXISTS trg_feedbacks_updated_at ON public.feedbacks;
CREATE TRIGGER trg_feedbacks_updated_at
BEFORE UPDATE ON public.feedbacks
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Helpers de autorização
CREATE OR REPLACE FUNCTION public.current_user_email()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(auth.jwt() ->> 'email', '');
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_profiles ap
    WHERE lower(ap.email) = lower(public.current_user_email())
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Produtos: leitura pública somente itens disponíveis e escrita/admin somente administradores
DO $$
BEGIN
    CREATE POLICY "products_public_read_available" ON public.products
    FOR SELECT TO public USING (is_available = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "products_admin_read_all" ON public.products
    FOR SELECT TO authenticated USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "products_admin_insert" ON public.products
    FOR INSERT TO authenticated WITH CHECK (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "products_admin_update" ON public.products
    FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "products_admin_delete" ON public.products
    FOR DELETE TO authenticated USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Store settings: leitura pública e escrita apenas admin
DO $$
BEGIN
    CREATE POLICY "settings_public_read_all" ON public.store_settings
    FOR SELECT TO public USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "settings_admin_write" ON public.store_settings
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Sales: somente administradores
DO $$
BEGIN
    CREATE POLICY "sales_admin_read_write" ON public.sales
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Feedbacks: público envia (pending) e visualiza apenas aprovados; admin modera tudo
DO $$
BEGIN
    CREATE POLICY "feedbacks_public_read_approved" ON public.feedbacks
    FOR SELECT TO public USING (status = 'approved');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "feedbacks_public_insert_pending" ON public.feedbacks
    FOR INSERT TO public WITH CHECK (status = 'pending');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "feedbacks_admin_read_all" ON public.feedbacks
    FOR SELECT TO authenticated USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "feedbacks_admin_insert" ON public.feedbacks
    FOR INSERT TO authenticated WITH CHECK (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "feedbacks_admin_update" ON public.feedbacks
    FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "feedbacks_admin_delete" ON public.feedbacks
    FOR DELETE TO authenticated USING (public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Admin profiles:
-- sem leitura pública para evitar enumeração de usuários.
-- leitura autenticada apenas do próprio registro.
DO $$
BEGIN
    CREATE POLICY "admin_profiles_auth_self_read" ON public.admin_profiles
    FOR SELECT TO authenticated USING (lower(email) = lower(public.current_user_email()));
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
    CREATE POLICY "product_images_admin_insert" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "product_images_admin_update" ON storage.objects
    FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.is_admin())
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    CREATE POLICY "product_images_admin_delete" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.is_admin());
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
