import { Mood } from './moodConfig';

export const analyzeMood = (text: string): Mood => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('stupid') || lowerText.includes('idiot') || lowerText.includes('shut up') ||
        lowerText.includes('hate') || lowerText.includes('fuck') || lowerText.includes('damn') ||
        lowerText.includes('annoying') || lowerText.includes('useless')) {
        return 'angry';
    }

    if (lowerText.includes('thank') || lowerText.includes('help') || lowerText.includes('please') ||
        lowerText.includes('good') || lowerText.includes('awesome') || lowerText.includes('amazing') ||
        lowerText.includes('love') || lowerText.includes('friend')) {
        return 'trusted';
    }

    if (lowerText.includes('!') || lowerText.includes('wow') || lowerText.includes('cool') ||
        lowerText.includes('awesome') || lowerText.includes('incredible') || lowerText.includes('amazing')) {
        return 'excited';
    }

    if (lowerText.includes('?') || lowerText.includes('what') || lowerText.includes('how') ||
        lowerText.includes('confused') || lowerText.includes('understand') || lowerText.includes('explain')) {
        return 'confused';
    }

    return 'neutral';
};