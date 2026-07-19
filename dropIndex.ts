import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected. Attempting to drop "username_1" index from "users" collection...');
    
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database connection failed");
    
    const usersCollection = db.collection('users');
    
    try {
      await usersCollection.dropIndex('username_1');
      console.log('✅ Successfully dropped the legacy "username_1" index.');
    } catch (err: any) {
      if (err.message.includes('index not found')) {
        console.log('✅ Index "username_1" was not found (already dropped or never existed).');
      } else {
        console.error('❌ Failed to drop index:', err.message);
      }
    }
    
    await mongoose.disconnect();
    console.log('Disconnected. Operation complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
