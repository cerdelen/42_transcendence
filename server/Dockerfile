FROM node:18-alpine

WORKDIR /app/server

COPY . ./

# RUN npm install -g nodemon --silent
RUN npm install --silent
RUN apk add --no-cache bash
RUN npx prisma generate
RUN chmod 777 start.sh

EXPOSE 5500