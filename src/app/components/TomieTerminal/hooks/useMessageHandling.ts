import { useRef, useEffect } from 'react';
import { Message } from '../../../types';

export const useMessageHandling = (messages: Message[]) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return { messagesEndRef };
};