# Etapa de build
FROM node:20-alpine AS builder

# Definir diretório de trabalho
WORKDIR /usr/src/app/backend

# Copiar os arquivos package.json e package-lock.json do backend
COPY backend/package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código do backend
COPY backend ./

# Copiar a pasta 'database/json' para o backend
COPY backend/database/json ./database/json

# Executar o build do backend
RUN npm run build

# Etapa de produção
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app/backend

# Copiar package.json e package-lock.json
COPY backend/package*.json ./

# Instalar dependências de produção
RUN npm install --production

# Copiar a pasta 'database/json' da etapa de build
COPY --from=builder /usr/src/app/backend/database/json ./database/json

# Copiar a pasta de distribuição do backend
COPY --from=builder /usr/src/app/backend/dist ./dist

# Copiar a pasta 'assets' da raiz do projeto
COPY assets ./assets

# Expor a porta do backend
EXPOSE 8080

# Definir variável de ambiente
ENV NODE_ENV=production

# Comando para iniciar o backend
CMD ["node", "dist/WebAPI/server.js"]
