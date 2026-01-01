import { IComment } from '@org/types';

const sleep = (duration = 5000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, duration);
  });
};

export const sendPushNotification = async (content: IComment[]) => {
  await sleep();
  console.log('successfully sent push notification');
  return true;
};
