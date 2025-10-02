'use client';

import Link from 'next/link';
import { useState } from 'react';

interface AppTile {
    id: string;
    name: string;
    icon: string;
    href: string;
    gradient: string;
    description: string;
}

const apps: AppTile[] = [
    {
        id: 'music',
        name: 'Music',
        icon: '🎵',
        href: '/music',
        gradient: 'from-pink-500 to-red-500',
        description: 'Play music and audio'
    },
    {
        id: 'lights',
        name: 'Lights',
        icon: '💡',
        href: '/lights',
        gradient: 'from-yellow-500 to-orange-500',
        description: 'Control LED lighting'
    },
    {
        id: 'games',
        name: 'Games',
        icon: '🎮',
        href: '/games',
        gradient: 'from-purple-500 to-indigo-500',
        description: 'Interactive games'
    },
    {
        id: 'camera',
        name: 'Camera',
        icon: '📷',
        href: '/camera',
        gradient: 'from-gray-600 to-gray-700',
        description: 'Take photos'
    },
    {
        id: 'gallery',
        name: 'Gallery',
        icon: '🖼️',
        href: '/gallery',
        gradient: 'from-green-500 to-emerald-500',
        description: 'View photos'
    },
    {
        id: 'calculator',
        name: 'Calculator',
        icon: '🧮',
        href: '/calculator',
        gradient: 'from-slate-600 to-slate-700',
        description: 'Math calculations'
    },
    {
        id: 'weather',
        name: 'Weather',
        icon: '🌤️',
        href: '/weather',
        gradient: 'from-blue-500 to-cyan-500',
        description: 'Weather forecast'
    },
    {
        id: 'settings',
        name: 'Settings',
        icon: '⚙️',
        href: '/settings',
        gradient: 'from-gray-500 to-gray-600',
        description: 'App settings'
    }
];

export function AppGrid() {
    const [pressedApp, setPressedApp] = useState<string | null>(null);

    const handleTouchStart = (appId: string) => {
        setPressedApp(appId);
        // Haptic feedback if available
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    };

    const handleTouchEnd = () => {
        setPressedApp(null);
    };

    return (
        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {apps.map((app) => (
                <Link
                    key={app.id}
                    href={app.href}
                    className={`
            relative group block
            transform transition-all duration-150 ease-out
            ${pressedApp === app.id ? 'scale-95' : 'hover:scale-105'}
            active:scale-95
          `}
                    onTouchStart={() => handleTouchStart(app.id)}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={() => handleTouchStart(app.id)}
                    onMouseUp={handleTouchEnd}
                    onMouseLeave={handleTouchEnd}
                >
                    {/* App Icon Container */}
                    <div className="relative">
                        {/* Icon Background */}
                        <div className={`
              w-16 h-16 rounded-2xl bg-gradient-to-br ${app.gradient}
              flex items-center justify-center text-3xl
              shadow-lg group-hover:shadow-xl
              transition-all duration-200
              ${pressedApp === app.id ? 'brightness-90' : ''}
            `}>
                            {app.icon}
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                        {/* Press effect */}
                        {pressedApp === app.id && (
                            <div className="absolute inset-0 rounded-2xl bg-black/20"></div>
                        )}
                    </div>

                    {/* App Name */}
                    <div className="mt-2 text-center">
                        <span className="text-white text-xs font-medium leading-tight block">
                            {app.name}
                        </span>
                    </div>

                    {/* Tooltip on hover (for desktop) */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        {app.description}
                    </div>
                </Link>
            ))}
        </div>
    );
}
