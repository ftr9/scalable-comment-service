# Scalable Event Driven Comment Service

This repository demonstrates designing and testing a **high throughput, event driven backend system** for handling comments at scale.

The primary goal of this project is to explore **system design, message queues, batching strategies, and backend scalability** under heavy load .

On a single machine, the system handles **~7,000 requests per second on average** by decoupling user requests from expensive operations like database writes and notifications.

---

## Why this project exists

Many backend systems struggle under load because everything happens synchronously.

This project was built to explore:

- Handling high write throughput without blocking APIs
- Using message queues to decouple services
- Batch processing to improve database performance
- Backpressure and flow control using prefetch limits
- Scaling consumers using Node.js clustering

The focus is on **architecture and behavior under stress**, not business logic.

---

## High level architecture

![Architecture Diagram](https://github.com/user-attachments/assets/ecb9c192-650e-46fd-8dd7-40edd58c2d5e)

---

## Core services

- **comment-service**  
  Accepts user requests and publishes comment events to RabbitMQ.

- **comment-job-processor**  
  Consumes comment events in large batches and performs efficient database writes.

- **notification-service**  
  Processes completed batches and simulates sending push notifications.

- **RabbitMQ**  
  Message broker used to decouple services and manage backpressure.

- **PostgreSQL**  
  Persistent storage for comments.

- **Prisma**  
  ORM used for database access.

---

## Event flow

1. User sends requests continuously to `comment-service`
2. `comment-service` publishes events to RabbitMQ
3. `comment-job-processor` consumes events in batches (prefetch ~5,000)
4. Batched comments are written to the database
5. Successfully written batches are published to `notification-service`
6. `notification-service` processes one batch at a time and simulates notifications

Artificial delays are added to simulate slow database writes and notification delivery.

---

## Load testing

Traffic is simulated using **autocannon** to validate system behavior under heavy load.

### Simulating high traffic

![Autocannon traffic simulation](https://github.com/user-attachments/assets/e2ab95c0-a9a1-4b65-945c-8b8036a726ea)

---

## Queue behavior under load

### Comment queue filling up

![Comment queue filling up](https://github.com/user-attachments/assets/f51b0a31-4e1a-420b-9408-f7c0b0338b8b)

### Notification queue receiving batched events

![Notification queue](https://github.com/user-attachments/assets/203a0883-e493-4726-b7f2-f74b9be3c344)

---

## Worker scaling

Both `comment-job-processor` and `notification-service` are clustered and scale across CPU cores.

Below is a snapshot of multiple worker processes connected to RabbitMQ on an 8-core machine.

![Clustered services](https://github.com/user-attachments/assets/d70263d8-11c9-4475-9ea0-4d9a99b9d1f0)

---

## Database results

Batched inserts significantly reduce write pressure on the database.

![Comments table snapshot](https://github.com/user-attachments/assets/be34a47d-e428-4ff2-9ae4-a461eabafa0c)

---

## What this project is not

- No authentication or authorization
- No UI or frontend
- No cloud specific tuning

This is a **experimentation project** focused purely on backend scalability.

# Setup Guide

This guide walks you through running the project locally, verifying services, and testing the event flow using RabbitMQ.

---

## 1. Prerequisites

Make sure you have the following installed on your machine:

- Docker
- Node.js

---

## 2. Clone the Repository

```bash
git clone https://github.com/ftr9/scalable-comment-service.git
```

## 3. Start Docker

Ensure Docker is running on your system before proceeding

## 4. Build and Start All Services

Run the following command to build images and start all containers:

```bash
docker compose up --build
```

## 5. Open the API

Once all services are up, open the API endpoint in your browser:

```bash
http://localhost:3001/api
```

## 6. Verify Service Logs

Check the logs of the following services:

- comment-service-job-processor
- notification-service

You should see successful startup and processing logs similar to the screenshot below.

If everything is working correctly, there should be no error logs.

## 7. Install Autocannon and Run Load Script

Install Autocannon globally using npm:

```bash
npm install -g autocannon
```

Then run the producer simulation script located here:

https://github.com/ftr9/scalable-comment-service/blob/main/apps/comment-service/src/scripts/simulate-producer-event.sh

This script generates events and pushes them into the system.

## 8. Check Events in RabbitMQ Dashboard

After running the script, open the RabbitMQ management dashboard:

```bash
http://localhost:15672
```

From the dashboard, you can inspect queues, exchanges, and verify that events are being published and consumed correctly.
