// TODO: DRY: This piece of code is duplicated from api-server. Migrate to an NPM library.
import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

const KAFKA_BROKER = (process.env.KAFKA_BROKER === 'host.docker.internal:9092') ? 'localhost:9092' : (process.env.KAFKA_BROKER || 'localhost:9092');
const KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'bought-items';

const kafka = new Kafka({
  clientId: 'customer-server',
  brokers: [KAFKA_BROKER],
});

const producer = kafka.producer();

export const connectKafkaProducer = async () => {
  await producer.connect();
  console.log('Kafka Producer connected');
};

export const disconnectKafkaProducer = async () => {
  await producer.disconnect();
  console.log('Kafka Producer disconnected');
};

export const publishMessage = async (message: any) => {
  try {
    await producer.send({
      topic: KAFKA_TOPIC,
      messages: [
        { value: JSON.stringify(message) },
      ],
    });
    console.log('Message published to Kafka:', message);
  } catch (error) {
    console.error('Error publishing message to Kafka:', error);
  }
};
