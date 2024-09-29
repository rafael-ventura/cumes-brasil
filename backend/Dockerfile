# Usar a imagem base mínima
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app/backend

# Copiar package.json e package-lock.json
COPY backend/package*.json ./

# Instalar dependências de produção
RUN npm install --production

# Copiar a pasta 'dist' já construída
COPY backend/dist ./dist

# Copiar a pasta 'assets' se necessário
COPY assets ./assets

# Expor a porta do back-end
EXPOSE 8080

# Definir variável de ambiente
ENV NODE_ENV=production

# Comando para iniciar o back-end
CMD ["node", "dist/WebAPI/server.js"]
