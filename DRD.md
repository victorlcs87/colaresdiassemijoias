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

### Decisão 010 - Paginação no Admin de Produtos
- **Decisão:** Implementar paginação client-side com navegação por número de página e seletor de itens por página (10/50/100) na tela de produtos do painel administrativo.
- **Motivo:** A tela estava limitada aos primeiros registros, impedindo navegação por todo o catálogo em abas como `Todos` e `Ativos`.
- **Impacto:** Usuário admin consegue navegar por todo o conjunto de produtos com melhor controle de volume exibido e sem perda de contexto.

### Decisão 011 - Relatório mensal padrão e exportação XLSX por filtros aplicados
- **Decisão:** Pré-preencher `Data Início` e `Data Fim` com o mês corrente (1º e último dia), e exportar XLSX com base nos filtros efetivamente aplicados na tabela.
- **Motivo:** Reduzir fricção operacional no fechamento mensal e garantir que o arquivo exportado represente exatamente os dados visualizados no painel.
- **Impacto:** A tela de vendas abre com visão mensal pronta para uso, inclui botão de exportação e endpoint protegido gerando arquivo com abas `Resumo` e `Vendas`.

### Decisão 012 - Padrão empresarial para exportação de relatório XLSX
- **Decisão:** Substituir geração simples por planilha corporativa com `ExcelJS`, incluindo abas `Resumo Executivo`, `Vendas Detalhadas` e `Análise por Produto`, com estilo visual e indicadores.
- **Motivo:** A exportação anterior estava funcional, porém simples demais para uso gerencial e apresentação empresarial.
- **Impacto:** Relatório exportado passa a ter leitura executiva, melhor visual, formatação financeira/data, agrupamentos e análise de performance por produto.

### Decisão 013 - Ajustes de legibilidade em desktop na página de produto
- **Decisão:** Aplicar melhorias de layout apenas na versão web da página de detalhes (`ProductDetailClient`), mantendo o mobile inalterado.
- **Motivo:** Na visualização desktop havia quebras excessivas de texto em breadcrumb, título do produto, CTA de WhatsApp e seção de detalhes, além de pouco espaçamento visual no botão de compra.
- **Impacto:** Textos críticos passam a permanecer em uma linha no desktop quando houver espaço, com quebra apenas em casos necessários, e o botão `Comprar` ganha mais respiro interno para melhor legibilidade.

### Decisão 014 - Breakpoint responsivo para evitar coluna comprimida no desktop menor
- **Decisão:** Alterar a grade principal do detalhe do produto para permanecer em coluna até `lg`, ativando layout de duas colunas apenas em larguras maiores.
- **Motivo:** Em resoluções intermediárias de web (próximas ao breakpoint `md`), a coluna direita ficava estreita e provocava quebra indesejada em título, CTA do WhatsApp e descrição.
- **Impacto:** A leitura fica estável sem quebras artificiais em desktop menor/tablet horizontal, preservando o layout lado a lado apenas quando há espaço real.

### Decisão 015 - Consistência visual entre janela normal e tela cheia no detalhe do produto
- **Decisão:** Reativar layout lado a lado a partir de `md`, mas com balanceamento de colunas e redução de escala tipográfica nessa faixa, além de imagem principal mais quadrada em `md`.
- **Motivo:** Foi solicitado manter o comportamento lado a lado mesmo fora da tela cheia, sem perda de legibilidade e sem aparência comprimida na coluna de informações.
- **Impacto:** A página mantém duas colunas em mais cenários desktop, com proporções e tipografia ajustadas para reduzir quebras e aproximar o visual entre estados de janela.

### Decisão 016 - Padrão visual mobile-like com informações ao lado
- **Decisão:** Antecipar o layout lado a lado para `sm` e manter o padrão visual da referência (imagem destacada e bloco de informações compacto), com breadcrumb exibido apenas em telas grandes.
- **Motivo:** Garantir que, mesmo com navegador não maximizado, o conteúdo não desça para baixo da imagem e preserve a estética desejada.
- **Impacto:** Em larguras desktop intermediárias o detalhe do produto permanece em duas colunas, mantendo aparência próxima da referência e melhor previsibilidade visual.

### Decisão 017 - Réplica estrutural da vitrine de produto da referência mantendo paleta atual
- **Decisão:** Reestruturar `ProductDetailClient` para espelhar a composição da referência (thumbnails verticais, imagem principal ampla, coluna de compra com divisórias, CTA de compra e WhatsApp), preservando as cores/tokens já adotados no projeto.
- **Motivo:** Solicitação explícita de alinhamento visual com a imagem de referência sem alterar a identidade cromática atual.
- **Impacto:** Página de detalhe passa a seguir o mesmo layout-base da referência com melhor hierarquia visual, mantendo consistência de branding existente.

## 5. Pendências Abertas
- Substituir logo temporário por ativo oficial em alta resolução (preferencialmente SVG/PNG transparente).
