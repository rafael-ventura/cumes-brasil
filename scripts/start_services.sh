#!/bin/bash
echo "Iniciando serviços..."

# Navegar até o diretório do projeto
cd /home/ec2-user/cumes-brasil || exit 1

# Subir o banco de dados com Docker Compose
docker-compose up -d postgres

# Verificar se o banco está disponível antes de rodar migrações
echo "Aguardando o banco de dados ficar disponível..."
until docker exec cumes-postgres pg_isready -U $DB_USERNAME -d $DB_NAME; do
  sleep 2
done

# Navegar para o backend e instalar dependências
cd backend || exit 1
npm install --only=production

# Transpilar o código TypeScript para JavaScript
npm run build

# Rodar as migrações do TypeORM
echo "Aplicando migrações do TypeORM..."
npm run migration:run

# Iniciar a API usando PM2
pm2 delete cumes-api || true
pm2 start dist/Api/server.js --name cumes-api

# Salvar a configuração do PM2 para reinício automático
pm2 save

echo "Serviços iniciados com sucesso!"
