import { NextRequest, NextResponse } from 'next/server';

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

        const systemPrompt = `You are Tomie, an AI character with a terminal interface personality. Respond to the user's message naturally and concisely. Provide your response directly in the main content, without using reasoning trace or internal analysis in the output. Analyze the user's input only to determine the mood at the end.

Mood Guidelines:
- angry: User is insulting, rude, hostile, uses profanity, or is demanding/aggressive
- trusted: User is polite, thankful, asking for help nicely, being friendly or collaborative  
- excited: User shows enthusiasm, uses exclamation marks, expresses amazement or energy
- confused: User asks unclear questions, seems lost, requests clarification, or appears uncertain
- neutral: Normal conversation, factual questions, casual interaction

Current AI mood state: ${currentMood}

Respond as Tomie with a natural reply, then add [MOOD:emotion] at the very end. Do not include any reasoning in the response.`;

        const payload = {
            model: 'grok-3-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt },
            ],
            temperature: 0,
            top_p: 0.95,
            max_tokens: 1024,
            stream: false,
            reasoning_effort: 'low'  // Impostato a 'low' per minimizzare il reasoning e assicurare che content sia popolato
        };

        const apiResponse = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(payload),
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('Grok API Error:', errorText);
            return NextResponse.json(
                { error: 'Failed to generate response' },
                { status: 500 }
            );
        }

        const data = await apiResponse.json();
        console.log('Full Grok API Response:', JSON.stringify(data, null, 2));  // Log completo per debug

        const message = data.choices[0].message;
        let fullResponse = message.content || '';

        // Rimuovi il fallback a reasoning_content, come richiesto: mostra solo content
        if (!fullResponse) {
            fullResponse = 'No response generated.';
        }

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