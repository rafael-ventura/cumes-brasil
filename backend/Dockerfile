FROM node:20-alpine

WORKDIR /usr/src/app

COPY backend/package*.json ./
RUN npm install --only=development

COPY backend/dist ./dist

EXPOSE 3001

ENV NODE_ENV=development

CMD ["node", "dist/Api/server.js"]
