import { Mood } from '../mood/moodConfig';

export interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    mood?: Mood;
}

export type { Mood };