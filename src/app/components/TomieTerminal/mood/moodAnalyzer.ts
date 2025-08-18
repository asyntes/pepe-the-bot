import { Mood } from './moodConfig';
import { MoodState } from '../types';



export const updateMoodState = (
    currentState: MoodState,
    detectedMood: Mood
): { newState: MoodState; shouldChangeMood: boolean } => {
    const newScores = { ...currentState.scores };

    console.log('DEBUG - Current mood:', currentState.currentMood);
    console.log('DEBUG - Detected mood:', detectedMood);
    console.log('DEBUG - Current scores before:', currentState.scores);

    if (currentState.currentMood === 'neutral') {
        if (detectedMood !== 'neutral') {
            newScores[detectedMood] += 1;
            Object.keys(newScores).forEach(mood => {
                if (mood !== detectedMood) {
                    newScores[mood as Mood] = 0;
                }
            });
        }
    } else {
        if (detectedMood === currentState.currentMood) {
            newScores[detectedMood] += 1;
            console.log('DEBUG - Incrementing current mood score to:', newScores[detectedMood]);
        } else {
            newScores['neutral'] += 1;
            console.log('DEBUG - Incrementing neutral score to:', newScores['neutral']);
            Object.keys(newScores).forEach(mood => {
                if (mood !== 'neutral') {
                    newScores[mood as Mood] = 0;
                }
            });
        }
    }

    console.log('DEBUG - New scores after:', newScores);

    const shouldChangeMood = (
        (currentState.currentMood === 'neutral' && detectedMood !== 'neutral' && newScores[detectedMood] >= 2) ||
        (currentState.currentMood !== 'neutral' && newScores['neutral'] >= 2)
    );

    console.log('DEBUG - Should change mood:', shouldChangeMood);

    const newMood = shouldChangeMood ? 
        (currentState.currentMood === 'neutral' ? detectedMood : 'neutral') : 
        currentState.currentMood;

    console.log('DEBUG - New mood will be:', newMood);

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
        trusted: 0,
        excited: 0,
        confused: 0
    },
    lastDetectedMood: 'neutral',
    nonMatchingCount: 0
});