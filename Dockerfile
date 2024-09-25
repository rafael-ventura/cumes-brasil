# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copia o conteúdo da pasta backend
COPY backend/package*.json ./backend/

WORKDIR /usr/src/app/backend

RUN npm install

# Copiar todos os arquivos do backend, incluindo a pasta 'database'
COPY backend .

# Copiar a pasta 'database/json' para o local correto
COPY database/json ./database/json

RUN npm run build

# Etapa de produção
FROM node:20-alpine

WORKDIR /usr/src/app/backend

COPY backend/package*.json ./

RUN npm install --production

# Copiar a pasta 'database/json' para o local correto na etapa de produção
COPY --from=builder /usr/src/app/backend/database/json ./database/json

COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/backend/assets ./assets

EXPOSE 8080

ENV NODE_ENV=production

CMD ["node", "dist/WebAPI/server.js"]
