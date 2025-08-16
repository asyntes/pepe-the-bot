import { Mood } from '../mood/moodConfig';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    mood?: Mood;
}

export const handleCommand = (
    command: string,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setCurrentMood: React.Dispatch<React.SetStateAction<Mood>>
): boolean => {
    const lowerCommand = command.toLowerCase().trim();

    if (lowerCommand === '/clear') {
        setMessages([]);

        setTimeout(() => {
            const systemMessage: Message = {
                id: Date.now().toString(),
                text: 'Terminal cleared. Memory reset.',
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
            text: 'Available commands:\\n/clear - Clear terminal\\n/help - Show this help\\n/repo - Visit GitHub repository',
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
            text: 'Opening GitHub repository: https://github.com/asyntes/tomie',
            isUser: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage, repoMessage]);

        window.open('https://github.com/asyntes/tomie', '_blank');
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
        text: `ERROR: Unknown command '${lowerCommand}'. Type /help for available commands.`,
        isUser: false,
        timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, errorMessage]);
    return true;
};