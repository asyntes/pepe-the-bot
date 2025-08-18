import { Mood } from './moodConfig';
import { MoodState } from '../types';



export const updateMoodState = (
    currentState: MoodState,
    detectedMood: Mood
): { newState: MoodState; shouldChangeMood: boolean } => {
    const newScores = { ...currentState.scores };
    let newNonMatchingCount = currentState.nonMatchingCount;

    if (detectedMood === currentState.currentMood) {
        newScores[detectedMood] += 1;
        newNonMatchingCount = 0;
        Object.keys(newScores).forEach(mood => {
            if (mood !== detectedMood) {
                newScores[mood as Mood] = 0;
            }
        });
    } else if (currentState.currentMood !== 'neutral') {
        newNonMatchingCount += 1;
        
        if (newNonMatchingCount >= 2) {
            Object.keys(newScores).forEach(mood => {
                newScores[mood as Mood] = 0;
            });
            const newState: MoodState = {
                currentMood: 'neutral',
                scores: newScores,
                lastDetectedMood: detectedMood,
                nonMatchingCount: 0
            };
            return { newState, shouldChangeMood: true };
        }
    } else {
        newNonMatchingCount = 0;
        if (detectedMood !== 'neutral') {
            newScores[detectedMood] += 1;
            Object.keys(newScores).forEach(mood => {
                if (mood !== detectedMood) {
                    newScores[mood as Mood] = 0;
                }
            });
        }
    }

    const shouldChangeMood = newScores[detectedMood] >= 2 && detectedMood !== currentState.currentMood;

    const newState: MoodState = {
        currentMood: shouldChangeMood ? detectedMood : currentState.currentMood,
        scores: newScores,
        lastDetectedMood: detectedMood,
        nonMatchingCount: newNonMatchingCount
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
    lastDetectedMood: 'neutral',
    nonMatchingCount: 0
});