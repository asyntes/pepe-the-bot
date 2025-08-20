import { Mood } from '../types/mood';
import { MoodState } from '../types/mood';



export const updateMoodState = (
    currentState: MoodState,
    detectedMood: Mood
): { newState: MoodState; shouldChangeMood: boolean } => {
    const newScores = { ...currentState.scores };

    if (currentState.currentMood === 'neutral') {
        if (detectedMood !== 'neutral') {
            newScores[detectedMood] += 1;
        }
    } else {
        if (detectedMood === currentState.currentMood) {
            newScores[detectedMood] += 1;
        } else {
            newScores['neutral'] += 1;
            Object.keys(newScores).forEach(mood => {
                if (mood !== 'neutral') {
                    newScores[mood as Mood] = 0;
                }
            });
        }
    }

    let shouldChangeMood = false;
    let newMood = currentState.currentMood;

    if (currentState.currentMood === 'neutral' && detectedMood !== 'neutral' && newScores[detectedMood] >= 2) {
        shouldChangeMood = true;
        newMood = detectedMood;
        Object.keys(newScores).forEach(mood => {
            if (mood !== detectedMood) {
                newScores[mood as Mood] = 0;
            }
        });
    } else if (currentState.currentMood !== 'neutral' && newScores['neutral'] >= 2) {
        shouldChangeMood = true;
        newMood = 'neutral';
    }

    const newState: MoodState = {
        currentMood: newMood,
        scores: newScores,
        lastDetectedMood: detectedMood,
        nonMatchingCount: 0
    };

    return { newState, shouldChangeMood };
};

export const createInitialMoodState = (): MoodState => ({
    currentMood: 'neutral',
    scores: {
        neutral: 0,
        angry: 0,
        romantic: 0,
        excited: 0,
        confused: 0
    },
    lastDetectedMood: 'neutral',
    nonMatchingCount: 0
});