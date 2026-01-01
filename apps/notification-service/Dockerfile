FROM node:alpine

WORKDIR /source

COPY . .

RUN npm install

RUN npx nx build notification-service

EXPOSE 3003

CMD ["node","apps/notification-service/dist/main.js"]

