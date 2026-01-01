import app from './app';

import {
  MessageBroker,
  MESSAGE_BROKER_CONNECTION_URI,
  QUEUES,
} from '@org/backend';
import { BATCH_SIZE_LIMIT } from './config';
import { handleNotification } from './controller/notification.controller';

import cluster from 'cluster';
import os from 'node:os';

const startApp = async () => {
  const messageBroker = new MessageBroker();
  await messageBroker.connect(MESSAGE_BROKER_CONNECTION_URI);

  const channel = await messageBroker.createChannel();
  channel.assertQueue(QUEUES.NOTIFICATION_QUEUE, { durable: true });
  channel.prefetch(BATCH_SIZE_LIMIT);
  channel.consume(QUEUES.NOTIFICATION_QUEUE, handleNotification, {
    noAck: false,
  });

  const port = process.env.PORT || 3003;
  const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/api`);
  });
  server.on('error', console.error);
};

if (cluster.isPrimary) {
  console.log('Main process started');
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
} else {
  console.log(process.pid, '\n');
  startApp();
}
