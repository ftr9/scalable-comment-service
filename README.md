# Scalable comment service

Scalable event driven comment system that handles on an average of **7K req/sec** .

### Architecture

<img style="object-fit:contain;" alt="architecture-diagram" src="https://github.com/user-attachments/assets/ecb9c192-650e-46fd-8dd7-40edd58c2d5e" />

### services

1. comment-service (backend)
2. comment-job-processor (backend)
3. notification-service (backend)
4. rabbitmq (message-broker)
5. postgres Sql (database)
6. Prisma (ORM)

### tools

1. auto-cannon (for simulating heavy traffic)
2. nx (monorepo - for reusable logic and utilities)
3. Docker (containerization)

### How all pieces work together ?

1. user send request to comment-service backend continously
2. comment-service acting as a producer sends the event to rabbitMq queue
3. comment-job-processor service which is clustered spawns multiple node processes per CPU cores and also acting as a consumer receives an event from producer i.e comment-service . these consumers per node prefetches about 5k events each as a batch from producer . It then batch write to the database .
4. After batch write is successfull - comment-job-processor sends the events to notification-service each event consists 5k batch written data .
5. notification-service also clustered per CPU cores consumes events from comment-job-processor prefetches 1 events from queue .. each event consiste about 5k data .. notification service then sends the notification to the user about - someone added comment push notification

> NOTE: sending push notification is simulated it does not send real notification - sleep method is used just to simulate sent notification and also in comment-service sleep() method is used to simulate slow DB write .. although it's written to DB slow process is simulated

# Snapshots of testing
