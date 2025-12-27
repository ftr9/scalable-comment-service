import amqp from 'amqplib';

let isConnected = false;
let channel: amqp.Channel | null = null;

export class MessageBroker {
  private connection: amqp.ChannelModel | null = null;

  /**
   *
   * @param connectionUrl
   * @returns Creates connection with message broker
   */
  async connect(connectionUrl: string) {
    if (isConnected) throw new Error('message broker is already connected');

    this.connection = await amqp.connect(connectionUrl);
    isConnected = true;
    console.log('Connected to MessageBroker successfully');
    return this.connection;
  }

  async createChannel() {
    if (!isConnected)
      throw new Error(
        'Message brokwer is not connected please call connect() method first'
      );

    channel = await this.connection!.createChannel();
    return channel;
  }

  static getChannel() {
    if (!channel)
      throw new Error(
        'Channel is notcreated . please call createChannel() method first'
      );

    return channel;
  }
}
