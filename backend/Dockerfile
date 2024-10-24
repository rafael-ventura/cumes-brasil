# Usar a imagem base mínima
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar o package.json e instalar dependências de produção
COPY backend/package*.json ./
RUN npm install --only=production

# Copiar o código-fonte
COPY backend/dist ./dist
COPY backend/assets ./assets

# Expor a porta do backend
EXPOSE 3001

# Definir variável de ambiente
ENV NODE_ENV=production

# Comando para iniciar o backend
CMD ["node", "dist/WebAPI/server.js"]
