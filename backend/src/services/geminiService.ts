import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  /**
   * Send a message to Gemini and get a response
   */
  async chat(messages: Array<{ role: string; content: string }>) {
    try {
      const chat = this.model.startChat({
        history: messages.map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      });

      const userMessage = messages[messages.length - 1]?.content;
      if (!userMessage) {
        throw new Error('No user message provided');
      }

      const response = await chat.sendMessage(userMessage);
      const responseText = response.response.text();

      return {
        success: true,
        content: responseText,
        tokensUsed: (response.response as any).usageMetadata || null,
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Stream a message to Gemini (for real-time responses)
   */
  async *streamChat(messages: Array<{ role: string; content: string }>) {
    try {
      const chat = this.model.startChat({
        history: messages
          .slice(0, -1)
          .map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          })),
      });

      const userMessage = messages[messages.length - 1]?.content;
      if (!userMessage) {
        throw new Error('No user message provided');
      }

      const stream = await chat.sendMessageStream(userMessage);

      for await (const chunk of stream.stream) {
        const text = chunk.text();
        if (text) {
          yield text;
        }
      }
    } catch (error) {
      console.error('Gemini streaming error:', error);
      yield `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  /**
   * Generate text with a custom prompt
   */
  async generate(prompt: string) {
    try {
      const response = await this.model.generateContent(prompt);
      const responseText = response.response.text();

      return {
        success: true,
        content: responseText,
      };
    } catch (error) {
      console.error('Gemini generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const geminiService = new GeminiService();
