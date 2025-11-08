FROM node:20-slim

WORKDIR /app

COPY package*.json ./

# npm clean install (ci)
RUN npm ci --only=production

COPY . .

EXPOSE 4000

CMD ["node", "src/server.js"]