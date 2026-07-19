import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from './app/routes';

const app: Application = express();

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL // Configure this in Vercel environment variables
].filter(Boolean) as string[];

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application Routes
app.use('/api', router);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'AI Chat Assistant API is running',
  });
});

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'API Route Not Found',
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
module.exports = app; // Required for Vercel Serverless Function export
