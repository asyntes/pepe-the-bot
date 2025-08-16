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
            text: 'Available commands:\\n/clear - Clear terminal\\n/help - Show this help',
            isUser: false,
            timestamp: new Date(),
            mood: 'neutral'
        };

        setMessages(prev => [...prev, userMessage, helpMessage]);
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
        timestamp: new Date(),
        mood: 'confused'
    };

    setMessages(prev => [...prev, userMessage, errorMessage]);
    setCurrentMood('confused');
    return true;
};