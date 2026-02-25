-- 1. Create store settings table
CREATE TABLE IF NOT EXISTS public.store_settings (
    key text PRIMARY KEY,
    value text NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS policies for store_settings
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    CREATE POLICY "Allow public read access to store settings" ON public.store_settings FOR SELECT TO public USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
    CREATE POLICY "Allow admin write access to store settings" ON public.store_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 2. Add columns to products table if missing
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sizes jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT 1;

-- 3. Create bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Storage Bucket Policies for 'product-images'
DO $$ 
BEGIN
    CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
    CREATE POLICY "Auth Insert Access" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
    CREATE POLICY "Auth Update Access" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ 
BEGIN
    CREATE POLICY "Auth Delete Access" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
