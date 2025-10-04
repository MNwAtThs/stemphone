'use client';

import { useState, useRef, useEffect } from 'react';
import { StatusBar } from '@/components/StatusBar';

interface AppTile {
    id: string;
    name: string;
    icon: string;
    href: string;
    gradient: string;
    description: string;
}

interface HomeScreen {
    id: string;
    title: string;
    apps: AppTile[];
}

// Original Stemphone.org Apps (Screen 1)
const originalApps: AppTile[] = [
    {
        id: 'jigsaw',
        name: 'Jigsaw',
        icon: '🧩',
        href: '/jigsaw',
        gradient: 'from-yellow-600 to-orange-600',
        description: 'Jigsaw puzzle game'
    },
    {
        id: 'sudoku',
        name: 'Sudoku',
        icon: '🔢',
        href: '/sudoku',
        gradient: 'from-orange-600 to-red-600',
        description: 'Number puzzle game'
    },
    {
        id: 'mahjong',
        name: 'Mahjong',
        icon: '🀄',
        href: '/mahjong',
        gradient: 'from-green-600 to-emerald-600',
        description: 'Tile matching game'
    },
    {
        id: 'quiz',
        name: 'Quiz',
        icon: '❓',
        href: '/quiz',
        gradient: 'from-orange-500 to-yellow-500',
        description: 'Educational quizzes'
    },
    {
        id: 'utsa',
        name: 'UTSA',
        icon: '🏫',
        href: '/utsa',
        gradient: 'from-orange-600 to-blue-800',
        description: 'University connection'
    },
    {
        id: 'morse-code',
        name: 'Morse',
        icon: '📡',
        href: '/morse-code',
        gradient: 'from-gray-600 to-slate-700',
        description: 'Morse code translator'
    },
    {
        id: 'flashlight',
        name: 'Flashlight',
        icon: '🔦',
        href: '/flashlight',
        gradient: 'from-yellow-400 to-yellow-600',
        description: 'Screen flashlight'
    },
    {
        id: 'google-search',
        name: 'Search',
        icon: '🔍',
        href: '/search',
        gradient: 'from-blue-500 to-green-500',
        description: 'Web search'
    }
];

// Modern STEM Apps (Screen 2)
const modernApps: AppTile[] = [
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
        description: 'STEM educational games'
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
        description: 'Scientific calculator'
    },
    {
        id: 'weather',
        name: 'Weather',
        icon: '🌤️',
        href: '/weather',
        gradient: 'from-blue-500 to-cyan-500',
        description: 'Weather & science facts'
    },
    {
        id: 'periodic-table',
        name: 'Elements',
        icon: '⚛️',
        href: '/periodic-table',
        gradient: 'from-indigo-500 to-purple-500',
        description: 'Periodic table explorer'
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

const homeScreens: HomeScreen[] = [
    {
        id: 'original',
        title: 'Classic Apps',
        apps: originalApps
    },
    {
        id: 'modern',
        title: 'STEM Lab',
        apps: modernApps
    }
];

interface MultiScreenHomeProps {
    currentTime: Date;
}

export function MultiScreenHome({ currentTime }: MultiScreenHomeProps) {
    const [currentScreen, setCurrentScreen] = useState(0);
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

    const goToScreen = (screenIndex: number) => {
        setCurrentScreen(screenIndex);
    };

    const AppGridComponent = ({ apps }: { apps: AppTile[] }) => (
        <div className="grid grid-cols-4 gap-8 w-full max-w-7xl mx-auto px-8">
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
                            w-48 h-48 rounded-3xl bg-gradient-to-br ${app.gradient}
                            flex items-center justify-center text-9xl
                            shadow-lg group-hover:shadow-xl
                            transition-all duration-200
                            ${pressedApp === app.id ? 'brightness-90' : ''}
                        `}>
                            {app.icon}
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                        {/* Press effect */}
                        {pressedApp === app.id && (
                            <div className="absolute inset-0 rounded-3xl bg-black/20"></div>
                        )}
                    </div>

                    {/* App Name */}
                    <div className="mt-6 text-center">
                        <span className="text-white text-2xl font-medium leading-tight block">
                            {app.name}
                        </span>
                    </div>

                    {/* Tooltip on hover (for desktop) */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                        {app.description}
                    </div>
                </a>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white flex flex-col relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
            </div>

            {/* Status Bar */}
            <StatusBar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-10">
                {/* Screens Container */}
                <div className="flex-1 px-6 overflow-hidden">
                    <div
                        className="flex h-full transition-transform duration-300 ease-out"
                        style={{
                            transform: `translateX(-${currentScreen * 100}%)`,
                            width: `${homeScreens.length * 100}%`
                        }}
                    >
                        {homeScreens.map((screen, index) => (
                            <div
                                key={screen.id}
                                className="w-full flex-shrink-0 flex items-center justify-center"
                                style={{ width: `${100 / homeScreens.length}%` }}
                            >
                                <AppGridComponent apps={screen.apps} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Screen Indicator Dots */}
                <div className="flex justify-center space-x-2 py-4">
                    {homeScreens.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToScreen(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentScreen
                                ? 'bg-white scale-125'
                                : 'bg-white/40 hover:bg-white/60'
                                }`}
                        />
                    ))}
                </div>

                {/* Dock */}
                <div className="px-6 pb-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                        <div className="flex justify-center space-x-8">
                            <a href="/home" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                                    🏠
                                </div>
                                <span className="text-xs text-gray-300">Home</span>
                            </a>

                            <a href="/music" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center text-2xl">
                                    🎵
                                </div>
                                <span className="text-xs text-gray-300">Music</span>
                            </a>

                            <a href="/lights" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
                                    💡
                                </div>
                                <span className="text-xs text-gray-300">Lights</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
