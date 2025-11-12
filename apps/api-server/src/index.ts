import express from 'express';
import { connectToMongo } from './mongo';
import { startKafkaConsumer } from './kafka';
import { DataModel } from './model';

const app = express();
const port = process.env.PORT || 3000;

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
