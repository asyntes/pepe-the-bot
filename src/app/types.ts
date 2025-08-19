import { Mood } from './domain/moodConfig';

export interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    mood?: Mood;
    isSystemGenerated?: boolean;
}

export interface MoodScore {
    mood: Mood;
    count: number;
}

export interface MoodState {
    currentMood: Mood;
    scores: Record<Mood, number>;
    lastDetectedMood: Mood;
    nonMatchingCount: number;
}

export type { Mood };