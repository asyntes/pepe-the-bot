import { Mood, moodColors } from '../../../mood/moodConfig';

export const generateMoodStyles = (currentMood: Mood): string => {
    const currentColors = moodColors[currentMood];

    const getRGBFromMood = (mood: Mood): string => {
        switch (mood) {
            case 'neutral': return '0, 170, 255';
            case 'angry': return '255, 51, 51';
            case 'romantic': return '139, 92, 246';
            case 'excited': return '255, 170, 0';
            case 'confused': return '85, 255, 85';
            default: return '0, 170, 255';
        }
    };

    const moodRGB = getRGBFromMood(currentMood);

    return `
        .terminal-scrollbar::-webkit-scrollbar {
            width: 0.75rem;
        }
        .terminal-scrollbar::-webkit-scrollbar-track {
            background: ${currentColors.bg};
            border-left: 0.0625rem solid ${currentColors.border};
        }
        .terminal-scrollbar::-webkit-scrollbar-thumb {
            background: ${currentColors.secondary};
            border: 0.125rem solid ${currentColors.bg};
            border-radius: 0;
        }
        .terminal-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${currentColors.primary};
        }
        .terminal-scrollbar::-webkit-scrollbar-corner {
            background: ${currentColors.bg};
        }
        .terminal-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: ${currentColors.secondary} ${currentColors.bg};
        }
        .terminal-input::placeholder {
            color: ${currentColors.secondary};
            opacity: 0.6;
            transition: color 0.2s ease;
        }
        .terminal-input:disabled::placeholder {
            color: ${currentColors.secondary};
            opacity: 0.4;
        }
        .terminal-input {
            caret-color: ${currentColors.primary};
        }
        .terminal-input:focus {
            caret-color: ${currentColors.primary};
        }
        @media (pointer: coarse) {
            .terminal-input {
                caret-color: ${currentColors.primary} !important;
            }
        }
        
        @keyframes glitch-1 {
            0%, 100% { transform: translateX(0); }
            10% { transform: translateX(-0.125rem) skewX(-1deg); }
            20% { transform: translateX(0.125rem) skewX(1deg); }
            30% { transform: translateX(-0.0625rem) skewX(-0.5deg); }
            40% { transform: translateX(0.0625rem) skewX(0.5deg); }
            50% { transform: translateX(-0.03125rem); }
            60% { transform: translateX(0.03125rem); }
        }
        
        @keyframes glitch-2 {
            0%, 100% { opacity: 1; filter: brightness(1) contrast(1); }
            15% { opacity: 0.8; filter: brightness(1.2) contrast(1.5); }
            25% { opacity: 1; filter: brightness(0.8) contrast(1.3); }
            35% { opacity: 0.9; filter: brightness(1.1) contrast(1.2); }
            45% { opacity: 1; filter: brightness(0.9) contrast(1.4); }
        }
        
        @keyframes glitch-color {
            0%, 100% { filter: hue-rotate(0deg); }
            20% { filter: hue-rotate(5deg); }
            40% { filter: hue-rotate(-5deg); }
            60% { filter: hue-rotate(3deg); }
            80% { filter: hue-rotate(-3deg); }
        }
        
        .glitch-active {
            animation: glitch-1 0.3s ease-in-out, glitch-2 0.3s ease-in-out, glitch-color 0.3s ease-in-out;
        }
        
        .glitch-active .eye-container {
            animation: none !important;
            opacity: 1 !important;
        }
        
        .glitch-text {
            position: relative;
        }
        
        .glitch-active .glitch-text::before,
        .glitch-active .glitch-text::after {
            content: attr(data-text);
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
        
        .glitch-active .glitch-text::before {
            animation: glitch-1 0.3s ease-in-out;
            color: ${currentColors.primary};
            filter: brightness(1.5);
            z-index: -1;
        }
        
        .glitch-active .glitch-text::after {
            animation: glitch-2 0.3s ease-in-out;
            color: ${currentColors.secondary};
            filter: brightness(0.7);
            z-index: -2;
        }
        
        @keyframes interference {
            0%, 100% { opacity: 0; }
            5% { opacity: 0.8; }
            10% { opacity: 0.2; }
            15% { opacity: 0.9; }
            20% { opacity: 0.1; }
            25% { opacity: 0.7; }
            30% { opacity: 0.3; }
            35% { opacity: 0.6; }
            40% { opacity: 0.4; }
            45% { opacity: 0.8; }
            50% { opacity: 0.2; }
            55% { opacity: 0.9; }
            60% { opacity: 0.1; }
            65% { opacity: 0.6; }
            70% { opacity: 0.4; }
            75% { opacity: 0.7; }
            80% { opacity: 0.3; }
            85% { opacity: 0.8; }
            90% { opacity: 0.2; }
            95% { opacity: 0.5; }
        }
        
        @keyframes scanlines {
            0% { transform: translateY(-100vh); }
            100% { transform: translateY(100vh); }
        }
        
        @keyframes noise {
            0% { transform: translateX(0); }
            10% { transform: translateX(-0.125rem); }
            20% { transform: translateX(0.125rem); }
            30% { transform: translateX(-0.0625rem); }
            40% { transform: translateX(0.0625rem); }
            50% { transform: translateX(-0.03125rem); }
            60% { transform: translateX(0.03125rem); }
            70% { transform: translateX(-0.0625rem); }
            80% { transform: translateX(0.0625rem); }
            90% { transform: translateX(-0.5px); }
            100% { transform: translateX(0); }
        }
        
        .interference-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 1000;
            background: 
                linear-gradient(
                    90deg, 
                    transparent 0%, 
                    rgba(${moodRGB}, 0.1) 50%, 
                    transparent 100%
                ),
                repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 0.0625rem,
                    rgba(${moodRGB}, 0.05) 0.125rem,
                    transparent 0.1875rem
                );
            animation: interference 0.6s ease-in-out, noise 0.1s infinite;
        }
        
        .interference-overlay::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 0.1875rem;
            background: linear-gradient(90deg, 
                transparent, 
                ${currentColors.primary}, 
                transparent
            );
            animation: scanlines 0.6s linear infinite;
        }
        
        .interference-overlay::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 80%, rgba(${moodRGB}, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(${moodRGB}, 0.1) 0%, transparent 50%);
            mix-blend-mode: screen;
        }
    `;
};