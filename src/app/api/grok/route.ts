import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';  // Importa la SDK OpenAI

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
        const apiKey = process.env.XAI_API_KEY;
        if (!apiKey) {
            console.error('XAI_API_KEY environment variable is not set');
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

        // Inizializza il client OpenAI con config per xAI
        const client = new OpenAI({
            apiKey: apiKey,
            baseURL: 'https://api.x.ai/v1',
        });

        const completion = await client.chat.completions.create({
            model: 'grok-3-mini',
            messages: [
                { role: 'system', content: enhancedPrompt },
                { role: 'user', content: prompt },
            ],
            temperature: currentMood === 'excited' ? 0.9 : 0.7,
            top_p: 0.95,
            max_tokens: 200,
            stream: false,
        });

        const fullResponse = completion.choices[0].message.content || '';

        const detectedMood = extractMoodFromResponse(fullResponse);
        const cleanedResponse = cleanResponse(fullResponse);

        return NextResponse.json({
            response: cleanedResponse,
            detectedMood: detectedMood
        });

    } catch (error) {
        console.error('Error calling Grok API:', error);
        return NextResponse.json(
            { error: 'Failed to generate response' },
            { status: 500 }
        );
    }
}