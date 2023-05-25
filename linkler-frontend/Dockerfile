FROM node:18

WORKDIR /linkler-frontend

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE ${WEB_PORT}

ARG GTM_KEY
ARG GA_KEY
ENV GTM_KEY=${GTM_KEY}
ENV GA_KEY=${GA_KEY}

RUN npm run build

CMD ["npm", "start"]