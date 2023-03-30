FROM node:18-alpine3.16

WORKDIR /app/client

COPY . ./

RUN npm install --silent

EXPOSE 3000

CMD ["npm","start"]