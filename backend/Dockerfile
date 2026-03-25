FROM node:18-bullseye-slim

WORKDIR /app

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8001

CMD ["npm", "start"]
