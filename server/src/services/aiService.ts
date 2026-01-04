/**
 * AI Service - Secure API Key Management
 * 
 * This service provides a secure way to access AI APIs (DeepSeek, OpenAI, etc.)
 * while keeping API keys safe and never exposing them to the client.
 * 
 * Security Features:
 * - API keys are only accessed server-side from environment variables
 * - Keys are never sent to the client
 * - Rate limiting can be implemented here
 * - Request validation and sanitization
 */

import axios from 'axios';

// Validate that required environment variables are set
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!DEEPSEEK_API_KEY) {
  console.warn('⚠️  DEEPSEEK_API_KEY is not set in environment variables');
}

if (!OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY is not set in environment variables');
}

/**
 * Interface for AI completion requests
 */
export interface AICompletionRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

/**
 * Interface for AI completion responses
 */
export interface AICompletionResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * DeepSeek AI Service
 * Provides secure access to DeepSeek API
 */
export class DeepSeekService {
  private static readonly API_URL = 'https://api.deepseek.com/v1/chat/completions';
  
  /**
   * Generate a completion using DeepSeek API
   * @param request - The completion request parameters
   * @returns The AI-generated completion
   * @throws Error if API key is not configured or request fails
   */
  static async generateCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
    if (!DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key is not configured. Please set DEEPSEEK_API_KEY in environment variables.');
    }

    // Validate and sanitize input
    if (!request.prompt || request.prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    if (request.prompt.length > 10000) {
      throw new Error('Prompt is too long (max 10000 characters)');
    }

    try {
      const response = await axios.post(
        this.API_URL,
        {
          model: request.model || 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: request.prompt
            }
          ],
          max_tokens: request.maxTokens || 1000,
          temperature: request.temperature || 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}` // API key is only used server-side
          },
          timeout: 30000 // 30 second timeout
        }
      );

      return {
        text: response.data.choices[0].message.content,
        usage: {
          promptTokens: response.data.usage?.prompt_tokens || 0,
          completionTokens: response.data.usage?.completion_tokens || 0,
          totalTokens: response.data.usage?.total_tokens || 0
        }
      };
    } catch (error: any) {
      // Log error without exposing API key
      console.error('DeepSeek API Error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your DeepSeek API key configuration.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error('Failed to generate AI completion. Please try again.');
      }
    }
  }
}

/**
 * OpenAI Service
 * Provides secure access to OpenAI API
 */
export class OpenAIService {
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  
  /**
   * Generate a completion using OpenAI API
   * @param request - The completion request parameters
   * @returns The AI-generated completion
   * @throws Error if API key is not configured or request fails
   */
  static async generateCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in environment variables.');
    }

    // Validate and sanitize input
    if (!request.prompt || request.prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    if (request.prompt.length > 10000) {
      throw new Error('Prompt is too long (max 10000 characters)');
    }

    try {
      const response = await axios.post(
        this.API_URL,
        {
          model: request.model || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: request.prompt
            }
          ],
          max_tokens: request.maxTokens || 1000,
          temperature: request.temperature || 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}` // API key is only used server-side
          },
          timeout: 30000 // 30 second timeout
        }
      );

      return {
        text: response.data.choices[0].message.content,
        usage: {
          promptTokens: response.data.usage?.prompt_tokens || 0,
          completionTokens: response.data.usage?.completion_tokens || 0,
          totalTokens: response.data.usage?.total_tokens || 0
        }
      };
    } catch (error: any) {
      // Log error without exposing API key
      console.error('OpenAI API Error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key configuration.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error('Failed to generate AI completion. Please try again.');
      }
    }
  }
}

/**
 * Unified AI Service
 * Provides a single interface to access multiple AI providers
 */
export class AIService {
  /**
   * Generate a completion using the specified AI provider
   * @param provider - The AI provider to use ('deepseek' or 'openai')
   * @param request - The completion request parameters
   * @returns The AI-generated completion
   */
  static async generateCompletion(
    provider: 'deepseek' | 'openai',
    request: AICompletionRequest
  ): Promise<AICompletionResponse> {
    switch (provider) {
      case 'deepseek':
        return DeepSeekService.generateCompletion(request);
      case 'openai':
        return OpenAIService.generateCompletion(request);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }
}
