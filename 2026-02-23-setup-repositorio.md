# Configuração de Repositório GitHub - Lojinha da Lari

> **Para Antigravity:** SUB-HABILIDADE REQUERIDA: Use superpowers:executing-plans para implementar este plano tarefa por tarefa.

**Objetivo:** Criar um repositório no GitHub para o projeto "lojinha-da-lari", inicializar o git localmente com um README.md básico e realizar o primeiro push.

**Arquitetura:** Inicialização via Git CLI e integração com MCP do GitHub para criação remota.

**Tech Stack:** Git, GitHub MCP.

---

### Task 1: Inicialização Local e Criação de Conteúdo Básico

**Arquivos:**
- Criar: `README.md`

**Passo 1: Inicializar git local**

Executar: `git init` no diretório `/home/victorlcs/repositorios/lojinha-da-lari`
Esperado: Repositório inicializado com sucesso.

**Passo 2: Criar README.md**

Conteúdo:
```markdown
# Lojinha da Lari

Repositório para o sistema da Lojinha da Lari.
```

**Passo 3: Primeiro Commit**

Executar:
```bash
git add README.md
git commit -m "chore: initial commit with README"
```

---

### Task 2: Criação do Repositório Remoto e Push

**Arquivos:**
- N/A (Operação remota)

**Passo 1: Criar repositório no GitHub via MCP**

Chamar ferramenta `create_repository` com:
- `name`: "lojinha-da-lari"
- `description`: "Sistema para a Lojinha da Lari"
- `private`: true (ou conforme escolha do usuário)

**Passo 2: Configurar Remote e Branch**

Executar:
```bash
git remote add origin https://github.com/victorlcs87/lojinha-da-lari.git
git branch -M main
```

**Passo 3: Push para o GitHub**

Executar: `git push -u origin main`
Esperado: Commit enviado com sucesso para a branch main do repositório remoto.
