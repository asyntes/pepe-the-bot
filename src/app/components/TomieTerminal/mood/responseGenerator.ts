import { Mood } from './moodConfig';

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
    currentMood: Mood
): Promise<{ introResponse: string; aiResponse: string; detectedMood: Mood }> => {
    const introResponse = generatePredefinedResponse(currentMood);

    try {
        const response = await fetch('/api/grok', {  // Aggiornato a '/api/grok' per la route rinominata
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: userInput,
                currentMood: currentMood
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Details:', errorText);  // Logging per debug
            throw new Error('API call failed');
        }

        const data = await response.json();
        console.log('API Response Data:', data);  // Logging per verificare la response

        return {
            introResponse,
            aiResponse: data.response,
            detectedMood: data.detectedMood
        };
    } catch (error) {
        console.error('Error calling Grok API:', error);
        return {
            introResponse,
            aiResponse: 'Sorry, I encountered an error while processing your request.',
            detectedMood: currentMood
        };
    }
};