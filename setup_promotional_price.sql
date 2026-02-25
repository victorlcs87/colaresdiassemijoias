-- Adiciona coluna de preço promocional na tabela products
ALTER TABLE products ADD COLUMN IF NOT EXISTS promotional_price numeric;
