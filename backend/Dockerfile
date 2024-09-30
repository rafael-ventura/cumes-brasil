# Usar a imagem base mínima
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e instalar dependências de produção
COPY package*.json ./
RUN npm install --only=production

# Copiar a pasta 'dist' já construída que está dentro do diretório 'backend'
COPY backend/dist ./dist

# Copiar a pasta 'assets' da raiz do projeto para dentro de 'dist/assets'
COPY assets ./dist/assets

# Copiar os arquivos JSON para o local correto dentro do contêiner
COPY backend/src/Infrastructure/sql_scripts/*.json ./dist/Infrastructure/sql_scripts/

# Expor a porta do back-end
EXPOSE 8080

# Definir variável de ambiente
ENV NODE_ENV=production

# Comando para iniciar o back-end
CMD ["node", "dist/WebAPI/server.js"]
