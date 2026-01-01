import express from 'express';
import path from 'node:path';
import { MessageBroker, QUEUES, httpLogger } from '@org/backend';
import { generateCommentData } from './utils/comment';

const app = express();

app.use(httpLogger());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  try {
    const channel = MessageBroker.getChannel();

    const commentData = generateCommentData('qwert-yuiop');
    channel.sendToQueue(
      QUEUES.COMMENT_QUEUE,
      Buffer.from(JSON.stringify(commentData))
    );

    res.send({ status: 200, content: commentData });
  } catch (err) {
    console.log(err);
    res.send({
      status: 'fail',
      message: 'something went wrong',
    });
  }
});

export default app;
