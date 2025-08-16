import { Mood } from './moodConfig';

const responses = {
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

export const generateResponse = (userInput: string, mood: Mood): string => {
    const moodResponses = responses[mood];
    return moodResponses[Math.floor(Math.random() * moodResponses.length)];
};