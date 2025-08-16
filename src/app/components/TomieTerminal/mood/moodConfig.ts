export type Mood = 'neutral' | 'angry' | 'trusted' | 'excited' | 'confused';

export const moodColors = {
    neutral: {
        primary: '#00aaff',
        secondary: '#0088cc',
        bg: '#000011',
        border: '#003366'
    },
    angry: {
        primary: '#ff3333',
        secondary: '#cc1111',
        bg: '#110000',
        border: '#660000'
    },
    trusted: {
        primary: '#8b5cf6',
        secondary: '#7c3aed',
        bg: '#110011',
        border: '#330066'
    },
    excited: {
        primary: '#ffaa00',
        secondary: '#cc8800',
        bg: '#111100',
        border: '#663300'
    },
    confused: {
        primary: '#55ff55',
        secondary: '#33cc33',
        bg: '#001100',
        border: '#006600'
    }
};

export const moodEyes = {
    neutral: '/svg/normal-eye.svg',
    angry: '/svg/angry-eye.svg',
    trusted: '/svg/trusted-eye.svg',
    excited: '/svg/excited-eye.svg',
    confused: '/svg/confused-eye.svg'
};