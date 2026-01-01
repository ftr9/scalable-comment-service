FROM node:alpine

WORKDIR /source

COPY . .

RUN npm install

EXPOSE 3001

CMD ["node","apps/comment-service/main.js"]

