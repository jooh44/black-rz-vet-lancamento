FROM node:20-bullseye-slim AS base

ENV NODE_ENV=production
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /usr/src/app

COPY package*.json ./
COPY node_modules ./node_modules

COPY public ./public
COPY server ./server
COPY README.md ./

EXPOSE 3000
CMD ["node", "server/index.js"]
