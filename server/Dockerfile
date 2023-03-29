FROM node:18-alpine

WORKDIR /app/server

COPY . ./

RUN npm install -g nodemon --silent
RUN npm install --silent
RUN apk add --no-cache bash
RUN npx prisma generate

EXPOSE 5500