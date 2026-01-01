import express from 'express';
import path from 'node:path';
import { httpLogger } from '@org/backend';

const app = express();

app.use(httpLogger());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to notification service' });
});

export default app;
