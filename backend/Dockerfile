FROM node:20-alpine

WORKDIR /usr/src/app

COPY backend/package*.json ./
RUN npm install --only=production

COPY backend/dist ./dist

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/Api/server.js"]
