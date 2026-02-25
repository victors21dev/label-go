# 🏷️ Label-Go

**Label-Go** é uma solução completa para gestão e geração de etiquetas térmicas. Desenvolvido com o que há de mais moderno no ecossistema React, o sistema oferece controle total sobre usuários, setores, equipamentos e modelos de impressão, com foco em usabilidade, segurança e performance.

## 🚀 Tecnologias

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/)
- **ORM:** [Prisma 7](https://www.prisma.io/) (PostgreSQL & SQLite)
- **Tabelas:** [TanStack Table v8](https://tanstack.com/table/v8)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Autenticação:** NextAuth.js & Clerk
- **UI Components:** Radix UI & Lucide React
- **Validação:** Zod & React Hook Form

## ✨ Funcionalidades

- 👥 **Gestão de Usuários:** Controle de cargos (ADMIN/USER) e status de autorização via Badges dinâmicos e ícones identificadores.
- 🏢 **Estrutura por Setores:** Organização de departamentos com vínculo direto entre usuários, coordenadores e setores de trabalho.
- 🖨️ **Controle de Ativos:** Cadastro detalhado de impressoras (Marca/Modelo) com ícones técnicos para fácil identificação.
- 📏 **Dimensionamento Preciso:** Gestão de dimensões de etiquetas em milímetros (mm) com indicadores visuais de largura e altura (rotacionado).
- 📱 **QR Code Integration:** Geração automática de QR Codes para inclusão em etiquetas dinâmicas.
- 📄 **Impressão Direta:** Integração com `react-to-print` para saída rápida e formatada em impressoras térmicas.
- 🌓 **Temas:** Suporte nativo a modo claro e escuro (Dark Mode).

## 🛠️ Instalação e Configuração

### 1. Clone o repositório:

```bash
git clone [https://github.com/seu-usuario/label-go.git](https://github.com/seu-usuario/label-go.git)
cd label-go
```

### 2. Instale as dependências:

```bash
npm install
```

### 3. Configure as variáveis de ambiente:

Crie um arquivo .env na raiz do projeto:

```bash
DATABASE_URL="postgresql"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu_secret_gerado_aqui"
```

### 4. Prepare o Banco de Dados:

```bash
# Gera o cliente Prisma
npx prisma generate

# Sincroniza o schema com o banco de dados
npx prisma db push
```

### 5. Inicie o servidor:

```bash
npm run dev
```

## 🏗️ Estrutura do Banco (Prisma)

O esquema do banco de dados foi projetado para manter a integridade referencial entre setores e usuários, permitindo auditoria de quem gerou cada etiqueta:

User: Gerencia autenticação, permissões (Role) e status de acesso.

Sector: Define os departamentos da empresa e seus respectivos coordenadores.

Printer: Armazena as especificações de hardware (Marca e Modelo).

LabelModel: Define as propriedades físicas das etiquetas (Largura e Altura em mm).

## 📜 Scripts Disponíveis

```bash
npm run dev: Executa o projeto em ambiente de desenvolvimento com Hot Reload.
npm run build: Cria a build de produção otimizada.
npm run start: Inicia o servidor em modo de produção utilizando a build gerada.
npm run lint: Executa a verificação de padrões de código com ESLint.
npm run postinstall: Script automático para garantir que o Prisma Client esteja sempre atualizado.
```

### 📅 Versão: 0.1.0
