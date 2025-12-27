import app from './app';

import { MessageBroker } from '@org/backend';

(async () => {
  try {
    const messageBroker = await new MessageBroker();
    await messageBroker.connect('amqp://user:password@localhost:5672');

    const channel = await messageBroker.createChannel();
    channel.assertQueue('hello', { durable: false });

    const port = process.env.PORT || 3001;
    const server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/api`);
    });
    server.on('error', console.error);
  } catch (err) {
    console.log(err);
  }
})();
