 #Usar a imagem base mínima do Node.js
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar o package.json e package-lock.json
COPY frontend/package*.json ./

# Instalar apenas as dependências de produção
RUN npm install --only=production

# Copiar os arquivos construídos para o diretório atual
COPY frontend/dist ./dist

# Expor a porta que o servidor usará
EXPOSE 3000

# Comando para iniciar o servidor estático
CMD ["npx", "serve", "-s", "dist/pwa", "-l", "3000"]
