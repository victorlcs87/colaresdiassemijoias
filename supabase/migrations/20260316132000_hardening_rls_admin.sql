-- Hardening de RLS com papel administrativo explícito

BEGIN;

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

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_public_read" ON public.products;
DROP POLICY IF EXISTS "products_auth_write" ON public.products;
DROP POLICY IF EXISTS "products_public_read_available" ON public.products;
DROP POLICY IF EXISTS "products_admin_read_all" ON public.products;
DROP POLICY IF EXISTS "products_admin_insert" ON public.products;
DROP POLICY IF EXISTS "products_admin_update" ON public.products;
DROP POLICY IF EXISTS "products_admin_delete" ON public.products;

CREATE POLICY "products_public_read_available" ON public.products
FOR SELECT TO public
USING (is_available = true);

CREATE POLICY "products_admin_read_all" ON public.products
FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY "products_admin_insert" ON public.products
FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "products_admin_update" ON public.products
FOR UPDATE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "products_admin_delete" ON public.products
FOR DELETE TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "settings_public_read" ON public.store_settings;
DROP POLICY IF EXISTS "settings_auth_write" ON public.store_settings;
DROP POLICY IF EXISTS "settings_public_read_all" ON public.store_settings;
DROP POLICY IF EXISTS "settings_admin_write" ON public.store_settings;

CREATE POLICY "settings_public_read_all" ON public.store_settings
FOR SELECT TO public
USING (true);

CREATE POLICY "settings_admin_write" ON public.store_settings
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "sales_auth_read_write" ON public.sales;
DROP POLICY IF EXISTS "sales_admin_read_write" ON public.sales;

CREATE POLICY "sales_admin_read_write" ON public.sales
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_profiles_public_read" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_auth_write" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_auth_self_read" ON public.admin_profiles;

CREATE POLICY "admin_profiles_auth_self_read" ON public.admin_profiles
FOR SELECT TO authenticated
USING (lower(email) = lower(public.current_user_email()));

DROP POLICY IF EXISTS "product_images_public_read" ON storage.objects;
DROP POLICY IF EXISTS "product_images_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "product_images_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "product_images_auth_delete" ON storage.objects;
DROP POLICY IF EXISTS "product_images_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "product_images_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "product_images_admin_delete" ON storage.objects;

CREATE POLICY "product_images_public_read" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_insert" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "product_images_admin_update" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'product-images' AND public.is_admin())
WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "product_images_admin_delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'product-images' AND public.is_admin());

COMMIT;

