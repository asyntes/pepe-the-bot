import { Message } from '../../../types/message';

export const handleCommand = (
    command: string,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setCurrentMood: () => void,
    t: (key: string, params?: Record<string, string>) => string,
    formatPrivacyPolicy: () => string
): boolean => {
    const lowerCommand = command.toLowerCase().trim();

    if (lowerCommand === '/clear') {
        setMessages([]);
        setCurrentMood();

        setTimeout(() => {
            const systemMessage: Message = {
                id: Date.now().toString(),
                text: t('commands.cleared'),
                isUser: false,
                timestamp: new Date()
            };
            setMessages([systemMessage]);
        }, 100);
        return true;
    }

    if (lowerCommand === '/help') {
        const userMessage: Message = {
            id: Date.now().toString(),
            text: command,
            isUser: true,
            timestamp: new Date()
        };

        const helpMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: t('commands.help'),
            isUser: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage, helpMessage]);
        return true;
    }

    if (lowerCommand === '/repo') {
        const userMessage: Message = {
            id: Date.now().toString(),
            text: command,
            isUser: true,
            timestamp: new Date()
        };

        const repoMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: t('commands.repo'),
            isUser: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage, repoMessage]);

        window.open('https://github.com/asyntes/tomie', '_blank');
        return true;
    }

    if (lowerCommand === '/privacy') {
        const userMessage: Message = {
            id: Date.now().toString(),
            text: command,
            isUser: true,
            timestamp: new Date()
        };

        const privacyMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: formatPrivacyPolicy(),
            isUser: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage, privacyMessage]);
        return true;
    }

    const userMessage: Message = {
        id: Date.now().toString(),
        text: command,
        isUser: true,
        timestamp: new Date()
    };

    const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('commands.unknown', { command: lowerCommand }),
        isUser: false,
        timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, errorMessage]);
    return true;
};