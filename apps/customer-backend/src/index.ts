import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectKafkaProducer, disconnectKafkaProducer, publishMessage } from './kafka';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/buy', async (req, res) => {
  const { username, userId, price, timestamp, itemName } = req.body;

  if (!username || !userId || !price || !timestamp || !itemName) {
    return res.status(400).send('Missing required fields: username, userId, price, timestamp, itemName');
  }

  const message = {
    username,
    userId,
    price,
    timestamp,
    itemName,
  };

  try {
    await publishMessage(message);
    res.status(200).send('Purchase recorded and sent to Kafka');
  } catch (error) {
    console.error('Failed to publish purchase to Kafka:', error);
    res.status(500).send('Failed to record purchase');
  }
});

const startServer = async () => {
  try {
    await connectKafkaProducer();
    app.listen(port, () => {
      console.log(`Customer server listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

process.on('SIGINT', async () => {
  await disconnectKafkaProducer();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectKafkaProducer();
  process.exit(0);
});
