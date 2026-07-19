import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from './app/routes';

const app: Application = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application Routes
app.use('/api/v1', router);

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
