FROM node:18

WORKDIR /linkler-frontend

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE ${WEB_PORT}

CMD ["npm", "start"]