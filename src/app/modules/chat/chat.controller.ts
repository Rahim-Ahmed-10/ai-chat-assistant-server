import { Request, Response, NextFunction } from 'express';
import { ChatService } from './chat.service';

export interface ChatRequestBody {
  prompt: string;
}

const processChat = async (req: Request<{}, {}, ChatRequestBody>, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id;
    const { prompt } = req.body;

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Dummy functions for now as we removed SSE status/navigation pushes
    const onStatus = (message: string) => {};
    const onNavigate = (route: string) => {};

    const result = await ChatService.processChat(userId, prompt, onStatus, onNavigate);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Gemini Error Logs:", error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process chat',
    });
  }
};

export const ChatController = {
  processChat,
};
