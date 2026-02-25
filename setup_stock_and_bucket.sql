-- 1. Adicionar coluna de quantidade em estoque
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT 1;

-- 2. Criar bucket de armazenamento de imagens, se não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Configurar políticas de segurança (RLS) para o bucket de storage
-- Garante acesso público para leitura
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- Garante que apenas usuários logados (admin) possam inserir imagens
CREATE POLICY "Auth Insert Access" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-images');

-- Garante que apenas usuários logados (admin) possam atualizar imagens
CREATE POLICY "Auth Update Access" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'product-images');

-- Garante que apenas usuários logados (admin) possam deletar imagens
CREATE POLICY "Auth Delete Access" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'product-images');
