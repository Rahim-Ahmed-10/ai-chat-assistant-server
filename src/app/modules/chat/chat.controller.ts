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

    const result = await ChatService.processChat(userId, prompt);

    res.status(200).json({
      success: true,
      message: 'Chat processed successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process chat',
    });
  }
};

export const ChatController = {
  processChat,
};
