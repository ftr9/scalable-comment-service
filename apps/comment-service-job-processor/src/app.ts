import express from 'express';
import path from 'node:path';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to comment-service-job-processor!' });
});

export default app;
