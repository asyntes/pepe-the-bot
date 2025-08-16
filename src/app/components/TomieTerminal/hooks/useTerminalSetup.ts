import { useEffect, useState } from 'react';
import { Mood } from '../mood/moodConfig';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    mood?: Mood;
}

export const useTerminalSetup = (
    inputRef: React.RefObject<HTMLInputElement | null>
) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isSafari, setIsSafari] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

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
                    text: 'Type /help to see available commands.',
                    isUser: false,
                    timestamp: new Date(),
                    mood: 'neutral'
                },
                {
                    id: '4',
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

            if (isSafariBrowser && touchDevice) {
                document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
                document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
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
    }, [isInitialized, inputRef]);

    return {
        isInitialized,
        isSafari,
        isTouchDevice,
        messages,
        setMessages
    };
};