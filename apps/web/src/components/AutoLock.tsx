'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AutoLockProps {
    timeoutMinutes?: number;
    enabled?: boolean;
}

export function AutoLock({ timeoutMinutes = 5, enabled = true }: AutoLockProps) {
    const router = useRouter();
    const pathname = usePathname();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastActivityRef = useRef<number>(Date.now());

    useEffect(() => {
        if (!enabled) return;

        const resetTimer = () => {
            if (pathname === '/lock') return;

            // Clear existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Update last activity
            lastActivityRef.current = Date.now();

            // Set new timeout
            timeoutRef.current = setTimeout(() => {
                console.log('Auto-locking due to inactivity');
                router.push('/lock');
            }, timeoutMinutes * 60 * 1000);
        };

        // Events to track for user activity
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'touchmove',
            'click',
            'keydown'
        ];

        // Add event listeners
        events.forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });

        // Initial timer setup
        resetTimer();

        // Cleanup
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, resetTimer, true);
            });

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [enabled, timeoutMinutes, pathname, router]);

    return null; // This component doesn't render anything
}

// Hook for manual lock functionality
export function useLockScreen() {
    const router = useRouter();

    const lockScreen = () => {
        router.push('/lock');
    };

    return { lockScreen };
}
