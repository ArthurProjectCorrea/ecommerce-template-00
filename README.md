# 🚀 Next.js Template

![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-2.98.0-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

Um template robusto e pré-configurado para o desenvolvimento de aplicações modernas com Next.js e Supabase, focado em produtividade, qualidade de código e automação.

---

## 🛠️ Primeiros Passos

### 1. Inicialização do Projeto

Se você usou **Use this template** ou clonou o repositório:

```bash
# Clone e entre na pasta
git clone <url-do-seu-repositorio>
cd <nome-do-projeto>

# Instale as dependências
npm install

# Inicialize o template (opcional para limpar exemplos)
npm run init
```

### 2. Configuração do Supabase

Este projeto utiliza o Supabase para autenticação e banco de dados.

1. Crie um projeto no [Supabase Dashboard](https://supabase.com).
2. Vá em **Project Settings > API** para obter suas credenciais.
3. Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

### 3. Rodando o Projeto

```bash
npm run dev
```

---

## ✨ Funcionalidades de Autenticação (Implementadas)

O sistema de autenticação foi construído utilizando `@supabase/ssr` para garantir segurança e persistência de sessão no Next.js App Router.

- **Cadastro (Signup)**: Criação de conta com confirmação por e-mail e tratamento de e-mails não confirmados.
- **Login**: Autenticação robusta com e-mail/senha e suporte a **OAuth (GitHub)**.
- **Recuperação de Senha**: Fluxo completo de "Esqueci minha senha" com envio de e-mail e redefinição segura.
- **Área Privada**: Rota protegida `/private` que exibe dados do perfil e gerencia a sessão.
- **Legal Pages**: Páginas de Termos de Serviço e Privacidade integradas via MDX.
- **UX Aprimorada**: Toasts de notificação (Sonner), estados de carregamento (Spinners) e validação em tempo real.

---

## ⚙️ Tecnologias e Qualidade

- **Next.js 15+ (App Router)**: Otimizado para performance.
- **Supabase SSR**: Gerenciamento de sessão baseado em cookies no lado do servidor.
- **shadcn/ui**: Componentes de UI acessíveis e customizáveis.
- **Tailwind CSS 4**: O motor de estilização mais moderno.
- **Automação**: Husky e Lint-staged configurados para ESLint, Prettier e Commitlint.
- **Versionamento Dinâmico**: Versão do projeto exibida automaticamente a partir do `package.json`.

---

Desenvolvido com ❤️ para acelerar o seu próximo grande projeto.
