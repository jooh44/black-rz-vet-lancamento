FROM node:20-alpine AS base

ENV NODE_ENV=production
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY public ./public
COPY server ./server
COPY README.md ./

EXPOSE 3000
CMD ["node", "server/index.js"]
