"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chat = exports.checkTone = void 0;
const axios_1 = __importDefault(require("axios"));
const checkTone = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ error: 'Text is required' });
            return;
        }
        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
            // Fallback to Mock if no key (or log warning)
            console.warn("DEEPSEEK_API_KEY not found, using mock.");
            const professionalVersion = `[Mock AI] ${text} (Details verified).`;
            await new Promise(resolve => setTimeout(resolve, 800));
            res.json({ original: text, result: professionalVersion });
            return;
        }
        // Call DeepSeek API
        const response = await axios_1.default.post('https://api.deepseek.com/chat/completions', {
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "You are a helpful assistant for a field service technician. Rewrite the following text to be professional, polite, and concise for a customer invoice or job note." },
                { role: "user", content: text }
            ],
            temperature: 0.7
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const professionalVersion = response.data.choices[0].message.content.trim();
        res.json({
            original: text,
            result: professionalVersion
        });
    }
    catch (error) {
        console.error('AI Tone Check Error:', error);
        // Fallback to original text on error or return error
        res.status(500).json({ error: 'Failed to process text with AI' });
    }
};
exports.checkTone = checkTone;
const chat = async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            res.status(400).json({ error: 'Messages array is required' });
            return;
        }
        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
            const mockResponse = "I'm Cerebro, your AI assistant. (DeepSeek API Key missing, showing mock response).";
            await new Promise(resolve => setTimeout(resolve, 1000));
            res.json({ result: mockResponse });
            return;
        }
        // Call DeepSeek API
        const response = await axios_1.default.post('https://api.deepseek.com/chat/completions', {
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "You are Cerebro, the intelligent operations brain for ServiceTagger. You help dispatchers with scheduling, technician management, and business insights. Be concise, professional, and helpful." },
                ...messages
            ],
            temperature: 0.7
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const aiMessage = response.data.choices[0].message.content;
        res.json({ result: aiMessage });
    }
    catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ error: 'Failed to process chat' });
    }
};
exports.chat = chat;
