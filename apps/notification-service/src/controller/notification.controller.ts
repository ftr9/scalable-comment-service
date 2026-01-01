import { ConsumeMessage } from '@org/backend';
import { sendPushNotification } from '../service/send-push-notification';
import { MessageBroker } from '@org/backend';
import { IComment } from '@org/types';

export const handleNotification = async (data: ConsumeMessage | null) => {
  console.log('Received at notification service\n\n');
  const channel = MessageBroker.getChannel();

  if (!data) return;

  const parsedContent = JSON.parse(data.content.toString()) as IComment[];

  console.log('notification payload', parsedContent.length);
  await sendPushNotification(parsedContent);
  channel.ack(data);
  console.log('successfully send notification and acknowledged the message ');
};
