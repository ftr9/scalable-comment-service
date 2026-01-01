import app from './app';

import {
  MESSAGE_BROKER_CONNECTION_URI,
  MessageBroker,
  QUEUES,
} from '@org/backend';

(async () => {
  try {
    const messageBroker = await new MessageBroker();
    await messageBroker.connect(MESSAGE_BROKER_CONNECTION_URI);

    const channel = await messageBroker.createChannel();
    channel.assertQueue(QUEUES.COMMENT_QUEUE, { durable: true });

    const port = process.env.PORT || 3001;
    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });
    server.on('error', console.error);
  } catch (err) {
    console.log(err);
  }
})();
