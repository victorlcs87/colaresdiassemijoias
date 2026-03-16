-- Tabela para salvar configurações globais da loja
create table if not exists public.store_settings (
    id uuid default gen_random_uuid() primary key,
    key text unique not null,
    value text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.store_settings enable row level security;

-- Políticas de RLS
create policy "Configurações podem ser lidas por todos"
on public.store_settings for select
using ( true );

create policy "Apenas admins autenticados editam configurações"
on public.store_settings for all
using ( auth.role() = 'authenticated' );

-- Dados Iniciais
insert into public.store_settings (key, value) values
('store_name', 'Colares Dias Semijoias'),
('store_description', 'Catálogo virtual de acessórios e semijoias com curadoria exclusiva da Colares Dias.'),
('contact_email', 'contato@colaresdias.com.br'),
('whatsapp_number', '+5561982865191'),
('instagram_user', 'colares.dias.semijoias'),
('tiktok_user', 'colares.dias.semijoias'),
('theme_mode', 'light')
on conflict (key) do update set value = excluded.value;
