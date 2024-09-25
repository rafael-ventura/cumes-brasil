# Usar uma imagem base oficial do Node.js correspondente à sua versão
FROM node:20-alpine

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies)
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Compilar o código TypeScript
RUN npm run build

# Remover as devDependencies para otimizar a imagem
RUN npm prune --production

# Expor a porta que a aplicação usará
EXPOSE 8080

# Definir a variável de ambiente NODE_ENV como 'production'
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["node", "dist/WebAPI/server.js"]
