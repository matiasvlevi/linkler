FROM node:18

WORKDIR /frontend

COPY package*.json ./

RUN npm ci

COPY . .
COPY ../.env .env

EXPOSE ${WEB_PORT}

RUN npm run build

CMD ["npm", "start"]