const mongoose = require('mongoose');
require('dotenv').config();

// Export the Express App instance from our compiled TypeScript build
const app = require('./dist/app').default;

// Vercel Serverless Function Database Connection Wrapper
let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected && process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
      console.log('✅ Connected to MongoDB via Vercel Serverless Function');
    } catch (err) {
      console.error('❌ MongoDB Connection Error:', err);
    }
  }
  next();
});

// Vercel requires exporting the express app directly (not listening on a port)
module.exports = app;
