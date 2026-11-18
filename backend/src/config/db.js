import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sapphireiq';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected] Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.warn(
      '\n--------------------------------------------------------------------------------\n' +
      '⚠️  MONGODB IS NOT CONNECTED!\n' +
      'To connect to your database:\n' +
      '1. Provide a MongoDB Atlas connection string in `backend/.env`:\n' +
      '   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sapphireiq\n' +
      '2. Or start your local MongoDB service: `mongod`\n' +
      '--------------------------------------------------------------------------------\n'
    );
  }
};

export default connectDB;
