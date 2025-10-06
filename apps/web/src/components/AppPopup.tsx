'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface AppTile {
    id: string;
    name: string;
    icon: string;
    href: string;
    gradient: string;
    description: string;
}

interface AppPopupProps {
    isOpen: boolean;
    onClose: () => void;
    apps: AppTile[];
}

export function AppPopup({ isOpen, onClose, apps }: AppPopupProps) {
    const [pressedApp, setPressedApp] = useState<string | null>(null);

    const handleAppPress = (appId: string) => {
        setPressedApp(appId);
        // Haptic feedback if available
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    };

    const handleAppRelease = () => {
        setPressedApp(null);
    };

    // Close popup when clicking outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Close popup with Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-3xl p-8 max-w-6xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="relative mb-8">
                    <h2 className="text-5xl font-bold text-gray-900 text-center">STEM Superstars Apps</h2>
                    <button
                        onClick={onClose}
                        className="absolute right-0 top-0 rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 transition-colors"
                        aria-label="Close"
                    >
                        <svg
                            className="w-7 h-7"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* App Grid */}
                <div className="grid grid-cols-4 gap-4 justify-items-center">
                    {apps.map((app) => (
                        <a
                            key={app.id}
                            href={app.href}
                            className={`
                                relative group block
                                transform transition-all duration-150 ease-out
                                ${pressedApp === app.id ? 'scale-95' : 'hover:scale-105'}
                                active:scale-95
                            `}
                            onTouchStart={() => handleAppPress(app.id)}
                            onTouchEnd={handleAppRelease}
                            onMouseDown={() => handleAppPress(app.id)}
                            onMouseUp={handleAppRelease}
                            onMouseLeave={handleAppRelease}
                        >
                            {/* App Icon Container */}
                            <div className="relative">
                                {/* Icon Background */}
                                <div className={`
                                    w-40 h-40 rounded-3xl
                                    flex items-center justify-center
                                    shadow-lg group-hover:shadow-xl
                                    transition-all duration-200
                                    ${pressedApp === app.id ? 'brightness-90' : ''}
                                `}>
                                    {app.icon.startsWith('/') ? (
                                        <Image
                                            src={app.icon}
                                            alt={app.name}
                                            width={160}
                                            height={160}
                                            className="w-40 h-40 object-contain rounded-3xl"
                                        />
                                    ) : (
                                        <div className={`w-40 h-40 rounded-3xl bg-gradient-to-br ${app.gradient} flex items-center justify-center`}>
                                            <span className="text-6xl">{app.icon}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Shine effect */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                                {/* Press effect */}
                                {pressedApp === app.id && (
                                    <div className="absolute inset-0 rounded-3xl bg-black/20"></div>
                                )}
                            </div>

                            {/* App Name */}
                            <div className="mt-5 text-center">
                                <span className="text-gray-800 text-xl font-medium leading-tight block">
                                    {app.name}
                                </span>
                            </div>

                            {/* Tooltip on hover (for desktop) */}
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                {app.description}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
