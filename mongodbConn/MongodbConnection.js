import mongoose from 'mongoose';

const DATABASE_NAME = 'cs193x_assign3';
const DATABASE_URL = 'mongodb://localhost:27017/' + DATABASE_NAME;

const connectDb = async () => {
  try {
    await mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Connected to MongoDB, using database "${DATABASE_NAME}"`);
    return mongoose.connection;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

export default connectDb;