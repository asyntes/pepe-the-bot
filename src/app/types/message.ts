import { Mood } from './mood';

export interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    mood?: Mood;
    isSystemGenerated?: boolean;
}