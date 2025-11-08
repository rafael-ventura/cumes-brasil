# 🚀 Ambiente de Produção - Cumes Brasil

Esta documentação descreve a configuração completa do ambiente de produção do Cumes Brasil, incluindo arquitetura, pipeline de CI/CD e checklist de configuração.

## 📋 Índice

1. [Arquitetura Geral](#1-arquitetura-geral)
2. [Pipeline de CI/CD](#2-pipeline-de-cicd)
3. [Configuração AWS](#3-configuração-aws)
4. [Frontend: S3 + CloudFront](#4-frontend-s3--cloudfront)
5. [Backend: EC2 + Docker](#5-backend-ec2--docker)
6. [Banco de Dados](#6-banco-de-dados)
7. [Variáveis de Ambiente](#7-variáveis-de-ambiente)
8. [Monitoramento e Observabilidade](#8-monitoramento-e-observabilidade)
9. [Checklist de Configuração](#9-checklist-de-configuração)

---

## 1. Arquitetura Geral

### 🏗️ Visão Geral
O Cumes Brasil utiliza uma arquitetura híbrida com:
- **Frontend**: Vue.js/Quasar PWA hospedado no S3 + CloudFront
- **Backend**: Node.js/Express com TypeScript rodando em container Docker na EC2
- **Banco**: PostgreSQL em container Docker na mesma EC2
- **Infraestrutura**: AWS EC2, S3, CloudFront, CodeDeploy
- **CI/CD**: GitHub Actions + AWS CodeDeploy

### 🌐 Domínios e DNS
- **API**: `api.cumesbrasil.com.br` → EC2 (porta 443 via Nginx)
- **Frontend**: `cumesbrasil.com.br` → CloudFront + S3
- **Imagens**: CDN CloudFront para assets estáticos

---

## 2. Pipeline de CI/CD

### 2.1 GitHub Actions

#### 🔄 Workflow: Backend Deploy
**Arquivo**: `.github/workflows/backend-deploy.yml`
**Trigger**: Push na branch `main` (apenas mudanças em `backend/`, `docker-compose.yml`, `scripts/`, `appspec.yml`)

**Processo**:
1. Checkout do repositório
2. Configuração de credenciais AWS via OIDC
3. Instalação de dependências e build do backend
4. Empacotamento em ZIP com arquivos necessários
5. Upload para S3 bucket `cumes-backend-deployment`
6. Criação de deploy no CodeDeploy

#### 🔄 Workflow: Full Stack Deploy
**Arquivo**: `.github/workflows/deploy.yml`
**Trigger**: Push na branch `NEVERSAYNEVER`

**Processo**:
1. Build do frontend com variáveis de produção
2. Upload do frontend para S3 bucket `cumes-brasil-front`
3. Invalidação do cache CloudFront (ID: `ELJ8QUTTTNKFP`)
4. Sincronização de imagens para S3 bucket `cumes-brasil-images`
5. Invalidação do cache CloudFront para imagens (ID: `E2N1FL7EYFLAP1`)
6. Deploy do backend via CodeDeploy

### 2.2 AWS CodeDeploy

#### 📦 AppSpec
**Arquivo**: `appspec.yml`
```yaml
version: 0.0
os: linux
files:
  - source: /
    destination: /home/ec2-user/cumes-brasil

permissions:
  - object: /home/ec2-user/cumes-brasil
    owner: ec2-user
    group: ec2-user
    mode: 755

hooks:
  BeforeInstall:
    - location: scripts/stop_services.sh
      timeout: 400
      runas: ec2-user
  ApplicationStart:
    - location: scripts/start_services.sh
      timeout: 1000
      runas: ec2-user
```

#### 🚀 Scripts de Deploy

**Parar Serviços** (`scripts/stop_services.sh`):
```bash
# Para a API no PM2
pm2 stop cumes-api || true
pm2 delete cumes-api || true

# Para apenas o banco no Docker
docker-compose stop postgres
```

**Iniciar Serviços** (`scripts/start_services.sh`):
```bash
# Instala dependências e faz build
npm install
npm run build

# Inicia a API com PM2
pm2 delete cumes-api || true
pm2 start dist/Api/server.js --name cumes-api
pm2 save

# Inicia o PostgreSQL no Docker
docker-compose up -d postgres
```

---

## 3. Configuração AWS

### 3.1 IAM e Permissões

#### 👤 Role para GitHub Actions
**ARN**: `arn:aws:iam::156041409339:role/GitHubActionsCodeDeployRole`
**Permissões necessárias**:
- `AmazonS3FullAccess`
- `AWSCodeDeployFullAccess`
- `CloudFrontFullAccess`

#### 🖥️ Role para EC2
**Nome**: `ec2_codedeploy`
**Permissões necessárias**:
- `AmazonS3FullAccess`
- `AWSCodeDeployRole`

### 3.2 Buckets S3

| Bucket | Propósito | Configuração |
|--------|-----------|--------------|
| `cumes-brasil-front` | Frontend PWA | Static Website Hosting habilitado |
| `cumes-brasil-images` | Assets e imagens | Versionamento habilitado |
| `cumes-backend-deployment` | Pacotes de deploy | Lifecycle para limpeza automática |

### 3.3 CloudFront - quando você usa o CloudFront da AWS, ele funciona como um CDN: pega os arquivos que estão no S3 (frontend e imagens) e os distribui pelos servidores da rede da Amazon, garantindo que alguém no Brasil ou na Europa consiga acessar com a mesma performance.

#### 🌐 Distribuição Frontend
**ID**: `ELJ8QUTTTNKFP`
**Origin**: S3 bucket `cumes-brasil-front`
**Comportamentos**: Redirect HTTP → HTTPS

#### 🖼️ Distribuição Imagens
**ID**: `E2N1FL7EYFLAP1`
**Origin**: S3 bucket `cumes-brasil-images`
**Comportamentos**: Cache otimizado para imagens

---

## 4. Frontend: S3 + CloudFront

### 4.1 Configuração do Bucket
```bash
# Habilitar Static Website Hosting
aws s3 website s3://cumes-brasil-front \
  --index-document index.html \
  --error-document error.html
```

### 4.2 Variáveis de Build
```env
VITE_APP_API_URL=https://api.cumesbrasil.com.br/api
VITE_APP_SERVER_IP=https://d1261jj6xox5lv.cloudfront.net
VITE_GOOGLE_CLIENT_ID=176876358344-1ukvkcsaoafq28cib1235cksn3nv7sm2.apps.googleusercontent.com
```

### 4.3 Deploy Automático
O workflow GitHub Actions:
1. Faz build com variáveis de produção
2. Sincroniza arquivos para S3
3. Invalida cache CloudFront automaticamente

---

## 5. Backend: EC2 + Docker

### 5.1 Configuração da Instância

#### 🖥️ Especificações Recomendadas
- **Tipo**: `t3.small` (2 vCPU, 2 GB RAM)
- **AMI**: Ubuntu 22.04 LTS
- **Storage**: 20 GB EBS gp3
- **Tags**: `Name=codedeployNodeapp`

#### 🔒 Security Groups
| Porta | Protocolo | Origem | Descrição |
|-------|-----------|--------|-----------|
| 22 | TCP | 0.0.0.0/0 | SSH |
| 80 | TCP | 0.0.0.0/0 | HTTP (redirecionamento) |
| 443 | TCP | 0.0.0.0/0 | HTTPS (API) |
| 3001 | TCP | 0.0.0.0/0 | API Node.js |

### 5.2 Docker Compose

**Arquivo**: `docker-compose.yml`
```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: cumes-postgres
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - cumes-network

  api:
    command: sh -c "node dist/Api/server.js"
    build:
      context: .
      dockerfile: backend/Dockerfile
    container_name: cumes-api
    environment:
      NODE_ENV: production
      # ... outras variáveis
    ports:
      - "3001:8080"
    depends_on:
      - postgres
    networks:
      - cumes-network
```

### 5.3 Nginx + SSL

#### 🔐 Configuração SSL com Let's Encrypt
```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d api.cumesbrasil.com.br

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### ⚙️ Configuração Nginx
```nginx
server {
    listen 80;
    server_name api.cumesbrasil.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name api.cumesbrasil.com.br;
    
    ssl_certificate /etc/letsencrypt/live/api.cumesbrasil.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.cumesbrasil.com.br/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 6. Banco de Dados

### 6.1 PostgreSQL Container
- **Imagem**: `postgres:16-alpine`
- **Volume**: `db-data` (persistente)
- **Rede**: `cumes-network` (bridge)
- **Porta**: 5432 (interno)

### 6.2 Configuração de Ambiente
```env
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
```

### 6.3 Backup e Recuperação
```bash
# Backup
docker exec cumes-postgres pg_dump -U $DB_USERNAME $DB_NAME > backup.sql

# Restore
docker exec -i cumes-postgres psql -U $DB_USERNAME $DB_NAME < backup.sql
```

---

## 7. Variáveis de Ambiente

### 7.1 Arquivo .env (Produção)
```env
# Banco de Dados
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=cumesbr
DB_PASSWORD=sua_senha_segura
DB_NAME=cumes_brasil

# API
API_HOSTNAME=api.cumesbrasil.com.br
API_PORT=3001
WEB_HOSTNAME=cumesbrasil.com.br
WEB_PORT=443

# OAuth2 e Google
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
OAUTH2_ENABLED=true

# Email
MAIL_USER=seu_email
MAIL_PASSWORD=sua_senha_email

# AWS
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=cumes-brasil-images
CLOUDFRONT_URL=https://d1261jj6xox5lv.cloudfront.net

# Segurança
SECRET_KEY=sua_chave_secreta_jwt
```

### 7.2 Validação de Variáveis
Recomenda-se implementar validação com biblioteca `joi`:
```typescript
import Joi from 'joi';

const envSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  // ... outras validações
});
```

---

## 8. Monitoramento e Observabilidade

### 8.1 PM2
```bash
# Status dos processos
pm2 status

# Logs em tempo real
pm2 logs cumes-api

# Monitoramento
pm2 monit
```

### 8.2 CloudWatch (Recomendado)
```bash
# Instalar CloudWatch Agent
sudo yum install -y amazon-cloudwatch-agent

# Configurar métricas
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

### 8.3 Health Checks
Implementar endpoint `/health` na API:
```typescript
app.get('/health', async (req, res) => {
  try {
    // Verificar conexão com banco
    await dataSource.query('SELECT 1');
    res.status(200).json({ status: 'healthy', timestamp: new Date() });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});
```

---

## 9. Checklist de Configuração

### ✅ Pré-requisitos
- [ ] Conta AWS configurada
- [ ] Domínio registrado no registro.br
- [ ] Acesso SSH à instância EC2
- [ ] Permissões IAM configuradas

### ✅ Infraestrutura AWS
- [ ] Bucket S3 `cumes-brasil-front` criado
- [ ] Bucket S3 `cumes-brasil-images` criado
- [ ] Bucket S3 `cumes-backend-deployment` criado
- [ ] Distribuições CloudFront configuradas
- [ ] Certificados ACM emitidos

### ✅ Instância EC2
- [ ] Instância Ubuntu 22.04 lançada
- [ ] Security Groups configurados
- [ ] Role `ec2_codedeploy` associada
- [ ] Docker e Docker Compose instalados
- [ ] Node.js 20.x instalado
- [ ] PM2 instalado globalmente
- [ ] Nginx instalado e configurado

### ✅ CodeDeploy
- [ ] Aplicação `cumes-backend-app` criada
- [ ] Grupo de deploy `cumes-backend-deployment-group` criado
- [ ] Agente CodeDeploy instalado na EC2
- [ ] Tag `Name=codedeployNodeapp` aplicada

### ✅ DNS e SSL
- [ ] Nameservers apontando para Cloudflare
- [ ] Registros CNAME configurados
- [ ] Certificado Let's Encrypt emitido
- [ ] Nginx configurado com SSL

### ✅ GitHub Actions
- [ ] Secrets AWS configurados
- [ ] Workflows testados
- [ ] Deploy automático funcionando

### ✅ Monitoramento
- [ ] PM2 configurado para auto-start
- [ ] Logs sendo coletados
- [ ] Health checks implementados
- [ ] Alertas configurados (opcional)

---

## 🔧 Comandos Úteis

### Deploy Manual
```bash
# Frontend
npm run build
aws s3 sync frontend/dist/pwa s3://cumes-brasil-front/

# Backend
npm run build
zip -r app.zip backend/ docker-compose.yml appspec.yml scripts/
aws s3 cp app.zip s3://cumes-backend-deployment/
aws deploy create-deployment --application-name cumes-backend-app --deployment-group-name cumes-backend-deployment-group --s3-location bucket=cumes-backend-deployment,bundleType=zip,key=app.zip
```

### Manutenção
```bash
# Reiniciar serviços
pm2 restart cumes-api
docker-compose restart postgres

# Verificar logs
pm2 logs cumes-api
docker-compose logs postgres

# Backup do banco
docker exec cumes-postgres pg_dump -U $DB_USERNAME $DB_NAME > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

## 📚 Recursos Adicionais

- [Documentação AWS CodeDeploy](https://docs.aws.amazon.com/codedeploy/)
- [Guia PM2](https://pm2.keymetrics.io/docs/)
- [Certbot para Nginx](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verificar logs do PM2 e Docker
2. Consultar CloudWatch (se configurado)
3. Verificar status dos serviços AWS
4. Revisar configurações de rede e segurança

---

*Última atualização: $(date)*
*Versão: 1.0*
