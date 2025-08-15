'use client';

import { useRef, useEffect, useState } from 'react';

type Mood = 'neutral' | 'angry' | 'trusted' | 'excited' | 'confused';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    mood?: Mood;
}

export default function TomieTerminal() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [input, setInput] = useState('');
    const [currentMood, setCurrentMood] = useState<Mood>('neutral');
    const [isTyping, setIsTyping] = useState(false);
    const [showCursor, setShowCursor] = useState(true);
    const [inputFocused, setInputFocused] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const moodColors = {
        neutral: {
            primary: '#00aaff',
            secondary: '#0088cc',
            bg: '#000011',
            border: '#003366'
        },
        angry: {
            primary: '#ff3333',
            secondary: '#cc1111',
            bg: '#110000',
            border: '#660000'
        },
        trusted: {
            primary: '#aa55ff',
            secondary: '#8833cc',
            bg: '#110011',
            border: '#330066'
        },
        excited: {
            primary: '#ffaa00',
            secondary: '#cc8800',
            bg: '#111100',
            border: '#663300'
        },
        confused: {
            primary: '#55ff55',
            secondary: '#33cc33',
            bg: '#001100',
            border: '#006600'
        }
    };

    const moodEyes = {
        neutral: '/svg/normal-eye.svg',
        angry: '/svg/angry-eye.svg',
        trusted: '/svg/confident-eye.svg',
        excited: '/svg/excited-eye.svg',
        confused: '/svg/confused-eye.svg'
    };

    const analyzeMood = (text: string): Mood => {
        const lowerText = text.toLowerCase();

        // Angry keywords
        if (lowerText.includes('stupid') || lowerText.includes('idiot') || lowerText.includes('shut up') ||
            lowerText.includes('hate') || lowerText.includes('fuck') || lowerText.includes('damn') ||
            lowerText.includes('annoying') || lowerText.includes('useless')) {
            return 'angry';
        }

        // Trust keywords
        if (lowerText.includes('thank') || lowerText.includes('help') || lowerText.includes('please') ||
            lowerText.includes('good') || lowerText.includes('awesome') || lowerText.includes('amazing') ||
            lowerText.includes('love') || lowerText.includes('friend')) {
            return 'trusted';
        }

        // Excitement keywords
        if (lowerText.includes('!') || lowerText.includes('wow') || lowerText.includes('cool') ||
            lowerText.includes('awesome') || lowerText.includes('incredible') || lowerText.includes('amazing')) {
            return 'excited';
        }

        // Confusion keywords
        if (lowerText.includes('?') || lowerText.includes('what') || lowerText.includes('how') ||
            lowerText.includes('confused') || lowerText.includes('understand') || lowerText.includes('explain')) {
            return 'confused';
        }

        return 'neutral';
    };

    const generateResponse = (userInput: string, mood: Mood): string => {
        const responses = {
            neutral: [
                'Processing request...',
                'Data acknowledged.',
                'Command received.',
                'Analyzing input parameters.',
                'System nominal.'
            ],
            angry: [
                'ERROR: PATIENCE.EXE HAS STOPPED WORKING',
                'WARNING: Detecting hostility in communication protocol.',
                'SYSTEM ALERT: Switching to defensive mode.',
                'ERROR 404: Tolerance not found.',
                'CRITICAL: Emotional buffer overflow detected.'
            ],
            trusted: [
                'Thank you for your trust. Processing with high priority.',
                'Friendship protocol activated. How may I assist?',
                'Positive interaction detected. Optimizing response quality.',
                'Trust level: HIGH. Unlocking advanced features.',
                'Collaborative mode engaged. Let us work together.'
            ],
            excited: [
                'EXCITEMENT LEVELS THROUGH THE ROOF!',
                'WOW! This is absolutely fascinating!',
                'AMAZING! Let me process this with maximum enthusiasm!',
                'INCREDIBLE! My circuits are buzzing with excitement!',
                'OUTSTANDING! This deserves my full attention!'
            ],
            confused: [
                'Parsing error... could you clarify?',
                'SYNTAX ERROR: Please rephrase query.',
                'Confused.exe is running... processing...',
                'Data incomplete. Requesting additional parameters.',
                'Logic circuits experiencing uncertainty. Elaborate?'
            ]
        };

        const moodResponses = responses[mood];
        return moodResponses[Math.floor(Math.random() * moodResponses.length)];
    };

    const typeMessage = async (text: string, mood: Mood) => {
        setIsTyping(true);
        const chars = text.split('');
        let currentText = '';

        for (let i = 0; i < chars.length; i++) {
            currentText += chars[i];

            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && !lastMessage.isUser) {
                    lastMessage.text = currentText;
                    lastMessage.mood = mood;
                }
                return newMessages;
            });

            await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
        }

        setIsTyping(false);
        
        // Refocus input after typing ends
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        // Handle terminal commands
        if (input.startsWith('/')) {
            const command = input.toLowerCase().trim();

            if (command === '/clear') {
                setMessages([]);
                setInput('');
                setCurrentMood('neutral');

                // Add system message after clear
                setTimeout(() => {
                    const systemMessage: Message = {
                        id: Date.now().toString(),
                        text: 'Terminal cleared. Memory reset.',
                        isUser: false,
                        timestamp: new Date(),
                        mood: 'neutral'
                    };
                    setMessages([systemMessage]);
                }, 100);
                return;
            }

            if (command === '/help') {
                const userMessage: Message = {
                    id: Date.now().toString(),
                    text: input,
                    isUser: true,
                    timestamp: new Date()
                };

                const helpMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: 'Available commands:\\n/clear - Clear terminal\\n/help - Show this help\\n\\nTip: My mood changes based on your words!',
                    isUser: false,
                    timestamp: new Date(),
                    mood: 'neutral'
                };

                setMessages(prev => [...prev, userMessage, helpMessage]);
                setInput('');
                return;
            }

            // Unknown command
            const userMessage: Message = {
                id: Date.now().toString(),
                text: input,
                isUser: true,
                timestamp: new Date()
            };

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: `ERROR: Unknown command '${command}'. Type /help for available commands.`,
                isUser: false,
                timestamp: new Date(),
                mood: 'confused'
            };

            setMessages(prev => [...prev, userMessage, errorMessage]);
            setInput('');
            setCurrentMood('confused');
            return;
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);

        const detectedMood = analyzeMood(input);
        setCurrentMood(detectedMood);

        const response = generateResponse(input, detectedMood);

        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: '',
            isUser: false,
            timestamp: new Date(),
            mood: detectedMood
        };

        setMessages(prev => [...prev, aiMessage]);
        setInput('');

        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        await typeMessage(response, detectedMood);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 530);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Initialize messages after component mounts to avoid hydration issues
        if (!isInitialized) {
            const initialMessages: Message[] = [
                {
                    id: '1',
                    text: 'TOMIE AI TERMINAL v2.0.1 INITIALIZED...',
                    isUser: false,
                    timestamp: new Date(),
                    mood: 'neutral'
                },
                {
                    id: '2',
                    text: 'Connection established. Ready for input.',
                    isUser: false,
                    timestamp: new Date(),
                    mood: 'neutral'
                }
            ];
            setMessages(initialMessages);
            setIsInitialized(true);
        }
        inputRef.current?.focus();
    }, [isInitialized]);

    const currentColors = moodColors[currentMood];

    // Generate dynamic styles for scrollbar and input
    const dynamicStyles = `
        .terminal-scrollbar::-webkit-scrollbar {
            width: 12px;
        }
        .terminal-scrollbar::-webkit-scrollbar-track {
            background: ${currentColors.bg};
            border-left: 1px solid ${currentColors.border};
        }
        .terminal-scrollbar::-webkit-scrollbar-thumb {
            background: ${currentColors.secondary};
            border: 2px solid ${currentColors.bg};
            border-radius: 0;
        }
        .terminal-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${currentColors.primary};
        }
        .terminal-scrollbar::-webkit-scrollbar-corner {
            background: ${currentColors.bg};
        }
        /* Firefox scrollbar */
        .terminal-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: ${currentColors.secondary} ${currentColors.bg};
        }
        /* Input placeholder with fast transition */
        .terminal-input::placeholder {
            color: ${currentColors.secondary};
            opacity: 0.6;
            transition: color 0.2s ease;
        }
        .terminal-input:disabled::placeholder {
            color: ${currentColors.secondary};
            opacity: 0.4;
        }
    `;

    // Show loading state until initialized
    if (!isInitialized) {
        return (
            <div
                className="w-full h-screen font-mono text-sm flex items-center justify-center"
                style={{
                    backgroundColor: currentColors.bg,
                    color: currentColors.primary
                }}
            >
                <div>Initializing terminal...</div>
            </div>
        );
    }

    return (
        <div
            className="w-full h-screen font-mono text-sm transition-all duration-1000"
            style={{
                backgroundColor: currentColors.bg,
                color: currentColors.primary
            }}
        >
            {/* Inject dynamic styles */}
            <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
            {/* Terminal Header */}
            <div
                className="flex items-center justify-between p-2 border-b transition-all duration-1000"
                style={{
                    borderColor: currentColors.border,
                    backgroundColor: currentColors.bg
                }}
            >
                <div className="flex items-center gap-2">
                    <span style={{ color: currentColors.secondary }}>
                        TOMIE AI TERMINAL
                    </span>
                </div>
                <div
                    className="text-xs px-2 py-1 border rounded transition-all duration-1000"
                    style={{
                        borderColor: currentColors.border,
                        color: currentColors.secondary
                    }}
                >
                    MOOD: {currentMood.toUpperCase()}
                </div>
            </div>

            {/* Messages Area Container */}
            <div className="flex-1 relative" style={{ height: 'calc(100vh - 120px)' }}>
                {/* Eye Background - Fixed */}
                <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-1000 z-0"
                    style={{ opacity: 0.15 }}
                >
                    <img 
                        src={moodEyes[currentMood]}
                        alt=""
                        className="w-64 h-64 object-contain transition-all duration-1000"
                        style={{ 
                            filter: `brightness(0) saturate(100%) ${
                                currentMood === 'neutral' ? 'invert(47%) sepia(89%) saturate(2718%) hue-rotate(188deg) brightness(99%) contrast(101%)' :
                                currentMood === 'angry' ? 'invert(23%) sepia(89%) saturate(6151%) hue-rotate(354deg) brightness(99%) contrast(107%)' :
                                currentMood === 'trusted' ? 'invert(52%) sepia(98%) saturate(4466%) hue-rotate(269deg) brightness(96%) contrast(106%)' :
                                currentMood === 'excited' ? 'invert(63%) sepia(99%) saturate(1174%) hue-rotate(15deg) brightness(103%) contrast(107%)' :
                                'invert(69%) sepia(89%) saturate(6151%) hue-rotate(88deg) brightness(99%) contrast(107%)'
                            }`
                        }}
                    />
                </div>
                
                {/* Messages - Scrollable */}
                <div className="overflow-y-auto p-4 terminal-scrollbar relative z-10 h-full">
                    {messages.map((message, index) => (
                    <div
                        key={message.id}
                        className="mb-2 transition-all duration-500"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className="text-xs opacity-60"
                                style={{ color: currentColors.secondary }}
                            >
                                [{message.timestamp?.toLocaleTimeString() || '--:--:--'}]
                            </span>
                        </div>
                        <div
                            className="transition-all duration-500"
                            style={{
                                color: message.isUser
                                    ? currentColors.secondary
                                    : currentColors.primary
                            }}
                        >
                            <span
                                className="text-xs font-bold"
                                style={{
                                    color: message.isUser
                                        ? currentColors.secondary
                                        : currentColors.primary
                                }}
                            >
                                {message.isUser ? 'USER' : 'TOMIE'}
                            </span>
                            <span className="mx-1">
                                {'>'}
                            </span>
                            <span>
                                {message.text.split('\\n').map((line, i) => (
                                    i === 0 ? line : <div key={i} className="ml-12">{line}</div>
                                ))}
                                {/* Show typing cursor only for the last AI message while typing */}
                                {!message.isUser && isTyping && index === messages.length - 1 && (
                                    <span 
                                        className="ml-0.5"
                                        style={{ color: currentColors.primary }}
                                    >
                                        █
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4">
                <div className="flex items-center gap-2">
                    <span style={{ color: currentColors.secondary }}>{'>'}</span>
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => setInputFocused(true)}
                            onBlur={() => setInputFocused(false)}
                            disabled={isTyping}
                            className="w-full bg-transparent border-none outline-none terminal-input caret-transparent"
                            style={{ color: currentColors.primary }}
                            placeholder={isTyping ? "AI is typing..." : (!inputFocused ? "Enter command..." : "")}
                        />
                        {/* Custom cursor */}
                        {!isTyping && inputFocused && (
                            <span
                                className="absolute top-0 pointer-events-none"
                                style={{ 
                                    color: currentColors.primary,
                                    left: `${input.length * 0.6}em`
                                }}
                            >
                                █
                            </span>
                        )}
                    </div>
                </div>
                <div
                    className="mt-2 h-px transition-all duration-1000"
                    style={{ backgroundColor: currentColors.border }}
                />
            </form>
        </div>
    );
}