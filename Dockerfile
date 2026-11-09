FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# copia só os manifests antes do código para aproveitar o cache de camadas
COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY docs ./docs
COPY public ./public

USER node
EXPOSE 3000
CMD ["node", "src/server.js"]
