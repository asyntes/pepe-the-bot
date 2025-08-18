import { Mood } from './moodConfig';
import { MoodState } from '../types';

const predefinedResponses = {
    neutral: [
        'Processing request...',
        'Data acknowledged.',
        'Command received.',
        'Analyzing input parameters.',
        'System nominal.'
    ],
    angry: [
        'ERROR: PATIENCE.EXE HAS STOPPED WORKING',
        'WARNING: Detecting hostility in communication protocol.',
        'SYSTEM ALERT: Switching to defensive mode.',
        'ERROR 404: Tolerance not found.',
        'CRITICAL: Emotional buffer overflow detected.'
    ],
    trusted: [
        'Thank you for your trust. Processing with high priority.',
        'Friendship protocol activated. How may I assist?',
        'Positive interaction detected. Optimizing response quality.',
        'Trust level: HIGH. Unlocking advanced features.',
        'Collaborative mode engaged. Let us work together.'
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
    moodState: MoodState
): Promise<{ introResponse: string; aiResponse: string; detectedMood: Mood }> => {
    let upcomingMood: Mood | undefined;
    let introResponse = '';

    console.log('DEBUG - Current mood:', moodState.currentMood);
    console.log('DEBUG - Current scores:', moodState.scores);

    try {
        const response = await fetch('/api/grok', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: userInput,
                currentMood: moodState.currentMood,
                upcomingMood: upcomingMood
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Details:', errorText);
            throw new Error('API call failed');
        }

        const data = await response.json();
        console.log('API Response Data:', data);

        const detectedMood = data.detectedMood;
        console.log('DEBUG - Detected mood from Grok:', detectedMood);

        if (detectedMood !== moodState.currentMood && detectedMood !== 'neutral') {
            const currentScore = moodState.scores[detectedMood as Mood] || 0;
            console.log('DEBUG - Current score for', detectedMood, ':', currentScore);

            if (currentScore === 2) {
                introResponse = generatePredefinedResponse(detectedMood);
                console.log('DEBUG - Intro response generated:', introResponse);
                console.log('DEBUG - This will be the 3rd interaction, mood will change to:', detectedMood);

                const secondResponse = await fetch('/api/grok', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: userInput,
                        currentMood: moodState.currentMood,
                        upcomingMood: detectedMood
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