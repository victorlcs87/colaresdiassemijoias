alter table public.products add column if not exists image_gallery text[] default '{}'::text[];
