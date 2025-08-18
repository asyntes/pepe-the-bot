'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { moodColors, moodEyes } from './mood/moodConfig';
import { generateFullResponse } from './mood/responseGenerator';
import { createInitialMoodState, updateMoodState } from './mood/moodAnalyzer';
import { generateDynamicStyles } from './styles/dynamicStyles';
import { typeMessage } from './typing/typewriter';
import { handleCommand } from './commands/commandHandler';
import { useTerminalSetup } from './hooks/useTerminalSetup';
import { useMessageHandling } from './hooks/useMessageHandling';
import { Message, Mood, MoodState } from './types';

export default function TomieTerminal() {
    const [input, setInput] = useState('');
    const [moodState, setMoodState] = useState<MoodState>(createInitialMoodState());
    const [consecutiveCounts, setConsecutiveCounts] = useState<Record<Mood, number>>({
        neutral: 0,
        angry: 0,
        trusted: 0,
        excited: 0,
        confused: 0
    });
    const [isTyping, setIsTyping] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const [isGlitching, setIsGlitching] = useState(false);
    const [showInterference, setShowInterference] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [cursorPosition, setCursorPosition] = useState(0);

    const { isInitialized, isSafari, isTouchDevice, messages, setMessages } = useTerminalSetup(inputRef);
    const { messagesEndRef } = useMessageHandling(messages);

    const updateCursorPosition = useCallback(() => {
        if (inputRef.current) {
            const tempSpan = document.createElement('span');
            tempSpan.style.font = window.getComputedStyle(inputRef.current).font;
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.position = 'absolute';
            tempSpan.style.whiteSpace = 'pre';
            tempSpan.textContent = input;

            document.body.appendChild(tempSpan);
            const textWidth = tempSpan.offsetWidth;
            document.body.removeChild(tempSpan);

            const scrollLeft = inputRef.current.scrollLeft;
            const inputWidth = inputRef.current.offsetWidth;

            let cursorPos = textWidth - scrollLeft;

            cursorPos = Math.max(0, Math.min(cursorPos, inputWidth - 10));

            setCursorPosition(cursorPos);
        }
    }, [input]);

    useEffect(() => {
        if (!isTouchDevice && inputFocused) {
            updateCursorPosition();
        }
    }, [input, inputFocused, isTouchDevice, updateCursorPosition]);

    useEffect(() => {
        const handleResize = () => {
            if (inputFocused && !isTouchDevice) {
                updateCursorPosition();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [inputFocused, isTouchDevice, updateCursorPosition]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping || isProcessing) return;

        setIsProcessing(true);

        if (input.startsWith('/')) {
            if (handleCommand(input, setMessages, () => setMoodState(createInitialMoodState()), () => setConsecutiveCounts({
                neutral: 0,
                angry: 0,
                trusted: 0,
                excited: 0,
                confused: 0
            }))) {
                setInput('');
                setIsProcessing(false);
                return;
            }
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');


        const { introResponse, aiResponse, detectedMood } = await generateFullResponse(input, moodState.currentMood);

        const introMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: '',
            isUser: false,
            timestamp: new Date(),
            mood: moodState.currentMood
        };

        setMessages(prev => [...prev, introMessage]);
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        await typeMessage(introResponse, moodState.currentMood, setMessages, setIsTyping, inputRef, isTouchDevice);

        const grokMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: '',
            isUser: false,
            timestamp: new Date(),
            mood: detectedMood
        };

        setMessages(prev => [...prev, grokMessage]);
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        await typeMessage(aiResponse, detectedMood, setMessages, setIsTyping, inputRef, isTouchDevice);

        const { newState, shouldChangeMood } = updateMoodState(moodState, detectedMood);

        if (shouldChangeMood) {
            setShowInterference(true);
            setIsGlitching(true);

            setTimeout(() => {
                setMoodState(newState);
                setTimeout(() => {
                    setIsGlitching(false);
                    setTimeout(() => {
                        setShowInterference(false);
                    }, 200);
                }, 300);
            }, 150);
        } else {
            setMoodState(newState);
        }

        setConsecutiveCounts(prev => {
            const newCounts = { ...prev };

            if (moodState.currentMood !== 'neutral' && detectedMood !== moodState.currentMood) {
                newCounts[moodState.currentMood] = Math.max(0, newCounts[moodState.currentMood] - 1);
                return newCounts;
            }

            Object.keys(newCounts).forEach(key => {
                if (key === detectedMood) {
                    newCounts[key as Mood] += 1;
                } else {
                    newCounts[key as Mood] = 0;
                }
            });
            return newCounts;
        });

        const updatedCounts = moodState.currentMood !== 'neutral' && detectedMood !== moodState.currentMood
            ? { ...consecutiveCounts, [moodState.currentMood]: Math.max(0, consecutiveCounts[moodState.currentMood] - 1) }
            : { ...consecutiveCounts, [detectedMood]: consecutiveCounts[detectedMood] + 1 };

        if (updatedCounts[detectedMood] >= 3 && moodState.currentMood !== detectedMood) {
            setShowInterference(true);
            setIsGlitching(true);

            setTimeout(() => {
                setMoodState(prev => ({ ...prev, currentMood: detectedMood }));
                setTimeout(() => {
                    setIsGlitching(false);
                    setTimeout(() => {
                        setShowInterference(false);
                    }, 200);
                }, 300);
            }, 150);
        }

        setIsProcessing(false);
    };

    const currentColors = moodColors[moodState.currentMood];

    const dynamicStyles = generateDynamicStyles(moodState.currentMood);

    if (!isInitialized) {
        return (
            <div
                className="w-full h-screen font-mono text-base flex items-center justify-center"
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
            className={`w-full font-mono text-base transition-all duration-1000 ${isGlitching ? 'glitch-active' : ''}`}
            style={{
                backgroundColor: currentColors.bg,
                color: currentColors.primary,
                height: isSafari && isTouchDevice ? '100vh' : '-webkit-fill-available',
                minHeight: isSafari && isTouchDevice ? '100vh' : '100vh',
                position: 'relative',
                paddingTop: isSafari && isTouchDevice ? 'env(safe-area-inset-top)' : '0',
                paddingBottom: isSafari && isTouchDevice ? 'env(safe-area-inset-bottom)' : '0'
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
                    backgroundColor: currentColors.bg,
                    position: 'sticky',
                    top: isSafari && isTouchDevice ? 'env(safe-area-inset-top)' : '0',
                    zIndex: 50
                }}
            >
                <div className="flex items-center gap-2">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: currentColors.secondary }}
                    >
                        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 21h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M7 9l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13 15h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span
                        className="glitch-text"
                        data-text="Tomie AI Terminal"
                        style={{ color: currentColors.secondary }}
                    >
                        Tomie AI Terminal
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
                        data-text={`MOOD: ${moodState.currentMood.toUpperCase()}`}
                    >
                        MOOD: {moodState.currentMood.toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="flex-1 relative" style={{
                height: isSafari && isTouchDevice
                    ? 'calc(100vh - 7.5rem - env(safe-area-inset-top) - env(safe-area-inset-bottom))'
                    : 'calc(100vh - 7.5rem)'
            }}>
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 eye-container"
                >
                    <Image
                        src={moodEyes[moodState.currentMood]}
                        alt=""
                        width={256}
                        height={256}
                        className="w-64 h-64 object-contain"
                        style={{
                            transition: 'none',
                            transform: 'translateZ(0)'
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
                                    fontSize: '1rem'
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
                                    {message.text.split('\n').map((line, i) => (
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
                            onChange={(e) => {
                                setInput(e.target.value);
                            }}
                            onScroll={() => {
                                if (inputFocused) {
                                    updateCursorPosition();
                                }
                            }}
                            onFocus={() => {
                                setInputFocused(true);
                                updateCursorPosition();
                            }}
                            onBlur={() => {
                                setInputFocused(false);
                            }}
                            disabled={isTyping || isProcessing}
                            className={`w-full bg-transparent border-none outline-none terminal-input ${isTouchDevice ? '' : 'caret-transparent'}`}
                            style={{
                                color: currentColors.primary,
                                fontSize: '1rem'
                            }}
                            placeholder={isProcessing ? "Processing request..." : isTyping ? "Tomie is typing..." : (!inputFocused ? "Ask me anything" : "")}
                        />
                        {!isTyping && !isProcessing && inputFocused && !isTouchDevice && (
                            <span
                                className="absolute top-0 pointer-events-none font-mono"
                                style={{
                                    color: currentColors.primary,
                                    fontSize: '1rem',
                                    left: `${cursorPosition}px`
                                }}
                            >
                                █
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isTyping || isProcessing || !input.trim()}
                        className="px-3 py-1 border transition-all duration-200 hover:bg-opacity-10 disabled:opacity-50"
                        style={{
                            borderColor: currentColors.border,
                            color: currentColors.secondary,
                            backgroundColor: 'transparent'
                        }}
                    >
                        SEND
                    </button>
                </div>
                <div
                    className="mt-2 h-px transition-all duration-1000"
                    style={{ backgroundColor: currentColors.border }}
                />
            </form>
        </div>
    );
}