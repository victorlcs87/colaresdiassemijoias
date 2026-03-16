# Colares Dias Semijoias - Documento de Design e Decisões

Este documento contém o escopo inicial validado antes da construção da aplicação, bem como o registro de decisões tomadas durante a fase de concepção da Colares Dias Semijoias.

## 1. Resumo do Projeto (Understanding Summary)

*   **O que será construído:** Um site de catálogo virtual focado em performance mobile para listar os produtos da Colares Dias Semijoias, exibindo fotos, descrições e preços.
*   **Por que existe:** Para profissionalizar e facilitar a divulgação dos produtos, funcionando como uma vitrine digital.
*   **Para quem:** Inicialmente focado na rede local de contatos e clientes frequentes da marca.
*   **Ação Principal:** Os clientes finalizarão as compras entrando em contato direto (via WhatsApp ou similar) a partir do site.
*   **Restrições Principais:** O custo operacional e de infraestrutura deve ser **zero** neste estágio inicial (utilizando free tiers do Vercel e Supabase).
*   **Não-Objetivos explícitos (O que NÃO vamos fazer agora):**
    *   Carrinho de compras nativo complexo.
    *   Processamento de pagamentos reais embutidos.
    *   Cálculo automático de frete via APIs de Correios/Transportadoras.
    *   Login/cadastro de clientes (apenas administradores farão login).

## 2. Premissas e Suposições (Assumptions)

1.  **Gestão Própria:** A equipe da loja será responsável por cadastrar novos produtos via celular ou desktop.
2.  **Painel Administrativo:** O gerenciamento do estoque, edição de produtos e upload de fotos se dará através de uma rota protegida por senha na própria aplicação (CMS Customizado In-house).
3.  **Foco Visual:** A prioridade inicial do design deve ser estética e facilidade de carregamento das fotos, utilizando uma abordagem Mobile-first.

---

## 3. Log de Decisões (Decision Log)

### Categoria: Arquitetura Frontend & Backend
*   **O que foi decidido:** O sistema utilizará a stack **Next.js + Supabase**.
*   **Alternativas consideradas:**
    *   React puro (Vite) + Supabase (rejeitado pelo SEO inferior e tempo de carregamento inicial do lado do cliente).
    *   Next.js + CMS Externo como Sanity ou Contentful (rejeitado por adicionar complexidade e mais um serviço de terceiros à arquitetura, além da possível curva de aprendizado de uma interface administrativa não feita sob medida).
*   **Por que esta opção foi escolhida (Next.js + Supabase):** Combinação ideal para hospedar nativamente de forma gratuita e escalável na Vercel. Next.js fornece a melhor experiência de leitura SEO-friendly e alta velocidade de entrega para o catálogo. O Supabase consolida banco de dados (PostgreSQL), Auth de admin e Storage das fotos em um único ecossistema, tudo dentro de free tiers conhecidos.

### Categoria: Abordagem do Banco de Dados / Dados Iniciais
*   **O que foi decidido:** Utilizar o PostgreSQL (provido pelo Supabase) como provedor de dados, com um esquema inicial simples contendo, no mínimo, as tabelas `products` e as regras de segurança (Row Level Security - RLS).
*   **Por qual motivo:** Supabase é o equivalente "Open Source" do Firebase e utilizar o Postgres nos prepara solidamente para criar relacionamentos (categorias -> produtos, variação de cores/tamanhos no futuro) sem precisarmos refazer a arquitetura de dados posteriormente.

### Categoria: Interface de Administração (CMS)
*   **O que foi decidido:** Construir uma ou duas páginas protegidas dentro do Next.js (ex: `/admin/produtos`) ao invés de usar uma dashboard de CMS pronta de prateleira (headless CMS).
*   **Por qual motivo:** Apesar do esforço inicial de codificar formulários e uploads ser levemente maior, o painel sob medida é adaptado à necessidade da loja. Menos telas complexas significam menos tempo operacional para cadastrar novos produtos no catálogo.
