
FROM node:16-alpine
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY ./package.json ./package-lock.json ./
ENV PATH /opt/node_modules/.bin:$PATH
RUN npm ci
RUN npm install --platform=linuxmusl --arch=x64 sharp

WORKDIR /opt/app
COPY ./ .
RUN npm run build
EXPOSE ${PORT}
CMD ["npm", "run", "start"]