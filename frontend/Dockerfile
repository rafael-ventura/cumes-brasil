# Etapa de build
FROM node:20-alpine AS builder

# Definir diretório de trabalho
WORKDIR /usr/src/app/frontend

# Copiar os arquivos package.json e package-lock.json do frontend
COPY frontend/package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código do frontend
COPY frontend ./

# Executar o build do frontend
RUN npm run build

# Etapa de produção usando Nginx
FROM nginx:alpine

# Copiar os arquivos construídos para o Nginx
COPY --from=builder /usr/src/app/frontend/dist/pwa /usr/share/nginx/html

# Expor a porta do frontend
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
