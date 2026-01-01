export enum QUEUES {
  COMMENT_QUEUE = 'comment-queue',
  NOTIFICATION_QUEUE = 'notification-queue',
}

export const MESSAGE_BROKER_CONNECTION_URI =
  'amqp://user:password@rabbitmq:5672';
