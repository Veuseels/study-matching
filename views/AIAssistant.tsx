import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Brain, Send, Loader2 } from 'lucide-react';
import { AIMessage } from '../types';

const AIAssistant: React.FC = () => {
    const { aiMessages, sendAIMessage } = useApp();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [aiMessages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setError('');
        setIsLoading(true);

        try {
            await sendAIMessage(userMessage);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-8 max-w-[1200px] h-[calc(100vh-80px)] flex flex-col">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-black text-white p-3 rounded-full">
                        <Brain size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">AI Study Assistant</h1>
                        <p className="text-gray-600">Ask me anything about your studies!</p>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto mb-4 border-4 border-black p-6 bg-gray-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {aiMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Brain size={64} className="mb-4 text-gray-400" />
                        <h2 className="text-2xl font-black mb-2">Welcome to AI Study Assistant!</h2>
                        <p className="text-gray-600 max-w-md">
                            Ask me questions about any subject, request explanations, or get study tips.
                            I'm here to help you learn!
                        </p>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                            <button
                                onClick={() => setInput('Explain photosynthesis in simple terms')}
                                className="p-3 bg-white border-2 border-black text-left hover:bg-yellow-100 transition-colors font-bold text-sm"
                            >
                                💡 Explain photosynthesis in simple terms
                            </button>
                            <button
                                onClick={() => setInput('What are good study techniques for exams?')}
                                className="p-3 bg-white border-2 border-black text-left hover:bg-yellow-100 transition-colors font-bold text-sm"
                            >
                                📚 What are good study techniques for exams?
                            </button>
                            <button
                                onClick={() => setInput('Help me understand quadratic equations')}
                                className="p-3 bg-white border-2 border-black text-left hover:bg-yellow-100 transition-colors font-bold text-sm"
                            >
                                🧮 Help me understand quadratic equations
                            </button>
                            <button
                                onClick={() => setInput('What is the difference between mitosis and meiosis?')}
                                className="p-3 bg-white border-2 border-black text-left hover:bg-yellow-100 transition-colors font-bold text-sm"
                            >
                                🔬 Mitosis vs Meiosis?
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {aiMessages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-4 border-2 border-black ${msg.role === 'user'
                                            ? 'bg-black text-white'
                                            : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                        }`}
                                >
                                    <div className="flex items-start gap-2">
                                        {msg.role === 'assistant' && <Brain size={20} className="shrink-0 mt-1" />}
                                        <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <div className="flex items-center gap-2">
                                        <Loader2 size={20} className="animate-spin" />
                                        <span className="font-bold">AI is thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 text-red-700 font-bold text-sm">
                    {error}
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 border-4 border-black p-4 text-lg focus:outline-none focus:ring-4 focus:ring-yellow-200 font-medium"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="bg-black text-white px-8 py-4 border-4 border-black font-black text-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                >
                    {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                </button>
            </form>
        </div>
    );
};

export default AIAssistant;
