import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    if (!config.database_url) {
      console.warn('⚠️ WARNING: DATABASE_URL is not defined in environment variables. Connect call might fail.');
    }
    
    // We only connect if URL is available (prevent immediate crash if .env isn't fully configured by user yet)
    if (config.database_url) {
      await mongoose.connect(config.database_url);
      console.log('🛢️ Connected to MongoDB successfully');
    }

    server = app.listen(config.port, () => {
      console.log(`🚀 Server is listening on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to connect database', err);
    process.exit(1);
  }
}

main();

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
