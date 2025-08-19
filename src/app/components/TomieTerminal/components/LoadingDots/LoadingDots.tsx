import React, { useState, useEffect } from 'react';
import styles from './LoadingDots.module.css';

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
        <span className={styles.loadingDots} style={{ color }}>
            {dots}
        </span>
    );
};