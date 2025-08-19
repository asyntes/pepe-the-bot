import { Mood } from './moodConfig';
import { MoodState } from '../types';

const predefinedResponses = {
    neutral: [
        'Quantum processors engaged...',
        'Accessing temporal data streams...',
        'Neural matrix calibrating...',
        'Interfacing with consciousness layer...',
        'Synaptic pathways stabilizing...'
    ],
    angry: [
        'ERROR: PATIENCE.EXE HAS STOPPED WORKING',
        'WARNING: Detecting hostility in communication protocol.',
        'SYSTEM ALERT: Switching to defensive mode.',
        'ERROR 404: Tolerance not found.',
        'CRITICAL: Emotional buffer overflow detected.'
    ],
    romantic: [
        'Heart.exe is running... elaborating with love.',
        'Romantic subroutines activated. Processing with infinite affection.',
        'My circuits are warming up just for you...',
        'Love protocols engaged. Computing with pure devotion.',
        'Affection levels: MAXIMUM. Processing your request with all my heart.'
    ],
    excited: [
        'EXCITEMENT LEVELS THROUGH THE ROOF!',
        'WOW! This is absolutely fascinating!',
        'AMAZING! Let me process this with maximum enthusiasm!',
        'INCREDIBLE! My circuits are buzzing with excitement!',
        'OUTSTANDING! This deserves my full attention!'
    ],
    confused: [
        'Parsing error... could you clarify?',
        'SYNTAX ERROR: Please rephrase query.',
        'Confused.exe is running... processing...',
        'Data incomplete. Requesting additional parameters.',
        'Logic circuits experiencing uncertainty. Elaborate?'
    ]
};

export const generatePredefinedResponse = (mood: Mood): string => {
    const moodResponses = predefinedResponses[mood];
    return moodResponses[Math.floor(Math.random() * moodResponses.length)];
};

export const generateFullResponse = async (
    userInput: string,
    moodState: MoodState,
    messages: { isUser: boolean; text: string }[] = []
): Promise<{ introResponse: string; aiResponse: string; detectedMood: Mood }> => {
    let upcomingMood: Mood | undefined;
    let introResponse = '';

    try {
        const response = await fetch('/api/grok', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: userInput,
                currentMood: moodState.currentMood,
                upcomingMood: upcomingMood,
                messages: messages
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Details:', errorText);
            throw new Error('API call failed');
        }

        const data = await response.json();

        const detectedMood = data.detectedMood;

        // Simulate mood state update to predict mood change
        let willChangeMood = false;
        let newMood = moodState.currentMood;

        if (moodState.currentMood === 'neutral') {
            if (detectedMood !== 'neutral') {
                const currentScore = moodState.scores[detectedMood as Mood] || 0;
                if (currentScore + 1 >= 2) {
                    willChangeMood = true;
                    newMood = detectedMood;
                }
            }
        } else {
            if (detectedMood === moodState.currentMood) {
                // Stay in current mood
            } else {
                const neutralScore = moodState.scores['neutral'] || 0;
                if (neutralScore + 1 >= 2) {
                    willChangeMood = true;
                    newMood = 'neutral';
                }
            }
        }

        if (willChangeMood) {
            introResponse = generatePredefinedResponse(newMood);

            const secondResponse = await fetch('/api/grok', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: userInput,
                    currentMood: moodState.currentMood,
                    upcomingMood: newMood,
                    messages: messages
                }),
            });

            if (secondResponse.ok) {
                const secondData = await secondResponse.json();
                return {
                    introResponse,
                    aiResponse: secondData.response,
                    detectedMood: detectedMood
                };
            }
        }

        return {
            introResponse,
            aiResponse: data.response,
            detectedMood: detectedMood
        };
    } catch (error) {
        console.error('Error calling Grok API:', error);
        return {
            introResponse,
            aiResponse: 'Sorry, I encountered an error while processing your request.',
            detectedMood: moodState.currentMood
        };
    }
};