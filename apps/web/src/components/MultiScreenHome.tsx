'use client';

import { useState, useRef, useEffect } from 'react';
import { StatusBar } from '@/components/StatusBar';
import Image from 'next/image';

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
        id: 'stem-superstars',
        name: 'STEM Superstars',
        icon: '/stem-superstars.png',
        href: '/stem-superstars',
        gradient: 'from-blue-500 to-purple-600',
        description: 'STEM education platform'
    },
    {
        id: 'nasa',
        name: 'NASA',
        icon: '/nasa.png',
        href: '/nasa',
        gradient: 'from-gray-800 to-blue-900',
        description: 'NASA space exploration'
    },
    {
        id: 'ieee',
        name: 'IEEE',
        icon: '/ieee.png',
        href: '/ieee',
        gradient: 'from-blue-600 to-indigo-700',
        description: 'IEEE engineering society'
    },
    {
        id: 'music',
        name: 'Music',
        icon: '/music.png',
        href: '/music',
        gradient: 'from-pink-500 to-red-500',
        description: 'Music and audio player'
    },
    {
        id: 'photos',
        name: 'Photos',
        icon: '/photos.png',
        href: '/photos',
        gradient: 'from-green-500 to-emerald-500',
        description: 'Photo gallery'
    },
    {
        id: 'videos',
        name: 'Videos',
        icon: '/videos.png',
        href: '/videos',
        gradient: 'from-red-500 to-pink-500',
        description: 'Video player'
    },
    {
        id: 'quizzes',
        name: 'Quizzes',
        icon: '/quizzes.png',
        href: '/quizzes',
        gradient: 'from-purple-500 to-indigo-500',
        description: 'Educational quizzes'
    },
    {
        id: 'robot',
        name: 'Robot',
        icon: '/robot.png',
        href: '/robot',
        gradient: 'from-gray-600 to-slate-700',
        description: 'Robot control'
    },
    {
        id: 'morsecode',
        name: 'Morse Code',
        icon: '/morsecode.png',
        href: '/morsecode',
        gradient: 'from-blue-600 to-cyan-600',
        description: 'Morse code translator'
    },
    {
        id: 'calculator',
        name: 'Calculator',
        icon: '/calculator.png',
        href: '/calculator',
        gradient: 'from-slate-600 to-gray-700',
        description: 'Scientific calculator'
    },
    {
        id: 'games',
        name: 'Games',
        icon: '/games.png',
        href: '/games',
        gradient: 'from-purple-500 to-indigo-500',
        description: 'Educational games'
    },
    {
        id: 'dataflow',
        name: 'Data Flow',
        icon: '/dataflow.png',
        href: '/dataflow',
        gradient: 'from-teal-500 to-cyan-500',
        description: 'Data visualization'
    },
    {
        id: 'donate',
        name: 'Donate',
        icon: '/donate.png',
        href: '/donate',
        gradient: 'from-green-500 to-emerald-500',
        description: 'Support the project'
    },
    {
        id: 'flashlight',
        name: 'Flashlight',
        icon: '/flashlight.png',
        href: '/flashlight',
        gradient: 'from-yellow-400 to-yellow-600',
        description: 'Screen flashlight'
    },
    {
        id: 'utsa-interns',
        name: 'UTSA Interns',
        icon: '/utsa.png',
        href: '/utsa-interns',
        gradient: 'from-orange-600 to-blue-800',
        description: 'UTSA internship program'
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
        <div className="grid grid-cols-4 gap-16 w-fit mx-auto">
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
                            w-56 h-56 rounded-3xl
                            flex items-center justify-center
                            shadow-lg group-hover:shadow-xl
                            transition-all duration-200
                            ${pressedApp === app.id ? 'brightness-90' : ''}
                        `}>
                            {app.icon.startsWith('/') ? (
                                <Image
                                    src={app.icon}
                                    alt={app.name}
                                    width={224}
                                    height={224}
                                    className="w-56 h-56 object-contain rounded-3xl"
                                />
                            ) : (
                                <div className={`w-56 h-56 rounded-3xl bg-gradient-to-br ${app.gradient} flex items-center justify-center`}>
                                    <span className="text-9xl">{app.icon}</span>
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
                    <div className="mt-8 text-center">
                        <span className="text-white text-3xl font-medium leading-tight block">
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
        <div
            className="min-h-screen text-white flex flex-col relative"
            style={{
                backgroundImage: 'url(/Background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                minHeight: '300vh'
            }}
        >
            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-10">
                {/* Status Bar */}
                <div className="pt-20 pb-8">
                    <StatusBar />
                </div>

                {/* Screens Container */}
                <div className="flex-1 px-6 overflow-hidden pt-16">
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

                {/* Navigation Dots and Dock */}
                <div className="px-12 pt-96 pb-8">
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

                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 shadow-2xl">
                        <div className="flex justify-center space-x-16">
                            <a href="/phone" className="flex flex-col items-center gap-4 p-4 rounded-2xl hover:bg-white/20 transition-all duration-200">
                                <div className="w-56 h-56 rounded-3xl flex items-center justify-center">
                                    <Image
                                        src="/phone.png"
                                        alt="Phone"
                                        width={224}
                                        height={224}
                                        className="w-56 h-56 object-contain rounded-3xl"
                                    />
                                </div>
                                <span className="text-3xl text-white font-medium">Phone</span>
                            </a>

                            <a href="/facetime" className="flex flex-col items-center gap-4 p-4 rounded-2xl hover:bg-white/20 transition-all duration-200">
                                <div className="w-56 h-56 rounded-3xl flex items-center justify-center">
                                    <Image
                                        src="/facetime.png"
                                        alt="FaceTime"
                                        width={224}
                                        height={224}
                                        className="w-56 h-56 object-contain rounded-3xl"
                                    />
                                </div>
                                <span className="text-3xl text-white font-medium">FaceTime</span>
                            </a>

                            <a href="/messages" className="flex flex-col items-center gap-4 p-4 rounded-2xl hover:bg-white/20 transition-all duration-200">
                                <div className="w-56 h-56 rounded-3xl flex items-center justify-center">
                                    <Image
                                        src="/messages.png"
                                        alt="Messages"
                                        width={224}
                                        height={224}
                                        className="w-56 h-56 object-contain rounded-3xl"
                                    />
                                </div>
                                <span className="text-3xl text-white font-medium">Messages</span>
                            </a>

                            <a href="/mail" className="flex flex-col items-center gap-4 p-4 rounded-2xl hover:bg-white/20 transition-all duration-200">
                                <div className="w-56 h-56 rounded-3xl flex items-center justify-center">
                                    <Image
                                        src="/mail.png"
                                        alt="Mail"
                                        width={224}
                                        height={224}
                                        className="w-56 h-56 object-contain rounded-3xl"
                                    />
                                </div>
                                <span className="text-3xl text-white font-medium">Mail</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
