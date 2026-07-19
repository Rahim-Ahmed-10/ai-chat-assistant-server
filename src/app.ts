import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from './app/routes';

const app: Application = express();

// Middlewares
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (e.g., Postman, server-to-server)
    if (!origin) return callback(null, true);

    const allowedPatterns = [
      /^http:\/\/localhost:\d+$/,           // any localhost port
      /^https:\/\/.*\.vercel\.app$/,        // any *.vercel.app domain
    ];

    const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin));
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// Explicitly handle OPTIONS preflight for all routes
app.options('*', cors(corsOptions));
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
