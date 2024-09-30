# Usar Nginx como servidor
FROM nginx:alpine
# Usar a imagem base mínima do Node.js
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar os arquivos construídos para o Nginx
COPY frontend/dist /usr/share/nginx/html
# Copiar apenas a pasta `dist` gerada pelo build do frontend na EC2
COPY frontend/dist ./dist

# Expor a porta do front-end
EXPOSE 80
# Instalar o pacote 'serve' globalmente
RUN npm install -g serve

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
# Expor a porta que o servidor usará
EXPOSE 3000

# Comando para iniciar o servidor estático
CMD ["serve", "-s", "dist", "-l", "3000"]

