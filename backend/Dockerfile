# Usar a imagem base mínima
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e instalar dependências de produção
COPY backend/package*.json ./
RUN npm install --only=production

# Copiar a pasta 'dist' já construída que está dentro do diretório 'backend'
COPY backend/dist ./dist

# Copiar a pasta 'assets' do diretório 'backend'
COPY backend/assets ./assets

# Expor a porta do back-end
EXPOSE 8080

# Definir variável de ambiente
ENV NODE_ENV=production

# Comando para iniciar o back-end
CMD ["node", "dist/WebAPI/server.js"]
