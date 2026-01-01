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

### Tools

1. auto-cannon (for simulating heavy traffic)
2. nx (monorepo - for reusable logic and utilities)

<img width="1177" height="514" alt="Screenshot 2026-01-01 at 21 36 33" src="https://github.com/user-attachments/assets/882e2c62-d885-49bc-8a11-edcb39533c85" />

3. Docker (containerization)

### How all pieces work together ?

1. user send request to comment-service backend continously
2. comment-service acting as a producer sends the event to rabbitMq queue
3. comment-job-processor service which is clustered spawns multiple node processes per CPU cores and also acting as a consumer receives an event from producer i.e comment-service . these consumers per node prefetches about 5k events each as a batch from producer . It then batch write to the database .
4. After batch write is successfull - comment-job-processor sends the events to notification-service each event consists 5k batch written data .
5. notification-service also clustered per CPU cores consumes events from comment-job-processor prefetches 1 events from queue .. each event consiste about 5k data .. notification service then sends the notification to the user about - someone added comment push notification

> NOTE: sending push notification is simulated it does not send real notification - sleep method is used just to simulate sent notification and also in comment-service sleep() method is used to simulate slow DB write .. although it's written to DB slow process is simulated

# Snapshots of test

### Simulating traffic with auto-cannon
<img width="628" height="310" alt="Screenshot 2026-01-01 at 20 37 58" src="https://github.com/user-attachments/assets/e2ab95c0-a9a1-4b65-945c-8b8036a726ea" />
ing

### Comment queue filling up with events
<img width="732" height="905" alt="Screenshot 2026-01-01 at 20 38 48" src="https://github.com/user-attachments/assets/f51b0a31-4e1a-420b-9408-f7c0b0338b8b" />

### Notification queue getting events from comment-job-processor
<img width="738" height="907" alt="Screenshot 2026-01-01 at 20 39 16" src="https://github.com/user-attachments/assets/203a0883-e493-4726-b7f2-f74b9be3c344" />

### Clustered backend (comment-job-processor and notification-service) connected to rabbitmq - my current PC have 8 cores 
<img width="765" height="895" alt="Screenshot 2026-01-01 at 20 44 19" src="https://github.com/user-attachments/assets/d70263d8-11c9-4475-9ea0-4d9a99b9d1f0" />

### DB snapshot at comments table 
<img width="766" height="664" alt="Screenshot 2026-01-01 at 20 45 08" src="https://github.com/user-attachments/assets/be34a47d-e428-4ff2-9ae4-a461eabafa0c" />


