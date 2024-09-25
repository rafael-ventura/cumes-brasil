# Usar uma imagem base oficial do Node.js correspondente à sua versão
FROM node:20-alpine

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências de produção
RUN npm install --production

# Copiar o restante do código da aplicação
COPY . .

# Compilar o código TypeScript (se aplicável)
RUN npm run build

# Expor a porta que a aplicação usará
EXPOSE 8080

# Definir a variável de ambiente NODE_ENV como 'production'
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["node", "dist/WebAPI/server.js"]
