
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

/**
 * AI Scheduling Suggestions
 * POST /api/ai/schedule-suggestions
 */
export const getSchedulingSuggestions = async (req: Request, res: Response) => {
    try {
        const { jobDescription, location, urgency } = req.body;

        if (!process.env.DEEPSEEK_API_KEY) {
            // Mock Fallback
            const mockSuggestions = [
                { slot: 'Tomorrow, 8:00 AM', reason: 'Technician in area', score: 95 },
                { slot: 'Tomorrow, 2:00 PM', reason: 'High urgency slot available', score: 88 },
                { slot: 'Wednesday, 10:00 AM', reason: 'Standard availablity', score: 70 }
            ];
            await new Promise(resolve => setTimeout(resolve, 600));
            res.json({ suggestions: mockSuggestions });
            return;
        }

        const prompt = `Based on the following job details, suggest 3 optimal scheduling slots for a field technician.
        Job: ${jobDescription}
        Location: ${location}
        Urgency: ${urgency}
        
        Consider travel time optimization and urgency. Format as JSON list of objects with keys: slot, reason, score.`;

        const result = await DeepSeekService.generateCompletion({
            prompt,
            temperature: 0.5,
            maxTokens: 500
        });

        // Attempt to parse JSON from AI, or fallback
        try {
            const parsed = JSON.parse(result.text);
            res.json({ suggestions: parsed });
        } catch (e) {
            res.json({ result: result.text, note: "Raw text returned" });
        }
    } catch (error: any) {
        console.error('AI Schedule Error:', error.message);
        res.status(500).json({ error: 'Failed to generate schedule suggestions' });
    }
};

/**
 * AI Parts Prediction
 * POST /api/ai/predict-parts
 */
export const predictParts = async (req: Request, res: Response) => {
    try {
        const { jobDescription } = req.body;

        if (!process.env.DEEPSEEK_API_KEY) {
            const mockParts = [
                { name: 'Universal Capacitor', probability: 'High' },
                { name: 'Contactor 2-Pole', probability: 'Medium' },
                { name: 'Refrigerant R-410A', probability: 'Low' }
            ];
            await new Promise(resolve => setTimeout(resolve, 600));
            res.json({ parts: mockParts });
            return;
        }

        const prompt = `Predict necessary HVAC/Plumbing parts for this job description: "${jobDescription}". Return valid JSON array of objects {name, probability}.`;

        const result = await DeepSeekService.generateCompletion({
            prompt,
            temperature: 0.3,
            maxTokens: 300
        });

        try {
            const parsed = JSON.parse(result.text);
            res.json({ parts: parsed });
        } catch (e) {
            res.json({ parts: [], raw: result.text });
        }

    } catch (error: any) {
        res.status(500).json({ error: 'Failed to predict parts' });
    }
};

/**
 * AI Auto-Draft Estimate
 * POST /api/ai/draft-estimate
 */
export const draftEstimate = async (req: Request, res: Response) => {
    try {
        const { customerRequest } = req.body;

        if (!process.env.DEEPSEEK_API_KEY) {
            const mockEstimate = {
                items: [
                    { description: 'Service Call / Diagnostic', price: 89.00 },
                    { description: 'Labor (Estimated 2h)', price: 170.00 },
                    { description: 'Standard Parts Kit', price: 45.00 }
                ],
                total: 304.00,
                notes: 'Generated draft based on request.'
            };
            await new Promise(resolve => setTimeout(resolve, 800));
            res.json({ estimate: mockEstimate });
            return;
        }

        const prompt = `Create a professional job estimate based on this customer request: "${customerRequest}". Return JSON with 'items' array ({description, price}) and 'total'.`;

        const result = await DeepSeekService.generateCompletion({
            prompt,
            temperature: 0.5,
            maxTokens: 600
        });

        try {
            const parsed = JSON.parse(result.text);
            res.json({ estimate: parsed });
        } catch (e) {
            res.json({ estimate: null, raw: result.text });
        }

    } catch (error: any) {
        res.status(500).json({ error: 'Failed to draft estimate' });
    }
};
