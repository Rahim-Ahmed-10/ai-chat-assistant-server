// Vercel Serverless Entry Point
// This file is the build target for @vercel/node.
// It imports the TypeScript Express app (compiled by @vercel/node internally)
// and exports it so Vercel can invoke it as a serverless function.

const app = require('./src/server');

module.exports = app;
