import { useEffect, useState, useMemo } from 'react';
import { Mood } from '../../../mood/moodConfig';
import { useI18n } from '../i18n/useI18n';

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
    const { t } = useI18n();

    const initialMessages = useMemo(() => [
        {
            id: '1',
            text: t('welcome.initialized'),
            isUser: false,
            timestamp: new Date(),
            mood: 'neutral' as Mood
        },
        {
            id: '2',
            text: t('welcome.connection'),
            isUser: false,
            timestamp: new Date(),
            mood: 'neutral' as Mood
        },
        {
            id: '3',
            text: t('welcome.help'),
            isUser: false,
            timestamp: new Date(),
            mood: 'neutral' as Mood
        },
        {
            id: '4',
            text: t('welcome.privacy'),
            isUser: false,
            timestamp: new Date(),
            mood: 'neutral' as Mood
        },
        {
            id: '5',
            text: t('welcome.greeting'),
            isUser: false,
            timestamp: new Date(),
            mood: 'excited' as Mood
        }
    ], [t]);

    useEffect(() => {
        if (!isInitialized) {
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
    }, [isInitialized, inputRef, initialMessages]);

    return {
        isInitialized,
        isSafari,
        isTouchDevice,
        messages,
        setMessages
    };
};