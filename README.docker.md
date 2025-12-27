# 🐳 Docker Setup - PostgreSQL para Desenvolvimento

Este documento descreve como usar o Docker Compose para executar o PostgreSQL localmente durante o desenvolvimento.

## 📋 Pré-requisitos

- Docker Desktop instalado e em execução
- Docker Compose (incluído no Docker Desktop)

## 🚀 Iniciando os Serviços

### Iniciar PostgreSQL

```bash
# Iniciar o container em background
docker-compose up -d

# Verificar o status dos containers
docker-compose ps

# Ver logs
docker-compose logs -f postgres
```

### Parar os Serviços

```bash
# Parar os containers
docker-compose down

# Parar e remover volumes (CUIDADO: apaga os dados!)
docker-compose down -v
```

## 🗄️ Configuração do Banco de Dados

### Credenciais Padrão

| Parâmetro | Valor |
|-----------|-------|
| **Host** | localhost |
| **Porta** | 5432 |
| **Usuário** | eace_user |
| **Senha** | eace_password |
| **Database** | eace_backend_dashboard |

### String de Conexão

```
postgresql://eace_user:eace_password@localhost:5432/eace_backend_dashboard
```

## 🔌 Conectar com DBeaver

1. Abra o DBeaver
2. Clique em **Nova Conexão** ou **Database** → **New Database Connection**
3. Selecione **PostgreSQL** e clique em **Next**
4. Preencha os dados:
   - **Host**: localhost
   - **Port**: 5432
   - **Database**: eace_backend_dashboard
   - **Username**: eace_user
   - **Password**: eace_password
5. Clique em **Test Connection** para verificar
6. Clique em **Finish**

## 📦 Volumes

Os dados do PostgreSQL são persistidos em volume Docker:

- `postgres_data`: Armazena todos os dados do banco

### Gerenciar Volumes

```bash
# Listar volumes
docker volume ls

# Inspecionar volume do PostgreSQL
docker volume inspect inc-wayos-back_postgres_data

# Fazer backup do volume (exemplo)
docker run --rm -v inc-wayos-back_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restaurar backup
docker run --rm -v inc-wayos-back_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

## 🔍 Comandos Úteis

### Conectar ao PostgreSQL via psql

```bash
# Entrar no container
docker-compose exec postgres psql -U eace_user -d eace_backend_dashboard

# Ou diretamente do host (se tiver psql instalado)
psql -h localhost -p 5432 -U eace_user -d eace_backend_dashboard
```

### Verificar Health Check

```bash
# Ver status de saúde
docker-compose ps

# Logs do healthcheck
docker inspect --format='{{json .State.Health}}' eace-postgres-dev
```

### Executar SQL Scripts

```bash
# Executar um arquivo SQL
docker-compose exec -T postgres psql -U eace_user -d eace_backend_dashboard < script.sql

# Criar dump do banco
docker-compose exec -T postgres pg_dump -U eace_user eace_backend_dashboard > dump.sql
```

## ⚙️ Personalização

### Alterar Credenciais

Edite o arquivo `docker-compose.yaml` na seção `environment` do serviço `postgres`:

```yaml
environment:
  POSTGRES_USER: seu_usuario
  POSTGRES_PASSWORD: sua_senha
  POSTGRES_DB: seu_database
```

**Importante**: Atualize também o arquivo `.env.development` com as mesmas credenciais.

### Mudar a Porta

Para evitar conflitos com PostgreSQL instalado localmente:

```yaml
ports:
  - "5433:5432"  # Mapeia para porta 5433 no host
```

Atualize a `DATABASE_PORT` no `.env.development` para `5433`.

## 🛠️ Troubleshooting

### Container não inicia

```bash
# Ver logs completos
docker-compose logs postgres

# Recriar containers
docker-compose down
docker-compose up -d
```

### Conflito de porta

Se a porta 5432 já estiver em uso:

```bash
# Verificar o que está usando a porta
netstat -ano | findstr :5432

# Parar o PostgreSQL local do Windows
net stop postgresql-x64-16

# Ou alterar a porta no docker-compose.yaml
```

### Resetar completamente o banco

```bash
# Parar e remover tudo
docker-compose down -v

# Recriar do zero
docker-compose up -d
```

## 📚 Próximos Passos

1. ✅ PostgreSQL rodando localmente
2. ⏭️ Instalar TypeORM ou Prisma no projeto
3. ⏭️ Criar entidades/modelos do banco
4. ⏭️ Configurar migrations
5. ⏭️ Integrar com a aplicação NestJS

## 🔗 Links Úteis

- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [DBeaver Download](https://dbeaver.io/download/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
