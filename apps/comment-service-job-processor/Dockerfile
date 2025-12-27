FROM node:alpine

WORKDIR /source

COPY . .

RUN npm install

RUN npx nx build comment-service-job-processor

EXPOSE 3333

CMD ["node","apps/comment-service-job-processor/dist/main.js"]

