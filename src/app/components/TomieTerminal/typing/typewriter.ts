import { Mood } from '../mood/moodConfig';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    mood?: Mood;
}

export const typeMessage = async (
    text: string,
    mood: Mood,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setIsTyping: React.Dispatch<React.SetStateAction<boolean>>,
    inputRef: React.RefObject<HTMLInputElement>,
    isTouchDevice: boolean
) => {
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