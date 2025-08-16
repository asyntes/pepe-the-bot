'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

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
    const [inputFocused, setInputFocused] = useState(false);
    const [isGlitching, setIsGlitching] = useState(false);
    const [showInterference, setShowInterference] = useState(false);
    const [isSafari, setIsSafari] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
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
        trusted: '/svg/trusted-eye.svg',
        excited: '/svg/excited-eye.svg',
        confused: '/svg/confused-eye.svg'
    };

    const analyzeMood = (text: string): Mood => {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('stupid') || lowerText.includes('idiot') || lowerText.includes('shut up') ||
            lowerText.includes('hate') || lowerText.includes('fuck') || lowerText.includes('damn') ||
            lowerText.includes('annoying') || lowerText.includes('useless')) {
            return 'angry';
        }

        if (lowerText.includes('thank') || lowerText.includes('help') || lowerText.includes('please') ||
            lowerText.includes('good') || lowerText.includes('awesome') || lowerText.includes('amazing') ||
            lowerText.includes('love') || lowerText.includes('friend')) {
            return 'trusted';
        }

        if (lowerText.includes('!') || lowerText.includes('wow') || lowerText.includes('cool') ||
            lowerText.includes('awesome') || lowerText.includes('incredible') || lowerText.includes('amazing')) {
            return 'excited';
        }

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

        if (!isTouchDevice) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        if (input.startsWith('/')) {
            const command = input.toLowerCase().trim();

            if (command === '/clear') {
                setMessages([]);
                setInput('');
                setCurrentMood('neutral');

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
                    text: 'Available commands:\\n/clear - Clear terminal\\n/help - Show this help',
                    isUser: false,
                    timestamp: new Date(),
                    mood: 'neutral'
                };

                setMessages(prev => [...prev, userMessage, helpMessage]);
                setInput('');
                return;
            }

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

        if (detectedMood !== currentMood) {
            setShowInterference(true);
            setIsGlitching(true);

            setTimeout(() => {
                setCurrentMood(detectedMood);
                setTimeout(() => {
                    setIsGlitching(false);
                    setTimeout(() => {
                        setShowInterference(false);
                    }, 200);
                }, 300);
            }, 150);
        }

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
                },
                {
                    id: '3',
                    text: 'Hello! I\'m Tomie, your guide to unlocking the mysteries of the universe. Ready to dive into the unknown?',
                    isUser: false,
                    timestamp: new Date(),
                    mood: 'excited'
                }
            ];
            setMessages(initialMessages);
            setIsInitialized(true);
        }
        
        const userAgent = navigator.userAgent;
        const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);
        const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        setIsSafari(isSafariBrowser);
        setIsTouchDevice(touchDevice);
        
        if (!touchDevice) {
            inputRef.current?.focus();
        }

        const handleOrientationChange = () => {
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, shrink-to-fit=no');
            }
            setTimeout(() => {
                document.body.style.setProperty('zoom', '1');
                document.documentElement.style.setProperty('zoom', '1');
                document.body.style.transform = 'scale(1)';
                document.documentElement.style.transform = 'scale(1)';
                void document.body.offsetHeight;
            }, 100);
        };

        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);

        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            window.removeEventListener('resize', handleOrientationChange);
        };
    }, [isInitialized]);

    const currentColors = moodColors[currentMood];

    const dynamicStyles = `
        .terminal-scrollbar::-webkit-scrollbar {
            width: 0.75rem;
        }
        .terminal-scrollbar::-webkit-scrollbar-track {
            background: ${currentColors.bg};
            border-left: 0.0625rem solid ${currentColors.border};
        }
        .terminal-scrollbar::-webkit-scrollbar-thumb {
            background: ${currentColors.secondary};
            border: 0.125rem solid ${currentColors.bg};
            border-radius: 0;
        }
        .terminal-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${currentColors.primary};
        }
        .terminal-scrollbar::-webkit-scrollbar-corner {
            background: ${currentColors.bg};
        }
        .terminal-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: ${currentColors.secondary} ${currentColors.bg};
        }
        .terminal-input::placeholder {
            color: ${currentColors.secondary};
            opacity: 0.6;
            transition: color 0.2s ease;
        }
        .terminal-input:disabled::placeholder {
            color: ${currentColors.secondary};
            opacity: 0.4;
        }
        
        @keyframes glitch-1 {
            0%, 100% { transform: translateX(0); }
            10% { transform: translateX(-0.125rem) skewX(-1deg); }
            20% { transform: translateX(0.125rem) skewX(1deg); }
            30% { transform: translateX(-0.0625rem) skewX(-0.5deg); }
            40% { transform: translateX(0.0625rem) skewX(0.5deg); }
            50% { transform: translateX(-0.03125rem); }
            60% { transform: translateX(0.03125rem); }
        }
        
        @keyframes glitch-2 {
            0%, 100% { opacity: 1; filter: brightness(1) contrast(1); }
            15% { opacity: 0.8; filter: brightness(1.2) contrast(1.5); }
            25% { opacity: 1; filter: brightness(0.8) contrast(1.3); }
            35% { opacity: 0.9; filter: brightness(1.1) contrast(1.2); }
            45% { opacity: 1; filter: brightness(0.9) contrast(1.4); }
        }
        
        @keyframes glitch-color {
            0%, 100% { filter: hue-rotate(0deg); }
            20% { filter: hue-rotate(5deg); }
            40% { filter: hue-rotate(-5deg); }
            60% { filter: hue-rotate(3deg); }
            80% { filter: hue-rotate(-3deg); }
        }
        
        .glitch-active {
            animation: glitch-1 0.3s ease-in-out, glitch-2 0.3s ease-in-out, glitch-color 0.3s ease-in-out;
        }
        
        .glitch-text {
            position: relative;
        }
        
        .glitch-active .glitch-text::before,
        .glitch-active .glitch-text::after {
            content: attr(data-text);
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
        
        .glitch-active .glitch-text::before {
            animation: glitch-1 0.3s ease-in-out;
            color: ${currentColors.primary};
            filter: brightness(1.5);
            z-index: -1;
        }
        
        .glitch-active .glitch-text::after {
            animation: glitch-2 0.3s ease-in-out;
            color: ${currentColors.secondary};
            filter: brightness(0.7);
            z-index: -2;
        }
        
        @keyframes interference {
            0%, 100% { opacity: 0; }
            5% { opacity: 0.8; }
            10% { opacity: 0.2; }
            15% { opacity: 0.9; }
            20% { opacity: 0.1; }
            25% { opacity: 0.7; }
            30% { opacity: 0.3; }
            35% { opacity: 0.6; }
            40% { opacity: 0.4; }
            45% { opacity: 0.8; }
            50% { opacity: 0.2; }
            55% { opacity: 0.9; }
            60% { opacity: 0.1; }
            65% { opacity: 0.6; }
            70% { opacity: 0.4; }
            75% { opacity: 0.7; }
            80% { opacity: 0.3; }
            85% { opacity: 0.8; }
            90% { opacity: 0.2; }
            95% { opacity: 0.5; }
        }
        
        @keyframes scanlines {
            0% { transform: translateY(-100vh); }
            100% { transform: translateY(100vh); }
        }
        
        @keyframes noise {
            0% { transform: translateX(0); }
            10% { transform: translateX(-0.125rem); }
            20% { transform: translateX(0.125rem); }
            30% { transform: translateX(-0.0625rem); }
            40% { transform: translateX(0.0625rem); }
            50% { transform: translateX(-0.03125rem); }
            60% { transform: translateX(0.03125rem); }
            70% { transform: translateX(-0.0625rem); }
            80% { transform: translateX(0.0625rem); }
            90% { transform: translateX(-0.5px); }
            100% { transform: translateX(0); }
        }
        
        .interference-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 1000;
            background: 
                linear-gradient(
                    90deg, 
                    transparent 0%, 
                    rgba(${currentMood === 'neutral' ? '0, 170, 255' :
            currentMood === 'angry' ? '255, 51, 51' :
                currentMood === 'trusted' ? '170, 85, 255' :
                    currentMood === 'excited' ? '255, 170, 0' :
                        '85, 255, 85'}, 0.1) 50%, 
                    transparent 100%
                ),
                repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 0.0625rem,
                    rgba(${currentMood === 'neutral' ? '0, 170, 255' :
            currentMood === 'angry' ? '255, 51, 51' :
                currentMood === 'trusted' ? '170, 85, 255' :
                    currentMood === 'excited' ? '255, 170, 0' :
                        '85, 255, 85'}, 0.05) 0.125rem,
                    transparent 0.1875rem
                );
            animation: interference 0.6s ease-in-out, noise 0.1s infinite;
        }
        
        .interference-overlay::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 0.1875rem;
            background: linear-gradient(90deg, 
                transparent, 
                ${currentColors.primary}, 
                transparent
            );
            animation: scanlines 0.6s linear infinite;
        }
        
        .interference-overlay::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 80%, rgba(${currentMood === 'neutral' ? '0, 170, 255' :
            currentMood === 'angry' ? '255, 51, 51' :
                currentMood === 'trusted' ? '170, 85, 255' :
                    currentMood === 'excited' ? '255, 170, 0' :
                        '85, 255, 85'}, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(${currentMood === 'neutral' ? '0, 170, 255' :
            currentMood === 'angry' ? '255, 51, 51' :
                currentMood === 'trusted' ? '170, 85, 255' :
                    currentMood === 'excited' ? '255, 170, 0' :
                        '85, 255, 85'}, 0.1) 0%, transparent 50%);
            mix-blend-mode: screen;
        }
    `;

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
            className={`w-full font-mono text-sm transition-all duration-1000 ${isGlitching ? 'glitch-active' : ''}`}
            style={{
                backgroundColor: currentColors.bg,
                color: currentColors.primary,
                height: '-webkit-fill-available',
                minHeight: '100vh',
                position: 'relative'
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />

            {showInterference && (
                <div className="interference-overlay" />
            )}
            <div
                className="flex items-center justify-between p-2 border-b transition-all duration-1000"
                style={{
                    borderColor: currentColors.border,
                    backgroundColor: currentColors.bg
                }}
            >
                <div className="flex items-center gap-2">
                    <span
                        className="glitch-text"
                        data-text="TOMIE AI TERMINAL"
                        style={{ color: currentColors.secondary }}
                    >
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
                    <span
                        className="glitch-text"
                        data-text={`MOOD: ${currentMood.toUpperCase()}`}
                    >
                        MOOD: {currentMood.toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="flex-1 relative" style={{ height: 'calc(100vh - 7.5rem)' }}>
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 eye-container"
                >
                    <Image
                        src={moodEyes[currentMood]}
                        alt=""
                        width={256}
                        height={256}
                        className="w-64 h-64 object-contain"
                        style={{
                            transition: 'none',
                            transform: 'translateZ(0)', // Force hardware acceleration
                            filter: `${currentMood === 'neutral' ? 'invert(47%) sepia(89%) saturate(2718%) hue-rotate(188deg) brightness(99%) contrast(101%)' :
                                currentMood === 'angry' ? 'invert(23%) sepia(89%) saturate(6151%) hue-rotate(354deg) brightness(99%) contrast(107%)' :
                                    currentMood === 'trusted' ? 'invert(52%) sepia(98%) saturate(4466%) hue-rotate(269deg) brightness(96%) contrast(106%)' :
                                        currentMood === 'excited' ? 'invert(63%) sepia(99%) saturate(1174%) hue-rotate(15deg) brightness(103%) contrast(107%)' :
                                            'invert(69%) sepia(89%) saturate(6151%) hue-rotate(88deg) brightness(99%) contrast(107%)'
                                }`
                        }}
                        priority
                        unoptimized
                    />
                </div>

                <div className="overflow-y-auto p-4 terminal-scrollbar relative z-10 h-full">
                    {messages.map((message, index) => (
                        <div
                            key={message.id}
                            className="mb-2 transition-all duration-500"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span
                                    className="opacity-60"
                                    style={{
                                        color: currentColors.secondary,
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    [{message.timestamp?.toLocaleTimeString() || '--:--:--'}]
                                </span>
                            </div>
                            <div
                                className="transition-all duration-500"
                                style={{
                                    color: message.isUser
                                        ? currentColors.secondary
                                        : currentColors.primary,
                                    fontSize: '0.875rem'
                                }}
                            >
                                <span
                                    className="font-bold"
                                    style={{
                                        color: message.isUser
                                            ? currentColors.secondary
                                            : currentColors.primary,
                                        fontSize: '0.75rem'
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

            <form onSubmit={handleSubmit} className="p-4">
                <div className="flex items-center gap-2">
                    <span style={{ color: currentColors.secondary }}>{'>'}</span>
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => {
                                setInputFocused(true);
                            }}
                            onBlur={() => {
                                setInputFocused(false);
                            }}
                            disabled={isTyping}
                            className="w-full bg-transparent border-none outline-none terminal-input caret-transparent"
                            style={{
                                color: currentColors.primary,
                                fontSize: '0.875rem'
                            }}
                            placeholder={isTyping ? "AI is typing..." : (!inputFocused ? "Enter command..." : "")}
                        />
                        {!isTyping && inputFocused && (
                            <span
                                className="absolute top-0 pointer-events-none font-mono"
                                style={{
                                    color: currentColors.primary,
                                    fontSize: '0.875rem',
                                    left: `${input.length * 0.525}rem`
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