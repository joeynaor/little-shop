// TODO: DRY: This piece of code is duplicated in customer-backend. Migrate to an NPM library.
import { Kafka } from 'kafkajs';
import { DataModel } from './model';

const KAFKA_BROKER = (process.env.KAFKA_BROKER === 'host.docker.internal:9092') ? 'localhost:9092' : (process.env.KAFKA_BROKER || 'localhost:9092');
const KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'bought-items';

const kafka = new Kafka({
  clientId: 'api-server',
  brokers: [KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'api-server-group' });

// Start Kafka consumer which awaits to consume messages published by customer-backend
export const startKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic: _topic, partition: _partition, message }) => {
      if (message.value) {
        const receivedMessage = message.value.toString();
        console.log(`Received message: ${receivedMessage}`);
        try {
          const newData = new DataModel({ message: receivedMessage });
          await newData.save();
          console.log('Saved message to MongoDB');
        } catch (error) {
          console.error('Error saving message to MongoDB:', error);
        }
      }
    },
  });
};
