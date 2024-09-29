# Usar a imagem base mínima
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e instalar dependências de produção
COPY backend/package*.json ./
RUN npm install --production

# Copiar a pasta 'dist' já construída
COPY backend/dist ./dist

# Copiar a pasta 'assets' para dentro de 'dist/assets'
COPY assets ./dist/assets

# Copiar o diretório 'database/json' para dentro do contêiner
COPY database/json ./database/json

# Expor a porta do back-end
EXPOSE 8080

# Definir variável de ambiente
ENV NODE_ENV=production

# Comando para iniciar o back-end
CMD ["node", "dist/WebAPI/server.js"]
