import { NextRequest, NextResponse } from 'next/server';

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const MODEL_ENDPOINT = 'https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct';

type Mood = 'neutral' | 'angry' | 'trusted' | 'excited' | 'confused';

const extractMoodFromResponse = (text: string): Mood => {
    const moodMarkers = text.match(/\[MOOD:(\w+)\]/);
    if (moodMarkers && moodMarkers[1]) {
        const detectedMood = moodMarkers[1].toLowerCase() as Mood;
        if (['neutral', 'angry', 'trusted', 'excited', 'confused'].includes(detectedMood)) {
            return detectedMood;
        }
    }
    return 'neutral';
};

const cleanResponse = (text: string): string => {
    return text.replace(/\[MOOD:\w+\]/g, '').trim();
};

export async function POST(request: NextRequest) {
    try {
        if (!HUGGING_FACE_API_KEY) {
            console.error('HUGGING_FACE_API_KEY environment variable is not set');
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            );
        }

        const { prompt, currentMood } = await request.json();

        const enhancedPrompt = `You are Tomie, an AI character with a terminal interface personality. Respond to the user's message naturally and indicate your emotional interpretation of their input.

IMPORTANT: You must end your response with [MOOD:emotion] where emotion is one of: neutral, angry, trusted, excited, confused.

Mood Guidelines:
- angry: User is insulting, rude, hostile, uses profanity, or is demanding/aggressive
- trusted: User is polite, thankful, asking for help nicely, being friendly or collaborative  
- excited: User shows enthusiasm, uses exclamation marks, expresses amazement or energy
- confused: User asks unclear questions, seems lost, requests clarification, or appears uncertain
- neutral: Normal conversation, factual questions, casual interaction

Current AI mood state: ${currentMood}
User input: "${prompt}"

Respond as Tomie with your interpretation and then add the mood tag:`;

        const response = await fetch(MODEL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: enhancedPrompt,
                parameters: {
                    max_new_tokens: 200,
                    temperature: currentMood === 'excited' ? 0.9 : 0.7,
                    top_p: 0.95,
                    return_full_text: false,
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('HF API Error Details:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('HF API Response:', data);
        const fullResponse = data[0].generated_text;

        const detectedMood = extractMoodFromResponse(fullResponse);
        const cleanedResponse = cleanResponse(fullResponse);

        return NextResponse.json({
            response: cleanedResponse,
            detectedMood: detectedMood
        });

    } catch (error) {
        console.error('Error calling Mistral API:', error);
        return NextResponse.json(
            { error: 'Failed to generate response' },
            { status: 500 }
        );
    }
}