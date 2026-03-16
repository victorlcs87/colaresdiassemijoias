# Passo a Passo: Configurar Supabase + Vercel

## 1. Pré-requisitos
- Conta no Supabase.
- Conta no Vercel.
- Repositório já conectado ao Git.
- Node.js 20+ e npm instalados localmente.

## 2. Criar o novo projeto no Supabase
1. Acesse o dashboard do Supabase.
2. Clique em **New project**.
3. Defina:
   - Nome: `colares-dias-semijoias` (ou similar).
   - Senha do banco.
   - Região.
4. Aguarde a finalização do provisionamento.

## 3. Aplicar schema e seed do catálogo
1. No Supabase, abra **SQL Editor**.
2. Execute primeiro o arquivo:
   - `supabase/bootstrap_colares_dias.sql`
3. Execute depois o arquivo:
   - `supabase/seed_colares_catalog.sql`
4. Valide:
   - `products` com 87 itens.
   - `store_settings` com dados iniciais.
   - Bucket `product-images` criado.

Query de validação rápida:

```sql
select count(*) as total_produtos from public.products;
```

## 4. Criar usuário admin no Auth
1. Abra **Authentication > Users** no Supabase.
2. Crie um usuário com e-mail/senha (ex.: `admin@colaresdias.com.br`).
3. Garanta que existe o mapeamento em `admin_profiles`:

```sql
insert into public.admin_profiles (username, email)
values ('admin', 'admin@colaresdias.com.br')
on conflict (username) do update set email = excluded.email;
```

## 5. Configurar variáveis locais (`.env.local`)
Crie um arquivo `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY
CRON_SECRET=um-segredo-forte-opcional
```

Importante:
- `NEXT_PUBLIC_*` é embutido no build. Sempre rode novo build após alterar esses valores.

## 6. Validar localmente
1. Instalar dependências:
   - `npm install`
2. Rodar lint:
   - `npm run lint`
3. Build de produção:
   - `npm run build`
4. Subir app:
   - `npm run start`
5. (Opcional) Teste mobile:
   - `node mobile-test.js`

## 7. Configurar projeto na Vercel
1. No Vercel, clique em **Add New > Project**.
2. Importe este repositório.
3. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `CRON_SECRET` (recomendado)
4. Faça o primeiro deploy.

## 8. Configurar cron no Vercel
O projeto já possui cron em `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "0 0 * * *"
    }
  ]
}
```

Após deploy:
1. Verifique no painel da Vercel se o cron foi criado.
2. Valide a rota `/api/cron/keep-alive` em produção.

## 9. Checklist final de produção
- Home e catálogo carregando sem erro.
- Login admin funcionando.
- Upload de imagem no bucket `product-images`.
- `products` com 87 registros.
- Logo/paleta corretos em desktop e mobile.
