import { Mood } from './moodConfig';
import { MoodState } from '../types';

export const analyzeMoodFromText = (text: string): Mood => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('stupid') || lowerText.includes('idiot') || lowerText.includes('shut up') ||
        lowerText.includes('hate') || lowerText.includes('fuck') || lowerText.includes('damn') ||
        lowerText.includes('annoying') || lowerText.includes('useless')) {
        return 'angry';
    }

    if (lowerText.includes('thank') || lowerText.includes('help') || lowerText.includes('please') ||
        lowerText.includes('good') || lowerText.includes('awesome') || lowerText.includes('amazing') ||
        lowerText.includes('love') || lowerText.includes('friend')) {
        return 'trusted';
    }

    if (lowerText.includes('!') || lowerText.includes('wow') || lowerText.includes('cool') ||
        lowerText.includes('awesome') || lowerText.includes('incredible') || lowerText.includes('amazing')) {
        return 'excited';
    }

    if (lowerText.includes('?') || lowerText.includes('what') || lowerText.includes('how') ||
        lowerText.includes('confused') || lowerText.includes('understand') || lowerText.includes('explain')) {
        return 'confused';
    }

    return 'neutral';
};

export const updateMoodState = (
    currentState: MoodState, 
    detectedMood: Mood
): { newState: MoodState; shouldChangeMood: boolean } => {
    const newScores = { ...currentState.scores };
    
    if (detectedMood === currentState.lastDetectedMood) {
        newScores[detectedMood] += 1;
    } else {
        Object.keys(newScores).forEach(mood => {
            newScores[mood as Mood] = 0;
        });
        newScores[detectedMood] = 1;
    }

    const shouldChangeMood = newScores[detectedMood] >= 3 && detectedMood !== currentState.currentMood;

    const newState: MoodState = {
        currentMood: shouldChangeMood ? detectedMood : currentState.currentMood,
        scores: newScores,
        lastDetectedMood: detectedMood
    };

    return { newState, shouldChangeMood };
};

export const createInitialMoodState = (): MoodState => ({
    currentMood: 'neutral',
    scores: {
        neutral: 0,
        angry: 0,
        trusted: 0,
        excited: 0,
        confused: 0
    },
    lastDetectedMood: 'neutral'
});