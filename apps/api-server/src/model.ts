import mongoose from 'mongoose';

interface IData extends mongoose.Document {
  message: string;
  createdAt: Date;
}

const DataSchema = new mongoose.Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const DataModel = mongoose.model<IData>('Data', DataSchema);
