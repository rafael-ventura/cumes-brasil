# Usar a imagem base mínima do Node.js
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar apenas a pasta `dist` gerada pelo build do frontend na EC2
COPY frontend/dist ./dist

# Instalar o pacote 'serve' globalmente
RUN npm install -g serve

# Expor a porta que o servidor usará
EXPOSE 3000

# Comando para iniciar o servidor estático
CMD ["serve", "-s", "dist", "-l", "3000"]
