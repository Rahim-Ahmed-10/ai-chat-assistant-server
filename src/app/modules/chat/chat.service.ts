import { ChatMessage } from './chat.model';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config';

const genAI = new GoogleGenerativeAI(config.gemini_api_key);

const processChat = async (userId: string, prompt: string) => {
  if (!config.gemini_api_key) {
    throw new Error('Gemini API key is not configured.');
  }

  // 1. Fetch user's chat history for context (last 20 messages)
  const history = await ChatMessage.find({ userId })
    .sort({ createdAt: 1 })
    .limit(20);

  // Format history for Gemini API
  const formattedHistory = history.map((msg) => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.message }],
  }));

  // 2. Initialize Gemini Model (Using gemini-1.5-flash for speed/chat)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // 3. Start Chat Session
  const chat = model.startChat({
    history: formattedHistory,
  });

  // 4. Send Message to Gemini
  const result = await chat.sendMessage(prompt);
  const aiResponse = result.response.text();

  // 5. Save User Message
  await ChatMessage.create({
    userId,
    role: 'user',
    message: prompt,
  });

  // 6. Save AI Response
  const aiMessage = await ChatMessage.create({
    userId,
    role: 'model',
    message: aiResponse,
  });

  return aiMessage;
};

export const ChatService = {
  processChat,
};
