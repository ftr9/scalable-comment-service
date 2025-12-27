FROM node:alpine

WORKDIR /source

COPY . .

RUN npm install

RUN npx nx build comment-service

EXPOSE 3001

CMD ["node","apps/comment-service/dist/main.js"]

