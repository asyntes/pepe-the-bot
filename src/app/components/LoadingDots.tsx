import React, { useState, useEffect } from 'react';

interface LoadingDotsProps {
    color: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ color }) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev === '...') return '';
                return prev + '.';
            });
        }, 500);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <span style={{ color, display: 'inline-block', minWidth: '1.5rem' }}>
            {dots}
        </span>
    );
};