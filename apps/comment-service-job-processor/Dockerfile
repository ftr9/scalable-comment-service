FROM node:alpine

WORKDIR /source

COPY . .

RUN npm install

RUN npx nx build comment-service-job-processor

WORKDIR /source/apps/comment-service-job-processor

EXPOSE 3333

WORKDIR /source/apps/comment-service-job-processor/dist

CMD ["npm","start"]

