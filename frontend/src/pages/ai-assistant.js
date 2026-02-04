import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { Bot, Send, Sparkles } from 'lucide-react';

const initialMessages = [
    {
        role: 'assistant',
        content: 'Hello! I\'m your AI Forest Health Assistant. I can help you analyze forest data, predict risks, and recommend conservation strategies. How can I assist you today?',
    },
];

export default function AIAssistant() {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessages = [
            ...messages,
            { role: 'user', content: input },
            {
                role: 'assistant',
                content: 'Based on the current data, I recommend focusing on drought mitigation in the Pune Zone. The rainfall deficit of 30% requires immediate irrigation support to prevent tree stress.',
            },
        ];

        setMessages(newMessages);
        setInput('');
    };

    return (
        <Layout>
            <div className="space-y-6 h-full flex flex-col">
                <motion.h1
                    className="text-3xl font-bold text-text-primary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    AI Assistant
                </motion.h1>

                <div className="flex-1 flex flex-col glass overflow-hidden">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <AnimatePresence>
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="p-2 rounded-lg bg-accent-green/10">
                                            <Bot className="w-6 h-6 text-accent-green" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[70%] p-4 rounded-lg ${message.role === 'user'
                                                ? 'bg-accent-green text-bg-primary'
                                                : 'bg-forest-medium text-text-primary'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                    </div>
                                    {message.role === 'user' && (
                                        <div className="p-2 rounded-lg bg-accent-green/10">
                                            <Sparkles className="w-6 h-6 text-accent-green" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about forest health, risks, or recommendations..."
                                className="flex-1 px-4 py-3 bg-forest-dark border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-green transition-colors"
                            />
                            <motion.button
                                onClick={handleSend}
                                className="btn btn-primary flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Send className="w-5 h-5" />
                                Send
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['Analyze current risks', 'Predict fire probability', 'Recommend actions'].map((action) => (
                        <motion.button
                            key={action}
                            className="btn btn-secondary text-sm"
                            onClick={() => setInput(action)}
                            whileHover={{ scale: 1.02 }}
                        >
                            {action}
                        </motion.button>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
