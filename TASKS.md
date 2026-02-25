# Plano de Implementação: Lojinha da Lari

Status atual: **Fase 6 - QA e Finalização**

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
