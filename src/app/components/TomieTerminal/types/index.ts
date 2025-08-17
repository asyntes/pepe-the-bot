import { Mood } from '../mood/moodConfig';

export interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    mood?: Mood;
}

export interface MoodScore {
    mood: Mood;
    count: number;
}

export interface MoodState {
    currentMood: Mood;
    scores: Record<Mood, number>;
    lastDetectedMood: Mood;
}

export type { Mood };