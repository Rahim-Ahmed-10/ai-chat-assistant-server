import { Request, Response, NextFunction } from 'express';
import { ChatService } from './chat.service';

export interface ChatRequestBody {
  prompt: string;
}

const processChat = async (req: Request<{}, {}, ChatRequestBody>, res: Response, next: NextFunction) => {
  // Set headers for Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const userId = req.user?._id;
    const { prompt } = req.body;

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const onStatus = (message: string) => {
      res.write(`data: ${JSON.stringify({ type: 'status', message })}\n\n`);
    };

    const onNavigate = (route: string) => {
      res.write(`data: ${JSON.stringify({ type: 'navigation', route })}\n\n`);
    };

    const result = await ChatService.processChat(userId, prompt, onStatus, onNavigate);

    res.write(`data: ${JSON.stringify({ type: 'result', data: result })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error("Gemini Error Logs:", error);
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message || 'Failed to process chat' })}\n\n`);
    res.end();
  }
};

export const ChatController = {
  processChat,
};
