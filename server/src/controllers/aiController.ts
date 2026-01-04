
/**
 * AI Controller - Refactored for Security
 * 
 * Uses the secure AIService to ensure API keys are never exposed
 * All API calls go through the centralized service layer
 */

import { Request, Response } from 'express';
import { DeepSeekService } from '../services/aiService';

/**
 * Check and improve tone of text for professional communication
 * POST /api/ai/check-tone
 */
export const checkTone = async (req: Request, res: Response) => {
    try {
        const { text } = req.body;

        if (!text) {
            res.status(400).json({ error: 'Text is required' });
            return;
        }

        // Check if API key is configured
        if (!process.env.DEEPSEEK_API_KEY) {
            console.warn("DEEPSEEK_API_KEY not found, using mock.");
            const professionalVersion = `[Mock AI] ${text} (Details verified).`;
            await new Promise(resolve => setTimeout(resolve, 800));
            res.json({ original: text, result: professionalVersion });
            return;
        }

        // Use secure AI service - API key is handled internally
        const prompt = `You are a helpful assistant for a field service technician. Rewrite the following text to be professional, polite, and concise for a customer invoice or job note.\n\nText: ${text}`;
        
        const result = await DeepSeekService.generateCompletion({
            prompt,
            temperature: 0.7,
            maxTokens: 500
        });

        res.json({
            original: text,
            result: result.text.trim()
        });

    } catch (error: any) {
        console.error('AI Tone Check Error:', error.message);
        res.status(500).json({ error: error.message || 'Failed to process text with AI' });
    }
};

/**
 * Chat with Cerebro AI assistant
 * POST /api/ai/chat
 */
export const chat = async (req: Request, res: Response) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            res.status(400).json({ error: 'Messages array is required' });
            return;
        }

        // Check if API key is configured
        if (!process.env.DEEPSEEK_API_KEY) {
            const mockResponse = "I'm Cerebro, your AI assistant. (DeepSeek API Key missing, showing mock response).";
            await new Promise(resolve => setTimeout(resolve, 1000));
            res.json({ result: mockResponse });
            return;
        }

        // Build conversation prompt from messages
        const systemPrompt = "You are Cerebro, the intelligent operations brain for ServiceTagger. You help dispatchers with scheduling, technician management, and business insights. Be concise, professional, and helpful.";
        
        const conversationText = messages.map((msg: any) => {
            return `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`;
        }).join('\n');

        const prompt = `${systemPrompt}\n\n${conversationText}\n\nAssistant:`;

        // Use secure AI service - API key is handled internally
        const result = await DeepSeekService.generateCompletion({
            prompt,
            temperature: 0.7,
            maxTokens: 1000
        });

        res.json({ result: result.text });

    } catch (error: any) {
        console.error('AI Chat Error:', error.message);
        res.status(500).json({ error: error.message || 'Failed to process chat' });
    }
};

/**
 * Health check for AI services
 * GET /api/ai/health
 */
export const checkHealth = async (req: Request, res: Response) => {
    const health = {
        deepseek: {
            configured: !!process.env.DEEPSEEK_API_KEY,
            status: process.env.DEEPSEEK_API_KEY ? 'ready' : 'not configured'
        },
        openai: {
            configured: !!process.env.OPENAI_API_KEY,
            status: process.env.OPENAI_API_KEY ? 'ready' : 'not configured'
        }
    };

    res.status(200).json({
        success: true,
        data: health
    });
};
