-- Adicionar coluna de tamanhos customizáveis (JSONB)
-- Formato: {"label": "Tamanho", "options": ["P", "M", "G", "GG"]}
-- Ou: {"label": "Volume", "options": ["250ml", "500ml", "1L"]}
alter table public.products add column if not exists sizes jsonb default null;

-- Adicionar coluna de categoria para agrupar produtos relacionados
alter table public.products add column if not exists category text default null;
