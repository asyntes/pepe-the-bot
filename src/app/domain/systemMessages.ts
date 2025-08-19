import { Mood } from './moodConfig';

export const systemMessages: Record<Mood, string[]> = {
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