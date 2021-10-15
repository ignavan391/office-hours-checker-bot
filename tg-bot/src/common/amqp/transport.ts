import * as amqp from 'amqplib';
import config from '../config';
import logger from '../logger';
import { DatesApiQueueName } from './constants';

export class AMQPTransport {
  private connection!: amqp.Connection;
  private channel!: amqp.Channel;

  async init() {
    const hostname = config.rabbitmq.host;
    const port = config.rabbitmq.port;
    this.connection = await amqp.connect({ hostname, port });
    this.connection.on('error', async (err) => {
      logger.error({
        level: 'error',
        message: 'Connection AMQP error',
      });
      await this.connection.close();
      throw new err();
    });

    const channel = await this.connection.createChannel();
    channel.assertQueue(DatesApiQueueName);
  }

  getChannel() {
    return this.channel;
  }

  getConnection() {
    return this.connection;
  }
}

const ampqConnection = new AMQPTransport();
ampqConnection.init();

export default ampqConnection;
