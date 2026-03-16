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

### Decisão 018 - Correção de visibilidade da imagem desktop e redução forte de tipografia
- **Decisão:** Ajustar renderização da imagem principal para `object-cover` com fundo neutro e reduzir significativamente a escala tipográfica do detalhe do produto em mobile e desktop.
- **Motivo:** Foi reportado que, no desktop, a imagem não estava visível e que os textos estavam desproporcionais nas duas versões.
- **Impacto:** Imagem volta a ter leitura consistente no desktop e a densidade visual da página fica mais equilibrada em todos os breakpoints.

### Decisão 019 - Estabilização de exibição da imagem em desktop maximizado
- **Decisão:** Aplicar `xl:min-h` no container da mídia principal e usar `object-contain` com padding por breakpoint.
- **Motivo:** No navegador maximizado a imagem deixava de ficar perceptível, enquanto em janelas menores aparecia normalmente.
- **Impacto:** A imagem mantém visibilidade consistente em telas largas, com enquadramento previsível.

### Decisão 020 - Remoção de moldura visual na mídia principal
- **Decisão:** Remover padding interno e retornar para renderização `object-cover` na imagem principal, preservando apenas os cantos arredondados do container.
- **Motivo:** A abordagem com `object-contain` + padding criou uma borda visual indesejada em torno da foto.
- **Impacto:** A imagem volta ao visual original, ocupando todo o card com acabamento arredondado sem “quadro” interno.

### Decisão 021 - Login admin server-side por username sem exposição de e-mail
- **Decisão:** Migrar autenticação administrativa para ação server-side com lookup de `username -> email` via Service Role no backend, mantendo login por usuário no frontend.
- **Motivo:** Eliminar exposição pública da tabela `admin_profiles` e reduzir risco de enumeração de contas administrativas.
- **Impacto:** O cliente não consulta mais `admin_profiles` diretamente; o backend centraliza validação e emissão de sessão.

### Decisão 022 - Guard administrativo unificado
- **Decisão:** Criar guard compartilhado de autorização admin para Server Actions e rotas API sensíveis.
- **Motivo:** Havia inconsistência de checagem de permissão entre fluxos (`products`, `sales`, `settings`, `export`), com risco de bypass.
- **Impacto:** Todas as operações críticas passam a validar sessão + vínculo administrativo com contrato de erro padronizado.

### Decisão 023 - Hardening de RLS com menor privilégio
- **Decisão:** Introduzir função `is_admin()` e reescrever políticas para permitir escrita apenas a administradores, mantendo leitura pública somente no que é necessário ao catálogo.
- **Motivo:** As políticas antigas permitiam escrita para qualquer usuário autenticado e leitura pública indevida em `admin_profiles`.
- **Impacto:** Redução significativa da superfície de ataque e alinhamento com princípio de menor privilégio.

### Decisão 024 - Segurança operacional em cron e centralização de contatos públicos
- **Decisão:** Tornar `CRON_SECRET` obrigatório na rota de keep-alive e centralizar contatos (WhatsApp/e-mail/Instagram) por settings.
- **Motivo:** Evitar disparo não autorizado do endpoint de cron e remover hardcodes sensíveis espalhados na UI.
- **Impacto:** Endpoints administrativos ficam mais previsíveis/seguros e dados de contato passam a ser gerenciáveis por configuração.

### Decisão 025 - Repositórios por domínio para acesso Supabase
- **Decisão:** Consolidar acesso a dados em classes de repositório (`ProductRepository`, `SalesRepository`, `StoreSettingsRepository`) em vez de consultas diretas nas Server Actions.
- **Motivo:** Reduzir duplicação, melhorar rastreabilidade de consultas e facilitar testes unitários por camada.
- **Impacto:** A camada de ação passa a orquestrar fluxos; o acesso a banco fica centralizado e reutilizável.

### Decisão 026 - Services como camada de caso de uso
- **Decisão:** Encapsular regras de negócio em services (`ProductService`, `SalesService`, `StoreSettingsService`) para operações administrativas.
- **Motivo:** Evitar lógica de domínio acoplada ao transporte (Server Actions), melhorando manutenção e evolução.
- **Impacto:** Fluxos críticos (criar/editar/excluir/duplicar produto, registrar/desfazer venda, atualizar settings) passam a ter ponto único de regra.

### Decisão 027 - DTO + validação explícita para payloads administrativos
- **Decisão:** Introduzir validadores de entrada para produto, venda e configurações antes de persistência.
- **Motivo:** Reduzir inconsistências de dados e impedir gravações inválidas por entradas malformadas.
- **Impacto:** Erros de entrada retornam contrato consistente (`ActionResult`) e regras de sanitização ficam centralizadas.

### Decisão 028 - Ajuste de fronteira de domínio (duplicação de produto)
- **Decisão:** Mover o caso de uso de duplicar produto para `ProductService`.
- **Motivo:** A duplicação pertence ao contexto de catálogo/produto e não ao contexto de vendas.
- **Impacto:** Redução de acoplamento entre domínios e arquitetura mais coerente para futuras evoluções.

### Decisão 029 - Substituição de confirmações nativas por diálogo acessível
- **Decisão:** Substituir `window.alert`/`window.confirm` dos fluxos críticos administrativos por componente de diálogo com semântica de acessibilidade.
- **Motivo:** Alertas nativos têm UX inconsistente, bloqueiam fluxo e dificultam navegação assistiva/teclado.
- **Impacto:** Ações destrutivas (excluir, desfazer venda) passam por confirmação padronizada com foco controlado e melhor previsibilidade.

### Decisão 030 - Feedback de ações em `aria-live`
- **Decisão:** Padronizar feedback de sucesso/erro nas telas administrativas usando mensagens em tela com `aria-live`.
- **Motivo:** Garantir retorno imediato sem modais bloqueantes e com leitura por tecnologias assistivas.
- **Impacto:** Operações de produto/venda/exportação ficam mais claras para usuário e mais acessíveis.

### Decisão 031 - Correção semântica de card de produto
- **Decisão:** Remover nesting de botão dentro de link no `ProductCard`, separando link de detalhe e ação de carrinho.
- **Motivo:** Interação aninhada é inválida em HTML e pode causar comportamento inconsistente em teclado/leitores de tela.
- **Impacto:** Melhor robustez de navegação, eventos de clique mais previsíveis e menor risco de regressão de interação.

### Decisão 032 - Base de acessibilidade global e refinos mobile
- **Decisão:** Adicionar estilos globais de `:focus-visible`, suporte a `prefers-reduced-motion` e melhoria de filtros mobile no catálogo.
- **Motivo:** Garantir consistência mínima de usabilidade acessível em toda a aplicação pública/admin.
- **Impacto:** Navegação por teclado mais visível, menor desconforto para usuários sensíveis a animação e experiência mobile mais eficiente.

### Decisão 033 - Correção de hidratação no `CartDrawer`
- **Decisão:** Introduzir controle explícito de montagem client-side no `CartDrawer` antes de renderizar portal.
- **Motivo:** Havia mismatch SSR/CSR em produção local que comprometia interações de carrinho durante testes DOM.
- **Impacto:** Renderização inicial consistente entre servidor e cliente, com menor risco de eventos perdidos no carrinho.

### Decisão 034 - Suíte DOM full-stack como gate obrigatório
- **Decisão:** Criar suíte E2E DOM única (`scripts/dom-e2e-full.mjs`) cobrindo fluxos público e admin críticos.
- **Motivo:** Garantir regressão zero nos fluxos principais após hardening + refatoração + UX.
- **Impacto:** Validação repetível de home, catálogo, detalhe, carrinho, CTA WhatsApp, login admin, CRUD de produto, venda/desfazer e settings.

### Decisão 035 - Aplicação de migration via Supabase Management API
- **Decisão:** Aplicar migration pendente usando endpoint de query do Management API quando o Supabase CLI não estiver disponível no ambiente local.
- **Motivo:** O ambiente não possuía `supabase` CLI instalado, mas havia `SUPABASE_ACCESS_TOKEN` válido.
- **Impacto:** Migration `20260316132000_hardening_rls_admin.sql` aplicada com sucesso e versão registrada em `supabase_migrations.schema_migrations`.

### Decisão 036 - Feedback público com moderação obrigatória
- **Decisão:** Implementar módulo de feedback com envio público para status `pending`, moderação exclusiva por admin (`approved`/`rejected`) e exibição pública apenas de aprovados.
- **Motivo:** Permitir prova social real sem risco de publicação automática de conteúdo inadequado.
- **Impacto:** Home e página de produto passam a consumir feedbacks aprovados via rodízio (máximo 3 cards), enquanto o admin ganha fluxo dedicado de moderação.

## 5. Pendências Abertas
- Substituir logo temporário por ativo oficial em alta resolução (preferencialmente SVG/PNG transparente).
