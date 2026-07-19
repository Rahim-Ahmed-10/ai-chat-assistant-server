import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server } from 'http';

let server: Server;
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const mongoUri = config.database_url;
  if (!mongoUri) {
    console.warn('⚠️ WARNING: DATABASE_URL is missing. Skipping DB connect.');
    return;
  }
  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('🛢️ Connected to MongoDB successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
  }
};

// Vercel Serverless Wrapper: Ensure DB is connected per request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Conditionally start the server listener ONLY if not in Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  async function main() {
    await connectDB();
    server = app.listen(config.port, () => {
      console.log(`🚀 Server is listening on port ${config.port} (Local)`);
    });
  }
  main();
}

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection detected, shutting down server...', err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception detected, shutting down server...', err);
  process.exit(1);
});

// Export app for Vercel Serverless Function consumption
export default app;
module.exports = app;

