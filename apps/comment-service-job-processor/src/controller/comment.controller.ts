import { ConsumeMessage, MessageBroker, QUEUES } from '@org/backend';
import { addCommentToDB } from '../repository/comment.repository';
import { IComment } from '@org/types';
import { BATCH_SIZE_LIMIT } from '../config';

interface IBatchData {
  rawEvent: ConsumeMessage;
  timeStamp: number;
  parsedContent: Omit<IComment, 'id' | 'created_at' | 'updated_at'>;
}

let batchAdditionCount = 0;

let batchedComments: IBatchData[] = [];

let partialBatchTimeout: NodeJS.Timeout;
const PARTIAL_BATCH_WAIT_TIME_MS = 15000; // 15 second

const _processPartialBatch = async () => {
  try {
    //process the partial batch message

    const channel = MessageBroker.getChannel();

    console.log('Processing partial batch messages');

    const partialBatchEvents = batchedComments.filter(
      (batchComment) =>
        new Date().valueOf() - batchComment.timeStamp >
        PARTIAL_BATCH_WAIT_TIME_MS / 2
    );

    //batch write to DB
    const addedData = await addCommentToDB(
      partialBatchEvents.map((c) => c.parsedContent)
    );
    console.log(
      'Added partial batch data to db total partial batch',
      partialBatchEvents.length
    );

    partialBatchEvents.map((partialBatchEvent) => {
      channel.ack(partialBatchEvent.rawEvent);
      batchedComments.shift();
    });

    console.log('Acknowledged and remove the batch successfully');

    //send to notification service for push notification
    console.log(
      'sent the  partial comments to notification service for sending push notification'
    );
    channel.sendToQueue(
      QUEUES.NOTIFICATION_QUEUE,
      Buffer.from(JSON.stringify(addedData))
    );
  } catch (err) {
    console.log(err);
    console.log('FAILED TO INSERT TO DB');
  }
};

export const handleComment = async (data: ConsumeMessage | null) => {
  const channel = MessageBroker.getChannel();

  if (!data) return;

  try {
    clearTimeout(partialBatchTimeout);
    batchedComments.push({
      parsedContent: JSON.parse(data.content.toString()),
      rawEvent: data,
      timeStamp: new Date().valueOf(),
    });

    const isBatchExecuting = batchedComments.some(
      (batchComment) =>
        new Date().valueOf() - batchComment.timeStamp >
        PARTIAL_BATCH_WAIT_TIME_MS / 2
    );

    if (batchedComments.length >= BATCH_SIZE_LIMIT && !isBatchExecuting) {
      console.log('batch size is reached ...');

      //batch write to DB
      const addedData = await addCommentToDB(
        batchedComments.map((c) => c.parsedContent)
      );

      batchAdditionCount++;

      //empty the batch
      batchedComments = [];

      //acknowledge all the batch message at one
      channel.ackAll();
      console.log('saved successfully and acknowledged the message');
      console.log('total Batch processed', batchAdditionCount);
      console.log(
        'Total events processed',
        batchAdditionCount * BATCH_SIZE_LIMIT
      );

      //send to notification service for push notification
      console.log(
        'sent the  partial comments to notification service for sending push notification'
      );
      channel.sendToQueue(
        QUEUES.NOTIFICATION_QUEUE,
        Buffer.from(JSON.stringify(addedData))
      );

      return;
    }

    partialBatchTimeout = setTimeout(
      _processPartialBatch,
      PARTIAL_BATCH_WAIT_TIME_MS
    );

    console.log(
      'batch size not reached yet ... ',
      'COMMENT_SERVICE_JOB_PROCESSOR'
    );
  } catch (err) {
    console.log('FAILED TO INSERT TO DB');
    console.log(err);
  }
};
