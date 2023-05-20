FROM node:18

WORKDIR /linkler-frontend

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE ${WEB_PORT}

RUN npm run build

CMD ["npm", "start"]