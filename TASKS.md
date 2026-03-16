# Plano de Implementação: Colares Dias Semijoias

Status atual: **Fase 17 - Ajuste Visual da Página de Produto (Referência)**

## Histórico de Tarefas (Progresso Incremental)

### Fase 1: Setup e Arquitetura Base
- [x] Configurar projeto Next.js (App Router, TailwindCSS, TypeScript).
- [x] Instalar dependências iniciais (`@supabase/supabase-js`, `lucide-react`).
- [x] Configurar ESLint e Prettier (padrão do Next.js criado).
- [x] Definir documento de design (`DESIGN.md`).
- [x] Configurar conexão com o Supabase (criar `src/lib/supabase.ts` e varíaveis de ambiente locais).
- [x] Criar projeto remoto no Supabase.
- [x] Configurar schema de banco de dados no Supabase e gerar dados de teste.

### Fase 2: Componentes do Catálogo (UI/UX Pública)
- [x] Desenvolver Componente de Cabeçalho/Header.
- [x] Desenvolver Componente do Card de Produto.
- [x] Desenvolver Componente da Grade/Lista de Produtos.
- [x] Consumir produtos mock/teste no layout principal.
- [x] Adicionar botão "Tenho Interesse" e linkar com número do WhatsApp.

### Fase 3: Área Administrativa (CMS customizado)
- [x] Instalar `@supabase/ssr` e criar Supabase clients SSR.
- [x] Configurar rotas protegidas (Middleware).
- [x] Criar tela de Login da administração.
- [x] Desenvolver tela Painel/Dashboard de administração.
- [x] Desenvolver formulário de cadastro de novos produtos.
- [x] Desenvolver função de edição e deleção de produtos existentes.
- [x] Criar página de Configurações (UI).
- [x] Implementar persistência real das Configurações no Banco de Dados.

### Fase 4: Expansão de Funcionalidades (Concluída)
#### 4.1 Upload de Imagens (Supabase Storage)
- [x] Criar Bucket `product-images` no Supabase Storage.
- [x] Implementar componente de Upload no formulário de produto (Novo/Editar).
- [x] Integrar upload com a Server Action de produto.

#### 4.2 Filtros, Categorias e Busca
- [x] Adicionar barra de busca no Catálogo.
- [x] Implementar sistema de categorias dinâmicas.
- [x] Criar filtros de preço e disponibilidade.

#### 4.3 Carrinho de Compras & Checkout WhatsApp
- [x] Criar Zustand store para gerenciar o carrinho.
- [x] Adicionar botão "Adicionar ao Carrinho" nos cards.
- [x] Implementar Drawer/Modal de Carrinho.
- [x] Desenvolver gerador de mensagem consolidada para WhatsApp.

#### 4.4 Configurações Dinâmicas (Persistência)
- [x] Criar tabela `store_config` no banco de dados.
- [x] Implementar GET/PATCH para as configurações.
- [x] Refletir configurações (nome, links, tema) no Frontend público e administrativo.

### Fase 5: Ajustes Finais e Melhorias Avançadas (Concluída)
- [x] Implementar a seção de "Estatísticas" no Dashboard com gráficos reais de produtos ativos e preços.
- [x] Adicionar múltiplas fotos por produto (Galeria).
- [x] Melhorar o SEO e meta tags dinâmicas baseadas nas configurações da loja.
- [x] Preparar script SQL para a alteração da galeria (`setup_gallery.sql`).

### Fase 6: QA e Finalização
- [x] Executar bateria de testes automatizados E2E (Playwright) para todas as novas funções.
- [ ] Validar responsividade Mobile.
- [ ] Deploy final na Vercel.

### Fase 7: Condição do Produto (Novo/Seminovo)
- [x] Criar script SQL para adicionar campo `condition` à tabela `products`.
- [x] Atualizar tipagens TypeScript em `src/lib/types.ts`.
- [x] Modificar controllers/actions em `src/actions/product.ts` para capturar a condição do form.
- [x] Adicionar campo ao formulário de cadastro em `src/app/admin/products/new/page.tsx`.
- [x] Adicionar campo ao formulário de edição em `src/app/admin/products/edit/[id]/page.tsx`.
- [x] Melhorar UI do `ProductCard.tsx` para apresentar a condição.
- [x] Mostrar a condição no `ProductDetailClient.tsx` (informação visível para o comprador).

### Fase 8: Migração para Colares Dias Semijoias
- [x] Rebranding completo de textos e identidade visual para Colares Dias Semijoias.
- [x] Atualizar paleta global (tokens, Tailwind e componentes) com base no novo catálogo.
- [x] Gerar ativo temporário de logo em `public/brand/logo-colares-dias.png` e aplicar no site.
- [x] Atualizar ícones PWA/SEO (`favicon`, `icon`, `apple`, `opengraph`) com a nova identidade.
- [x] Extrair 87 imagens do PDF e publicar em `public/catalogo/produtos`.
- [x] Criar seed de catálogo em `supabase/seed_colares_catalog.sql`.
- [x] Criar bootstrap do novo banco em `supabase/bootstrap_colares_dias.sql`.
- [x] Padronizar leitura de settings (`snake_case` com fallback legado).
- [x] Executar validação final de lint/build após instalação das dependências locais.

### Fase 9: Estabilização Técnica e Deploy
- [x] Corrigir mismatch de hidratação no `CartDrawer` removendo branch SSR/Client que gerava árvore diferente.
- [x] Estabilizar `mobile-test.js` no cenário de fechamento do carrinho antes de abrir menu drawer.
- [x] Executar nova rodada de testes locais (`lint`, `build`, smoke e mobile suite).
- [x] Gerar guia completo de configuração Supabase + Vercel em `PASSO_A_PASSO_SUPABASE_VERCEL.md`.

### Fase 10: Paginação na listagem de produtos (Admin)
- [x] Corrigir limitação de listagem que exibia apenas os primeiros itens.
- [x] Implementar paginação completa por abas (Todos, Ativos, Rascunhos) com navegação por páginas.
- [x] Implementar seletor de quantidade por página (10, 50, 100).
- [x] Mostrar intervalo atual e total de registros exibidos.

### Fase 11: Relatório de Vendas (Padrão Mensal + Exportação XLS)
- [x] Definir período padrão com primeiro e último dia do mês corrente na tela de vendas.
- [x] Aplicar filtro inicial automático do mês corrente ao carregar a página.
- [x] Separar estado de filtros digitados vs filtros aplicados para consistência da exportação.
- [x] Implementar botão de exportação XLSX respeitando os filtros aplicados.
- [x] Criar endpoint protegido para geração do arquivo XLSX com abas `Resumo` e `Vendas`.

### Fase 12: Relatório XLS Profissional (Executivo)
- [x] Migrar geração de XLS de `xlsx` para `ExcelJS` para suportar layout empresarial.
- [x] Criar aba `Resumo Executivo` com KPIs visuais, período, indicadores complementares e top produtos.
- [x] Criar aba `Vendas Detalhadas` com cabeçalho estilizado, auto-filtro, zebra rows e formatação monetária/data.
- [x] Criar aba `Análise por Produto` com agregação de quantidade, receita, custo, lucro e margem.
- [x] Aplicar identidade visual da marca e inclusão do logo no relatório (quando disponível no ambiente).

### Fase 13: Refinos de Layout Desktop na Página de Produto
- [x] Manter breadcrumb de categoria em linha única na versão web (quando houver espaço).
- [x] Ajustar título do produto para priorizar linha única no desktop, quebrando apenas quando necessário.
- [x] Aumentar área interna do botão `Comprar` no desktop para melhorar respiro visual entre ícone e texto.
- [x] Garantir CTA do WhatsApp em linha única no desktop.
- [x] Garantir título `Detalhes e Especificações` em linha única no desktop e flexibilizar quebra do conteúdo apenas quando necessário.

### Fase 14: Correção de Quebras em Desktop Intermediário (Detalhe do Produto)
- [x] Ajustar breakpoint da seção principal para manter layout em coluna até `lg`.
- [x] Redistribuir proporção das colunas para `52%/48%` em telas largas.
- [x] Restringir breadcrumb desktop para `lg+`, evitando compressão de conteúdo em larguras intermediárias.

### Fase 15: Uniformização entre Janela Normal e Tela Cheia (Detalhe do Produto)
- [x] Reativar layout lado a lado a partir de `md` para comportamento consistente no desktop.
- [x] Ajustar proporção das colunas em `md` para `50%/50%` com `min-w-0` na coluna de informações.
- [x] Ajustar aspecto da imagem principal para `aspect-square` em `md` e manter `4/5` em `lg+`.
- [x] Reduzir escala tipográfica em `md` para diminuir quebras no título e preço.

### Fase 16: Padrão de Referência com Informações ao Lado
- [x] Antecipar layout de duas colunas para `sm` no detalhe do produto.
- [x] Manter padrão visual da imagem de referência com proporção principal consistente em larguras intermediárias.
- [x] Ocultar breadcrumb abaixo de `lg` para reduzir ruído visual e liberar espaço útil da coluna de informações.
- [x] Ajustar escala de tipografia/CTA em `sm` para reduzir quebra e manter legibilidade no layout lado a lado.

### Fase 17: Réplica de Layout da Página de Produto mantendo paleta atual
- [x] Reestruturar composição para miniaturas verticais + imagem principal ampla + coluna de informações fixa.
- [x] Ajustar bloco de informações para sequência da referência (breadcrumb, título, preço, cor, ml, quantidade, compra e WhatsApp).
- [x] Simplificar a página removendo seção inferior de recomendações para manter foco no layout da referência.
- [x] Preservar o estilo de cores/tokens atual do projeto durante toda a adaptação visual.
- [x] Validar build/lint após refatoração do `ProductDetailClient`.

### Fase 18: Correção Pós-Refinamento da Página de Produto
- [x] Corrigir visibilidade da imagem principal no desktop ajustando modo de encaixe e contraste de fundo.
- [x] Reduzir significativamente a tipografia de título, preço, variações e descrição em mobile e desktop.
- [x] Validar build/lint após ajuste de escala tipográfica e renderização da imagem.

### Fase 19: Ajuste de Robustez da Imagem no Desktop
- [x] Definir altura mínima explícita no container da imagem principal para evitar colapso visual em desktop.
- [x] Ajustar renderização para `object-contain` com padding e sombra para melhorar legibilidade do produto em fundos claros.
- [x] Validar build/lint após ajuste estrutural de mídia.
