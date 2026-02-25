-- Criar bucket para imagens de produtos
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Política para permitir que qualquer pessoa veja as imagens
create policy "Imagens de produtos são públicas"
on storage.objects for select
using ( bucket_id = 'product-images' );

-- Política para permitir que Admins autenticados façam upload
create policy "Admins podem fazer upload de imagens"
on storage.objects for insert
with check (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Política para permitir que Admins deletem imagens
create policy "Admins podem deletar imagens"
on storage.objects for delete
using (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
