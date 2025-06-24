FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install pnpm@9.15.9 -g
RUN pnpm install
COPY . .
RUN pnpm run build
CMD ["node", "dist/main.js"]
