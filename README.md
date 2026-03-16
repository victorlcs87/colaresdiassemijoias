# Colares Dias Semijoias

Repositório para o sistema da Colares Dias Semijoias.

## Guia de implantação

Consulte o passo a passo completo de configuração do Supabase e da Vercel em:

- `PASSO_A_PASSO_SUPABASE_VERCEL.md`

## Validação Operacional

Antes de qualquer release, execute:

```bash
npm run lint
npm run build
npm audit --omit=dev
```

Para validação DOM ponta a ponta (público + admin), com o servidor local em execução:

```bash
npm run test:dom
```

Observação:
- O teste DOM usa credenciais definidas em `.env.local` (`login` e `password`).

## Migrações Supabase

As migrações SQL ficam em `supabase/migrations`.

Em ambientes onde o Supabase CLI não estiver disponível, é possível aplicar via API de gerenciamento (token `SUPABASE_ACCESS_TOKEN`), executando os SQL pendentes e registrando versão em `supabase_migrations.schema_migrations`.

## Rollback

Estratégia recomendada por módulo:

1. `auth`: reverter commit da onda de autenticação e reaplicar política anterior.
2. `products/sales/settings`: reverter commit do módulo afetado e validar CRUD completo.
3. `ui`: reverter commit de UX/UI e rodar novamente `lint`, `build` e `test:dom`.
4. `database`: aplicar migration corretiva incremental (evitar rollback destrutivo).
