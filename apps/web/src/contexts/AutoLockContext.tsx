'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AutoLockSettings {
    enabled: boolean;
    timeoutMinutes: number;
}

interface AutoLockContextType {
    settings: AutoLockSettings;
    updateSettings: (newSettings: Partial<AutoLockSettings>) => void;
    resetTimer: () => void;
    isLocked: boolean;
}

const AutoLockContext = createContext<AutoLockContextType | undefined>(undefined);

const AUTO_LOCK_STORAGE_KEY = 'stemphone-autolock-settings';

const DEFAULT_SETTINGS: AutoLockSettings = {
    enabled: true,
    timeoutMinutes: 2, // Default 2 minutes for museum use
};

export function AutoLockProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<AutoLockSettings>(DEFAULT_SETTINGS);
    const [isLocked, setIsLocked] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem(AUTO_LOCK_STORAGE_KEY);
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings({ ...DEFAULT_SETTINGS, ...parsed });
            } catch (error) {
                console.error('Failed to parse auto-lock settings:', error);
            }
        }
    }, []);

    // Save settings to localStorage when they change
    useEffect(() => {
        localStorage.setItem(AUTO_LOCK_STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    // Auto-lock functionality
    useEffect(() => {
        if (!settings.enabled || pathname === '/') {
            return;
        }

        let timeoutId: NodeJS.Timeout;

        const resetTimer = () => {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                console.log('Auto-locking due to inactivity');
                setIsLocked(true);
                router.push('/');
            }, settings.timeoutMinutes * 60 * 1000);
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
            document.addEventListener(event, resetTimer, { passive: true, capture: true });
        });

        // Initial timer setup
        resetTimer();

        // Cleanup
        return () => {
            clearTimeout(timeoutId);
            events.forEach(event => {
                document.removeEventListener(event, resetTimer, true);
            });
        };
    }, [settings.enabled, settings.timeoutMinutes, pathname, router]);

    // Reset lock state when on lock screen
    useEffect(() => {
        if (pathname === '/') {
            setIsLocked(false);
        }
    }, [pathname]);

    const updateSettings = (newSettings: Partial<AutoLockSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const resetTimer = () => {
        // This function can be called manually to reset the timer
        // The actual timer reset is handled in the useEffect above
    };

    return (
        <AutoLockContext.Provider value={{
            settings,
            updateSettings,
            resetTimer,
            isLocked
        }}>
            {children}
        </AutoLockContext.Provider>
    );
}

export function useAutoLock() {
    const context = useContext(AutoLockContext);
    if (context === undefined) {
        throw new Error('useAutoLock must be used within an AutoLockProvider');
    }
    return context;
}
