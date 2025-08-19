import { Mood } from '../config/moodConfig';
import { MoodState } from '../types';
import { predefinedResponses } from '../constants';

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