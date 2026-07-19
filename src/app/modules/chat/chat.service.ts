import { ChatMessage } from './chat.model';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config';

const genAI = new GoogleGenerativeAI(config.gemini_api_key);

const getSystemStatusData = () => {
  return {
    status: "online",
    activeModels: ["gemini-1.5-flash", "gemini-1.5-pro"],
    serverLoad: "32%",
    lastIncident: "None in the last 30 days",
  };
};

const processChat = async (userId: string, prompt: string, onStatus: (msg: string) => void, onNavigate: (route: string) => void) => {
  if (!config.gemini_api_key) {
    throw new Error('Gemini API key is not configured.');
  }

  onStatus("Analyzing context and intent...");

  // 1. Fetch user's chat history for memory context (last 10 messages)
  const history = await ChatMessage.find({ userId })
    .sort({ createdAt: 1 })
    .limit(10);

  // Format history for Gemini API
  const formattedHistory = history.map((msg) => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.message }],
  }));

  // 2. Initialize Gemini Model with Tool Declaration and System Instruction
  const tools = [{
    functionDeclarations: [
      {
        name: "getSystemStatus",
        description: "Check the current platform server status, memory load, and active models. Use this when the user asks about system health, status, or server load.",
      },
      {
        name: "navigateToRoute",
        description: "Navigate the user to a different page within the application. Call this tool when the user asks to go to a different page or section.",
        parameters: {
          type: "OBJECT",
          properties: {
            route: {
              type: "STRING",
              description: "The exact absolute route path to navigate to, e.g., '/app/recommendations', '/items/manage', '/explore', '/app/content-generator'.",
            },
          },
          required: ["route"],
        },
      }
    ]
  }];

  const systemInstruction = `You are the core AI Chat Assistant for this web application. 
Your capabilities: Answer questions, assist with navigation, understand context, and perform reasoning.
Available Application Routes:
- Home / Landing: /
- Dashboard / Overview: /app
- AI Chat Assistant: /app/chat
- AI Content Generator: /app/content-generator
- AI Smart Recommendations: /app/recommendations
- AI Data Analyzer: /app/data-analyzer
- Auto Classifier: /app/classifier
- Image Understanding / Vision: /app/image-understanding
- Manage Items: /items/manage
- Add Item: /items/add
- Explore / Listing: /explore

If the user asks to navigate, go to, open, or switch to a specific page or tool, immediately call the navigateToRoute tool with the exact route path.

CRITICAL REQUIREMENT: At the very end of EVERY text response, you MUST provide 2-3 suggested follow-up prompts for the user to ask next. You MUST format this exactly using a Markdown section starting with "### Suggested Prompts:" followed by a simple bulleted list of short prompt strings. DO NOT wrap the bullet strings in quotes.`;

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    tools,
    systemInstruction
  });

  // 3. Start Chat Session
  const chat = model.startChat({
    history: formattedHistory,
  });

  // 4. Send Message to Gemini
  let result = await chat.sendMessage(prompt);
  let finalResponseText = '';

  // 5. Handle potential function calls
  const functionCalls = result.response.functionCalls();
  if (functionCalls && functionCalls.length > 0) {
    const call = functionCalls[0];
    
    if (call.name === 'getSystemStatus') {
      onStatus("AI Agent executing tool: getSystemStatus...");
      const apiResponse = getSystemStatusData();
      result = await chat.sendMessage([{
        functionResponse: {
          name: 'getSystemStatus',
          response: apiResponse
        }
      }]);
    } else if (call.name === 'navigateToRoute') {
      const routeArg = (call.args as any).route;
      if (routeArg) {
        onStatus(`AI Agent executing tool: navigating to ${routeArg}...`);
        onNavigate(routeArg);
        
        result = await chat.sendMessage([{
          functionResponse: {
            name: 'navigateToRoute',
            response: { success: true, navigatedTo: routeArg }
          }
        }]);
      }
    }
  }

  finalResponseText = result.response.text();

  // 6. Save User Message
  await ChatMessage.create({
    userId,
    role: 'user',
    message: prompt,
  });

  // 7. Save AI Response
  const aiMessage = await ChatMessage.create({
    userId,
    role: 'model',
    message: finalResponseText,
  });

  return aiMessage;
};

export const ChatService = {
  processChat,
};
