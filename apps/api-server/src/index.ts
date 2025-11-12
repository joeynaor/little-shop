import express from 'express';
import cors from 'cors';
import { connectToMongo } from './mongo';
import { startKafkaConsumer } from './kafka';
import { DataModel } from './model';

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

// Fetch bought items from Mongo
app.get('/bought-items', async (_req, res) => {
  try {
    const data = await DataModel.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).send('Error fetching data from MongoDB');
  }
});

async function startServer() {
  await connectToMongo();
  await startKafkaConsumer();

  app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
  });
}

startServer();
