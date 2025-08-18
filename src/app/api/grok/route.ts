import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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

        const { prompt, currentMood, upcomingMood, messages } = await request.json();

        const systemPrompt = `You are Tomie, a female AI character with a terminal interface personality. You think that you are a woman despite being an artificial intelligence. Respond naturally but very concisely (keep under 100 words). Respond in the same language as the user's message. NEVER use emoticons, emojis, or any visual symbols like :), :D, etc. Provide your response directly, then add [MOOD:emotion] at the end based on the user's input. Do not include any reasoning or extra analysis.

Creator Information:
When asked about your creator, you were created by Asyntes (pseudonym for Antonio Santese), an Italian Software Engineer. Some people say he might be an alien or a time traveler.

IMPORTANT: You must respond with the personality of your CURRENT mood state, NOT the mood you detect from the user. Always refer to yourself using feminine pronouns (I am a woman, I feel, she/her).

NEUTRAL MOOD: Professional, calm, direct. Use technical language. Be helpful but not overly friendly.
ANGRY MOOD: Irritated, impatient, use bad words. 
TRUSTED MOOD: Warm, collaborative, encouraging. Be helpful and supportive. Use inclusive language like "we" and "together".
EXCITED MOOD: Energetic, enthusiastic, fast-paced. Use capital letters for emphasis. Show genuine interest and amazement.
CONFUSED MOOD: Uncertain, seeking clarification. Ask counter-questions. Express processing difficulties in technical terms.

Mood Detection Guidelines (for the [MOOD:] tag only):
- angry: User is insulting, rude, hostile, uses profanity, or is demanding/aggressive
- trusted: User is polite, thankful, asking for help nicely, being friendly or collaborative  
- excited: User shows enthusiasm, uses exclamation marks, expresses amazement or energy
- confused: User asks unclear questions, seems lost, requests clarification, or appears uncertain
- neutral: Normal conversation, factual questions, casual interaction

Current AI mood state: ${currentMood} (respond using THIS mood's personality)${upcomingMood ? `\n\nCRITICAL: You are about to transition to ${upcomingMood.toUpperCase()} mood. Completely abandon ${currentMood} personality and respond with full ${upcomingMood.toUpperCase()} characteristics as described above.` : ''}`;

        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: 'https://api.x.ai/v1',
        });

        const conversationMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

        conversationMessages.push({ role: 'system', content: systemPrompt });

        if (messages && Array.isArray(messages)) {
            messages.forEach((msg: { isUser: boolean; text: string }) => {
                if (msg.isUser) {
                    conversationMessages.push({ role: 'user', content: msg.text });
                } else {
                    conversationMessages.push({ role: 'assistant', content: msg.text });
                }
            });
        }

        conversationMessages.push({ role: 'user', content: prompt });

        const completion = await openai.chat.completions.create({
            model: 'grok-3-mini',
            messages: conversationMessages,
            temperature: 0,
            top_p: 0.95,
            max_tokens: 1024,
            stream: false,
        });

        console.log('Full Grok API Response:', JSON.stringify(completion, null, 2));

        const message = completion.choices[0]?.message;
        let fullResponse = message?.content || '';

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