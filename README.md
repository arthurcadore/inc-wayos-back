# 🏢 EACE Backend Dashboard

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/Jest-30.0.0-orange.svg)](https://jestjs.io/)
[![License](https://img.shields.io/badge/License-UNLICENSED-lightgrey.svg)](LICENSE)

> **API Backend profissional para o Dashboard EACE, construída com NestJS e TypeScript, preparada para múltiplos ambientes com documentação Swagger automática.**

---

## 📋 Índice

- [🚀 Getting Started](#-getting-started)
- [🏗️ Arquitetura](#️-arquitetura)
- [🌍 Ambientes](#-ambientes)
- [📚 Documentação API](#-documentação-api)
- [🛠️ Scripts Disponíveis](#️-scripts-disponíveis)
- [🧪 Testes](#-testes)
- [📐 Padrões de Código](#-padrões-de-código)
- [🚢 Deploy](#-deploy)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [🤝 Contribuição](#-contribuição)

---

## 🚀 Getting Started

### Pré-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Git**

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd inc-wayos-back

# Instale as dependências
npm install

# Configure o ambiente de desenvolvimento
cp .env.example .env.development

# Inicie a aplicação em modo desenvolvimento
npm run start:dev
```

### Acesso Rápido

```bash
# API Health Check
curl http://localhost:3000/api/v1

# Documentação Swagger (apenas DEV/HML)
http://localhost:3000/docs
```

---

## 🏗️ Arquitetura

### Tecnologias Principais

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **NestJS** | 11.0.1 | Framework Node.js escalável |
| **TypeScript** | 5.7.3 | Linguagem principal |
| **Jest** | 30.0.0 | Framework de testes |
| **Swagger** | Latest | Documentação automática |
| **ESLint** | 9.18.0 | Linting de código |
| **Prettier** | 3.4.2 | Formatação de código |

### Características

- ✅ **Arquitetura Modular** - Baseada em módulos NestJS
- ✅ **Type-Safe** - TypeScript em todo o projeto
- ✅ **Multi-Environment** - 3 ambientes configurados
- ✅ **API Documentation** - Swagger automático
- ✅ **Testing Ready** - Testes unitários e e2e
- ✅ **Code Quality** - ESLint + Prettier configurados
- ✅ **Production Ready** - Configurações otimizadas

---

## 🌍 Ambientes

O projeto está configurado para trabalhar com **3 ambientes distintos**:

### Development (DEV)
```bash
npm run start:dev
# Swagger: ✅ Habilitado
# Logs: Debug level
# Host: localhost:3000
```

### Homologation (HML)
```bash
npm run start:hml
# Swagger: ✅ Habilitado
# Logs: Info level
# Host: 0.0.0.0:3000
```

### Production (PROD)
```bash
npm run start:prod
# Swagger: ❌ Desabilitado (Segurança)
# Logs: Error level apenas
# Host: 0.0.0.0:3000
```

### Configuração de Variáveis

Cada ambiente possui seu arquivo `.env` específico:

```bash
.env.development    # Configurações de desenvolvimento
.env.homologation   # Configurações de homologação
.env.production     # Configurações de produção
.env.example        # Template de configuração
```

**Variáveis principais:**
```env
NODE_ENV=development|homologation|production
APP_NAME=EACE Backend Dashboard
APP_VERSION=0.0.1
PORT=3000
HOST=localhost
SWAGGER_ENABLED=true|false
```

---

## 📚 Documentação API

### Swagger UI

A documentação automática está disponível via **Swagger UI**:

- **Development:** [http://localhost:3000/docs](http://localhost:3000/docs)
- **Homologation:** [http://hml-server:3000/docs](http://hml-server:3000/docs)
- **Production:** ❌ **DESABILITADO** (por segurança)

### Endpoints Disponíveis

#### Health Check
```http
GET /api/v1
```

**Resposta:**
```json
{
    "message": "EACE Backend Dashboard is running!",
    "timestamp": "2025-11-05T10:30:00.000Z",
    "environment": "development",
    "version": "0.0.1"
}
```

### Características da API

- ✅ **Sem Autenticação** - API pública
- ✅ **RESTful** - Padrões REST implementados
- ✅ **CORS Configurado** - Por ambiente
- ✅ **Rate Limiting** - Proteção contra spam
- ✅ **Validation Pipes** - Validação automática

---

## 🛠️ Scripts Disponíveis

### Desenvolvimento

```bash
npm run start:dev        # Servidor com hot-reload (DEV)
npm run start:hml        # Servidor com hot-reload (HML)
npm run start:debug      # Debug mode (DEV)
npm run start:debug:hml  # Debug mode (HML)
```

### Build & Produção

```bash
npm run build:dev        # Build para desenvolvimento
npm run build:hml        # Build para homologação
npm run build:prod       # Build para produção
npm run start:prod       # Executar em produção
```

### Testes

```bash
npm test                 # Testes unitários
npm run test:watch       # Testes em modo watch
npm run test:cov         # Testes com coverage
npm run test:e2e         # Testes end-to-end
npm run test:e2e:dev     # Testes e2e (DEV)
npm run test:e2e:hml     # Testes e2e (HML)
```

### Qualidade de Código

```bash
npm run lint             # ESLint + auto-fix
npm run lint:check       # ESLint apenas verificação
npm run format           # Prettier formatação
npm run format:check     # Prettier verificação
npm run format:lint      # Format + Lint combinado
```

---

## 🧪 Testes

### Estrutura de Testes

```
src/
├── app.controller.spec.ts    # Testes do controller
├── app.service.spec.ts       # Testes do service
└── ...
test/
├── app.e2e-spec.ts          # Testes end-to-end
└── jest-e2e.json            # Configuração e2e
```

### Coverage Atual

- ✅ **AppController**: 4/4 testes
- ✅ **AppService**: 6/6 testes
- ✅ **Total**: 10/10 testes passando

### Executar Testes

```bash
# Todos os testes
npm test

# Testes específicos
npm test -- --testPathPatterns=app.service.spec.ts

# Com coverage
npm run test:cov
```

### Cenários Testados

#### AppService (`getHealthCheck`)
- ✅ Valores padrão quando config não disponível
- ✅ Valores configurados do environment
- ✅ Timestamps únicos para cada chamada
- ✅ Diferentes NODE_ENV values
- ✅ Diferentes APP_VERSION values

#### AppController
- ✅ Retorno correto do health check
- ✅ Integração com AppService
- ✅ Propriedades obrigatórias

---

## 📐 Padrões de Código

### ESLint (Mais Permissivo)

```javascript
// Configurações principais
"@typescript-eslint/no-explicit-any": "warn"        // Warning ao invés de erro
"@typescript-eslint/no-unsafe-argument": "warn"     // Mais flexível
"prettier/prettier": ["error", { tabWidth: 4 }]     // 4 espaços

// Regras específicas para testes (*.spec.ts)
"@typescript-eslint/unbound-method": "off"          // Desabilitado para mocks
"@typescript-eslint/no-unsafe-assignment": "off"    // Flexível para Jest
```

### Prettier

```json
{
    "singleQuote": true,
    "trailingComma": "all",
    "printWidth": 100,
    "tabWidth": 4,              // 4 espaços conforme solicitado
    "arrowParens": "avoid",
    "endOfLine": "auto"
}
```

### VS Code Settings

O projeto inclui configurações otimizadas para VS Code:

- ✅ **Format on Save** habilitado
- ✅ **Auto Fix ESLint** ao salvar
- ✅ **Prettier como formatter padrão**
- ✅ **TabSize: 4** configurado

---

## 🚢 Deploy

### Build para Produção

```bash
# Build otimizado
npm run build:prod

# Verificar build
ls -la dist/

# Executar
npm run start:prod
```

### Variáveis Obrigatórias (Produção)

```env
NODE_ENV=production
APP_NAME=EACE Backend Dashboard
PORT=3000
HOST=0.0.0.0
SWAGGER_ENABLED=false           # IMPORTANTE: Desabilitado em PROD
CORS_ORIGIN=https://dashboard.eace.com.br
LOG_LEVEL=error                 # Apenas erros em PROD
```

### Checklist de Deploy

- ✅ Configurar `.env.production`
- ✅ Verificar `SWAGGER_ENABLED=false`
- ✅ Configurar CORS para domínio correto
- ✅ Executar `npm run build:prod`
- ✅ Verificar logs em modo error
- ✅ Testar health check

---

## 📂 Estrutura do Projeto

```
inc-wayos-back/
├── 📁 src/
│   ├── 📁 config/
│   │   ├── environment.config.ts      # Validação de env vars
│   │   └── configuration.ts           # Configurações centralizadas
│   ├── 📁 modules/                   # Módulos futuros da aplicação
│   ├── app.controller.ts             # Controller principal
│   ├── app.service.ts                # Service principal
│   ├── app.module.ts                 # Módulo raiz
│   └── main.ts                       # Bootstrap da aplicação
├── 📁 test/
│   └── app.e2e-spec.ts              # Testes end-to-end
├── 📁 .vscode/
│   └── settings.json                 # Configurações VS Code
├── .env.development                  # Config desenvolvimento
├── .env.homologation                # Config homologação
├── .env.production                   # Config produção
├── .env.example                      # Template de config
├── .prettierrc                       # Config Prettier
├── .prettierignore                   # Arquivos ignorados pelo Prettier
├── eslint.config.mjs                 # Config ESLint
├── package.json                      # Dependências e scripts
└── README.md                         # Este arquivo
```

### Principais Diretórios

| Diretório | Descrição |
|-----------|-----------|
| `src/` | Código fonte da aplicação |
| `src/config/` | Configurações e validações |
| `src/modules/` | Módulos específicos (futuro) |
| `test/` | Testes end-to-end |
| `.vscode/` | Configurações do VS Code |

---

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o projeto
2. **Clone** seu fork
3. **Create** uma branch para sua feature
4. **Commit** suas mudanças
5. **Push** para sua branch
6. **Abra** um Pull Request

### Padrões de Commit

```bash
feat: adiciona nova funcionalidade
fix: corrige um bug
docs: atualiza documentação
style: mudanças de formatação
refactor: refatoração de código
test: adiciona ou modifica testes
chore: tarefas de manutenção
```

### Antes de Commitar

```bash
# Executar testes
npm test

# Verificar linting
npm run lint:check

# Verificar formatação
npm run format:check

# Ou executar tudo junto
npm run format:lint && npm test
```

### Pull Requests

- ✅ **Descrição clara** da mudança
- ✅ **Testes passando** (`npm test`)
- ✅ **Linting ok** (`npm run lint:check`)
- ✅ **Formatação ok** (`npm run format:check`)
- ✅ **Documentação atualizada** se necessário

---

## 📄 Licença

Este projeto está sob a licença **UNLICENSED** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Desenvolvido por

**Diogo Ramos de Carvalho**

---

## 🎯 Status do Projeto

- ✅ **Configuração Multi-Ambiente** - Implementado
- ✅ **Swagger Documentation** - Implementado
- ✅ **Testes Unitários** - Implementado
- ✅ **Code Quality Tools** - Implementado
- ✅ **Production Ready** - Implementado
- 🔄 **Módulos de Negócio** - Aguardando implementação
- 🔄 **Database Integration** - Aguardando implementação
- 🔄 **Authentication** - Não implementado (decisão do projeto)

---

<div align="center">

**🚀 EACE Backend Dashboard - Pronto para Produção!**

</div>
