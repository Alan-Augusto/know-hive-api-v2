# 🎓 Know-Hive API

<div align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
</div>

<br />

**Know-Hive API** é o backend da plataforma Know-Hive, uma aplicação acadêmica colaborativa que permite aos usuários criar, responder e compartilhar questões de forma intuitiva e organizada.

## 📋 Índice

- [🎯 Funcionalidades](#-funcionalidades)
- [🏗️ Arquitetura](#%EF%B8%8F-arquitetura)
- [🚀 Início Rápido](#-início-rápido)
- [⚙️ Configuração](#%EF%B8%8F-configuração)
- [📖 Documentação da API](#-documentação-da-api)
- [🗄️ Banco de Dados](#%EF%B8%8F-banco-de-dados)
- [🛠️ Scripts Disponíveis](#%EF%B8%8F-scripts-disponíveis)
- [🧪 Testes](#-testes)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🔧 Desenvolvimento](#-desenvolvimento)
- [📄 Licença](#-licença)

## 🎯 Funcionalidades

### 👥 Gestão de Usuários
- ✅ **Autenticação JWT** com suporte a "Remember Me"
- ✅ **Registro e login** com criptografia bcrypt
- ✅ **Perfis de usuário** com estatísticas detalhadas
- ✅ **Upload de imagens** para foto de perfil

### 📝 Sistema de Questões
- ✅ **Criação de questões** com múltiplas alternativas
- ✅ **Tipos de questão** flexíveis e configuráveis
- ✅ **Sistema de likes** para questões
- ✅ **Busca avançada** com filtros
- ✅ **Compartilhamento** com controle de acesso

### 📚 Coleções
- ✅ **Organização em coleções** temáticas
- ✅ **Permissões granulares** (leitura, escrita, admin)
- ✅ **Coleções públicas e privadas**
- ✅ **Sistema de colaboração** entre usuários

### 📊 Respostas e Estatísticas
- ✅ **Sistema completo de respostas** com tentativas múltiplas
- ✅ **Estatísticas detalhadas** por usuário, questão e coleção
- ✅ **Tracking de performance** e progresso
- ✅ **Histórico de tentativas** com timestamps

### 🏷️ Sistema de Tags
- ✅ **Categorização** com tags personalizáveis
- ✅ **Busca por tags** em questões e coleções
- ✅ **Estatísticas por tag**

## 🏗️ Arquitetura

O projeto segue a arquitetura modular do NestJS com os seguintes princípios:

- **Modular**: Cada funcionalidade em seu próprio módulo
- **RESTful**: APIs seguindo padrões REST
- **Type-Safe**: TypeScript em toda a aplicação
- **ORM**: Prisma para interação com banco de dados
- **Documentada**: Swagger/OpenAPI para documentação automática

### 🗂️ Principais Módulos

| Módulo | Responsabilidade |
|--------|------------------|
| `AuthModule` | Autenticação e autorização |
| `UsersModule` | Gestão de usuários |
| `QuestionsModule` | CRUD de questões |
| `CollectionsModule` | Gestão de coleções |
| `QuestionResponseModule` | Sistema de respostas |
| `TagsModule` | Sistema de tags |
| `MediaModule` | Upload de arquivos |

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** (v18 ou superior)
- **PostgreSQL** (v13 ou superior)
- **npm** ou **yarn**

### 1. Clone o repositório

```bash
git clone https://github.com/Alan-Augusto/know-hive-api-v2
cd know-hive-api-v2
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
DATABASE_URL="postgresql://username:password@localhost:5432/knowhive"
JWT_SECRET="your-super-secure-jwt-secret"
PORT=3000
```

### 4. Configure o banco de dados

```bash
# Execute as migrations
npx prisma migrate dev

# (Opcional) Popule com dados de exemplo
npx prisma db seed
```

### 5. Inicie a aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

🎉 **Pronto!** A API estará rodando em `http://localhost:3000`

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `DATABASE_URL` | String de conexão PostgreSQL | ✅ |
| `JWT_SECRET` | Chave secreta para JWT | ✅ |
| `PORT` | Porta do servidor | ❌ (padrão: 3000) |

### CORS

A API está configurada para aceitar requisições de:
- `http://localhost:4200` (Angular dev)
- `http://localhost:64437` (Local dev)
- `https://know-hive.vercel.app` (Produção)

## 📖 Documentação da API

### Swagger UI

Acesse a documentação interativa em: `http://localhost:3000/api`

### Principais Endpoints

#### 🔐 Autenticação
```http
POST /auth/login
POST /auth/register
GET  /auth/exist-email/:email
```

#### 👥 Usuários
```http
GET    /users
GET    /users/:id
GET    /users/:id/statistics
POST   /users
PATCH  /users/:id
DELETE /users/:id
```

#### 📝 Questões
```http
GET    /questions
GET    /questions/:id
GET    /questions/user/:userId
POST   /questions
POST   /questions/with-alternatives
POST   /questions/search
PATCH  /questions/:id
DELETE /questions/:id
```

#### 📚 Coleções
```http
GET    /collections
GET    /collections/:id
GET    /collections/user/:userId
POST   /collections
POST   /collections/with-questions
PATCH  /collections/:id
DELETE /collections/:id
```

#### 📊 Respostas
```http
GET    /question-responses
GET    /question-responses/stats/user/:userId
GET    /question-responses/stats/question/:questionId
POST   /question-responses
```

## 🗄️ Banco de Dados

### Schema Principal

```mermaid
erDiagram
    User ||--o{ Question : creates
    User ||--o{ Collection : creates
    User ||--o{ QuestionResponse : responds
    Question ||--o{ Alternative : has
    Question }o--o{ Collection : belongs_to
    QuestionResponse }o--|| Question : answers
    QuestionResponse }o--|| User : from
```

### Principais Entidades

- **User**: Usuários da plataforma
- **Question**: Questões com alternativas
- **Collection**: Agrupamentos de questões
- **QuestionResponse**: Respostas dos usuários
- **Alternative**: Opções de resposta
- **Tag**: Sistema de categorização

## 🛠️ Scripts Disponíveis

### Desenvolvimento
```bash
npm run start          # Inicia em modo normal
npm run start:dev      # Inicia com watch mode
npm run start:debug    # Inicia com debug habilitado
```

### Build e Produção
```bash
npm run build          # Compila o projeto
npm run start:prod     # Inicia versão de produção
```

### Qualidade de Código
```bash
npm run format         # Formata código com Prettier
npm run lint           # Executa ESLint
npm run lint:fix       # Corrige problemas do ESLint
```

### Banco de Dados
```bash
npx prisma generate    # Gera cliente Prisma
npx prisma migrate dev # Cria e aplica migration
npx prisma migrate deploy # Aplica migrations (produção)
npx prisma db push     # Sincroniza schema sem migration
npx prisma studio      # Interface visual do banco
npx prisma format      # Formata schema.prisma
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes em modo watch
npm run test:watch

# Testes end-to-end
npm run test:e2e

# Coverage de testes
npm run test:cov

# Debug de testes
npm run test:debug
```

## 📁 Estrutura do Projeto

```
know-hive-api-v2/
├── 📁 src/
│   ├── 📁 auth/                 # Módulo de autenticação
│   ├── 📁 users/                # Gestão de usuários
│   ├── 📁 questions/            # CRUD de questões
│   ├── 📁 collections/          # Gestão de coleções
│   ├── 📁 question-response/    # Sistema de respostas
│   ├── 📁 alternatives/         # Alternativas das questões
│   ├── 📁 tags/                 # Sistema de tags
│   ├── 📁 media/                # Upload de arquivos
│   ├── 📁 database/             # Configuração Prisma
│   ├── 📄 app.module.ts         # Módulo principal
│   └── 📄 main.ts               # Ponto de entrada
├── 📁 prisma/
│   ├── 📄 schema.prisma         # Schema do banco
│   └── 📁 migrations/           # Migrations
├── 📁 test/                     # Testes E2E
├── 📁 uploads/                  # Arquivos uploadados
├── 📄 package.json
├── 📄 tsconfig.json
└── 📄 nest-cli.json
```

## 🔧 Desenvolvimento

### Nest CLI

Para instalar o Nest CLI globalmente:
```bash
npm i -g @nestjs/cli
```

### Gerando Recursos

```bash
# Gera módulo completo (controller, service, module, DTOs)
nest g resource <nome-recurso>

# Gera componentes individuais
nest g controller <nome>
nest g service <nome>
nest g module <nome>
```

### Padrões de Código

- **DTOs**: Validação com `class-validator`
- **Swagger**: Documentação com decorators
- **Prisma**: ORM type-safe
- **JWT**: Autenticação stateless
- **CORS**: Configurado para desenvolvimento e produção

### Boas Práticas

1. **Modularidade**: Cada funcionalidade em seu módulo
2. **Validação**: Pipes de validação em todos os endpoints
3. **Documentação**: Swagger em todos os endpoints
4. **Type Safety**: TypeScript em toda aplicação
5. **Error Handling**: Tratamento consistente de erros
6. **Security**: Validação de entrada e sanitização

### Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença **UNLICENSED**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <strong>🐝 Construído com ❤️ para compartilhar conhecimento</strong>
</div>
