'use client';

import { useState, useEffect } from 'react';
import { useAutoLock } from '@/contexts/AutoLockContext';
import { usePathname } from 'next/navigation';

export function AutoLockIndicator() {
    const { settings } = useAutoLock();
    const pathname = usePathname();
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [lastActivity, setLastActivity] = useState(Date.now());
    const [showIndicator, setShowIndicator] = useState(false);

    useEffect(() => {
        if (!settings.enabled || pathname === '/') {
            setShowIndicator(false);
            return;
        }

        const updateTimer = () => {
            const now = Date.now();
            const elapsed = (now - lastActivity) / 1000; // seconds
            const totalTimeout = settings.timeoutMinutes * 60; // seconds
            const remaining = Math.max(0, totalTimeout - elapsed);

            setTimeLeft(remaining);

            // Show indicator when less than 30 seconds remaining
            setShowIndicator(remaining <= 30 && remaining > 0);

            if (remaining <= 0) {
                setShowIndicator(false);
            }
        };

        const resetActivity = () => {
            setLastActivity(Date.now());
            setShowIndicator(false);
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
            'keydown',
            'touchend'
        ];

        // Add event listeners
        events.forEach(event => {
            document.addEventListener(event, resetActivity, { passive: true });
        });

        // Update timer every second
        const intervalId = setInterval(updateTimer, 1000);

        // Initial update
        updateTimer();

        return () => {
            clearInterval(intervalId);
            events.forEach(event => {
                document.removeEventListener(event, resetActivity);
            });
        };
    }, [settings.enabled, settings.timeoutMinutes, pathname, lastActivity]);

    if (!showIndicator || !timeLeft) {
        return null;
    }

    const seconds = Math.ceil(timeLeft);

    return (
        <div className="fixed top-4 right-4 z-50 animate-pulse">
            <div className="bg-red-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-lg border border-red-500/50">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <span className="font-medium">
                        Locking in {seconds}s
                    </span>
                </div>
            </div>
        </div>
    );
}
