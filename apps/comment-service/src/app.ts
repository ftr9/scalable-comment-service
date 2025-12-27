import express from 'express';
import path from 'node:path';
import { MessageBroker } from '@org/backend';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  const channel = MessageBroker.getChannel();

  channel.sendToQueue('hello', Buffer.from('Hello world'));

  res.send({ message: 'Welcome to comment-service!' });
});

export default app;
