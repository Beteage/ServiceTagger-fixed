
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import api from '../api/axios';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatInputProps {
    centered?: boolean;
    input: string;
    setInput: (value: string) => void;
    handleSend: (e?: React.FormEvent) => void;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ centered = false, input, setInput, handleSend, isLoading }) => (
    <div className={cn("relative group w-full max-w-3xl", centered ? "mx-auto" : "")}>
        <form onSubmit={handleSend} className="relative">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                placeholder={centered ? "Ask me anything..." : "Message Cerebro..."}
                rows={1}
                className={cn(
                    "w-full bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all shadow-sm resize-none custom-scrollbar",
                    centered
                        ? "rounded-3xl border border-slate-200 py-4 pl-6 pr-14 text-lg shadow-md focus:shadow-xl focus:border-slate-300 min-h-[60px]"
                        : "rounded-2xl border border-slate-200 py-3.5 pl-4 pr-12 focus:ring-1 focus:ring-slate-300 focus:border-slate-300 min-h-[52px] max-h-[200px]"
                )}
                style={{ height: 'auto', overflowY: input.length > 50 ? 'auto' : 'hidden' }}
                autoFocus={centered}
            />
            <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                    "absolute rounded-full transition-all flex items-center justify-center",
                    centered ? "right-3 bottom-3 p-2.5" : "right-2 bottom-2 p-1.5",
                    input.trim() ? "bg-black text-white hover:bg-slate-800" : "bg-slate-100 text-slate-300 cursor-not-allowed"
                )}
            >
                {isLoading ? <Loader2 size={centered ? 20 : 18} className="animate-spin" /> : <Send size={centered ? 20 : 18} />}
            </button>
        </form>
        {centered && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button onClick={() => { setInput("Take me to customers"); }} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-colors">
                    "Take me to customers"
                </button>
                <button onClick={() => { setInput("Create new invoice"); }} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-colors">
                    "Create new invoice"
                </button>
                <button onClick={() => { setInput("Show revenue"); }} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-colors">
                    "Show revenue"
                </button>
            </div>
        )}
    </div>
);

const AIChat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const navigate = useNavigate();

    // Intent detection logic
    const checkIntent = (text: string): { type: string; target?: string } | null => {
        const lower = text.toLowerCase();

        // Navigation Intents
        if (lower.includes('take me to') || lower.includes('go to') || lower.includes('show me')) {
            if (lower.includes('customers') || lower.includes('customer')) return { type: 'NAVIGATE', target: '/customers' };
            if (lower.includes('invoices') || lower.includes('invoice')) return { type: 'NAVIGATE', target: '/invoices' };
            if (lower.includes('dashboard') || lower.includes('home')) return { type: 'NAVIGATE', target: '/dashboard' };
            if (lower.includes('settings')) return { type: 'NAVIGATE', target: '/settings' };
            if (lower.includes('pricebook')) return { type: 'NAVIGATE', target: '/pricebook' };
        }

        // Creation Intents
        if (lower.includes('create') || lower.includes('new') || lower.includes('add')) {
            if (lower.includes('customer')) return { type: 'NAVIGATE', target: '/customers?action=create' };
            if (lower.includes('invoice')) return { type: 'NAVIGATE', target: '/invoices?action=create' };
            if (lower.includes('job')) return { type: 'NAVIGATE', target: '/dashboard?action=create_job' };
        }

        return null;
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input;
        const userMessage = { role: 'user' as const, content: userText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Check for client-side intents FIRST
        const intent = checkIntent(userText);
        if (intent) {
            setTimeout(() => {
                let responseText = "I'm on it.";
                if (intent.type === 'NAVIGATE') {
                    if (intent.target?.includes('create')) {
                        responseText = `Opening the creation form for you...`;
                    } else {
                        responseText = `Navigating you to ${intent.target?.replace('/', '').split('?')[0]}...`;
                    }
                }

                setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
                setIsLoading(false);

                // Execute navigation after short delay
                setTimeout(() => {
                    if (intent.target) navigate(intent.target);
                }, 1000);
            }, 600);
            return;
        }

        try {
            // Include recent context (last 10 messages)
            const contextMessages = [...messages.slice(-10), userMessage].map(m => ({
                role: m.role,
                content: m.content
            }));

            const { data } = await api.post('/ai/chat', { messages: contextMessages });

            setMessages(prev => [...prev, { role: 'assistant', content: data.result }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to my neural network. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white relative font-sans text-slate-800">
            {/* Minimal Header */}
            <div className="flex-shrink-0 p-2 border-b border-slate-100 flex justify-center items-center bg-white z-10 sticky top-0">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors text-slate-600">
                    <span className="font-medium text-sm">Cerebro 4.0</span>
                    <Sparkles size={14} className="text-slate-400" />
                </div>
            </div>

            {messages.length === 0 ? (
                /* ZERO STATE */
                <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-6 p-4">
                        <img src="/logo.png" alt="Cerebro" className="w-full h-full object-contain opacity-90" />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-800 mb-8">How can I help you today?</h2>
                    <ChatInput centered={true} input={input} setInput={setInput} handleSend={handleSend} isLoading={isLoading} />
                </div>
            ) : (
                /* CHAT FLOW */
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pb-40">
                    {messages.map((m, i) => (
                        <div key={i} className={cn(
                            "w-full py-8 border-b border-black/5",
                            m.role === 'assistant' ? "bg-[#F7F7F8]" : "bg-white"
                        )}>
                            <div className="max-w-3xl mx-auto px-4 flex gap-6 text-base">
                                <div className={cn(
                                    "w-8 h-8 rounded-sm flex items-center justify-center shrink-0 mt-0.5",
                                    m.role === 'assistant' ? "bg-[#10a37f] text-white" : "bg-slate-200 text-slate-500"
                                )}>
                                    {m.role === 'assistant' ? <img src="/logo.png" alt="AI" className="w-5 h-5 object-contain opacity-90" /> : <User size={16} />}
                                </div>
                                <div className="flex-1 leading-7 prose prose-slate max-w-none">
                                    <p className="whitespace-pre-wrap text-slate-800">{m.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="w-full py-8 bg-[#F7F7F8] border-b border-black/5">
                            <div className="max-w-3xl mx-auto px-4 flex gap-6 text-base">
                                <div className="w-8 h-8 rounded-sm bg-[#10a37f] flex items-center justify-center shrink-0 mt-0.5 text-white">
                                    <Sparkles size={16} className="animate-spin" />
                                </div>
                                <div className="flex-1 flex items-center gap-1 mt-2">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}

            {/* FIXED BOTTOM INPUT */}
            {messages.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-4">
                    <div className="max-w-3xl mx-auto">
                        <ChatInput centered={false} input={input} setInput={setInput} handleSend={handleSend} isLoading={isLoading} />
                        <div className="text-center mt-2">
                            <p className="text-[11px] text-slate-400">
                                Cerebro can make mistakes. Consider checking important information.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIChat;
