# DRD - Documento de Requisitos e Decisões

## 1. Objetivo Atual
Migrar integralmente o projeto para a marca **Colares Dias Semijoias**, incluindo identidade visual, catálogo de produtos do PDF e preparação de um novo banco de dados Supabase.

## 2. Requisitos Funcionais
- O site deve refletir o novo branding em conteúdo, SEO, logo e paleta.
- O catálogo inicial deve ser carregado a partir do PDF fornecido.
- A administração deve manter o fluxo atual de autenticação por `username` + `email` no Supabase Auth.
- O novo banco deve ser provisionável do zero com scripts SQL versionados no repositório.

## 3. Requisitos Não Funcionais
- Manter responsividade mobile/desktop.
- Preservar a estrutura Next.js + Supabase existente.
- Garantir rastreabilidade de mudanças em documentos incrementais (`TASKS.md` e este DRD).

## 4. Log de Decisões

### Decisão 001 - Estratégia de UI
- **Decisão:** Aplicar rebranding completo com abordagem `UI/UX Pro Max`.
- **Motivo:** Garantir mudança visual forte e coerente com a nova marca.
- **Impacto:** Atualização de tokens globais, componentes públicos e administrativos.

### Decisão 002 - Fonte do Logo
- **Decisão:** Usar captura atual como ativo temporário oficial (`public/brand/logo-colares-dias.png`).
- **Motivo:** Não havia arquivo vetorial/PNG oficial disponível no repositório.
- **Impacto:** Logo aplicado em header, mobile, admin e ícones; poderá ser substituído sem alterar estrutura.

### Decisão 003 - Catálogo Inicial
- **Decisão:** Gerar carga automática a partir do PDF em `supabase/seed_colares_catalog.sql`.
- **Motivo:** Evitar cadastro manual e garantir aderência ao catálogo fornecido.
- **Impacto:** 87 entradas no seed, sendo 84 itens precificados e 3 imagens editoriais marcadas como indisponíveis.

### Decisão 004 - Banco Novo Supabase
- **Decisão:** Criar script completo de bootstrap em `supabase/bootstrap_colares_dias.sql`.
- **Motivo:** Provisionamento reproduzível do zero (tabelas, RLS, storage, seeds de settings e admin).
- **Impacto:** Ambiente novo pode ser criado sem dependência dos scripts antigos fragmentados.

### Decisão 005 - Compatibilidade de Settings
- **Decisão:** Padronizar leitura por `snake_case` com fallback para chaves legadas.
- **Motivo:** Evitar regressão em telas que já consumiam chaves antigas em camelCase.
- **Impacto:** Metadata e páginas continuam funcionando durante transição de dados.

### Decisão 006 - Build resiliente sem .env local
- **Decisão:** Mover a criação do client Supabase da rota `api/cron/keep-alive` para dentro do handler `GET`, com guarda explícita de variáveis de ambiente.
- **Motivo:** Evitar falha de build em ambientes sem `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` configuradas.
- **Impacto:** Build local e CI passam sem exigir credenciais reais; a rota retorna `503` quando variáveis não estão presentes.

### Decisão 007 - Correção de hidratação no carrinho
- **Decisão:** Remover retorno condicional SSR em `CartDrawer` baseado em `typeof window`.
- **Motivo:** O branch server/client gerava HTML diferente entre SSR e client, causando erro de hidratação (React 418).
- **Impacto:** Eliminação do mismatch de hidratação nas páginas públicas.

### Decisão 008 - Estabilização da suíte mobile
- **Decisão:** Ajustar `mobile-test.js` para reduzir flakiness por animação/interceptação de clique no fechamento do drawer.
- **Motivo:** O passo de abertura do menu falhava de forma intermitente após interação com o carrinho.
- **Impacto:** Teste mobile mais consistente para validação local/CI.

### Decisão 009 - Padronização de onboarding de infraestrutura
- **Decisão:** Criar documento único com passo a passo de setup Supabase + Vercel.
- **Motivo:** Reduzir risco operacional de configuração e facilitar handoff.
- **Impacto:** Processo de deploy e provisionamento reproduzível para novas máquinas/ambientes.

## 5. Pendências Abertas
- Substituir logo temporário por ativo oficial em alta resolução (preferencialmente SVG/PNG transparente).
