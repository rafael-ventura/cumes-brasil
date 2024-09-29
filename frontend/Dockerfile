# Usar Nginx como servidor
FROM nginx:alpine

# Copiar os arquivos construídos para o Nginx
COPY frontend/dist /usr/share/nginx/html

# Expor a porta do front-end
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
