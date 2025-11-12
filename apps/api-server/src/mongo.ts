import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/little-shop';
const MONGO_USERNAME = process.env.MONGO_USERNAME || 'mongouser';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'secret';

export const connectToMongo = async () => {
  try {
    const options: mongoose.ConnectOptions = {
      authSource: 'admin',
    };
    if (MONGO_USERNAME && MONGO_PASSWORD) {
      options.user = MONGO_USERNAME;
      options.pass = MONGO_PASSWORD;
    }

    await mongoose.connect(MONGO_URI, options);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
