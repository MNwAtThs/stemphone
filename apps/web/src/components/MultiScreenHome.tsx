'use client';

import { useState, useRef, useEffect } from 'react';
import { StatusBar } from '@/components/StatusBar';
import { AppPopup } from '@/components/AppPopup';
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
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const goToScreen = (screenIndex: number) => {
        setCurrentScreen(screenIndex);
    };

    // Popup app ordering: Row 1 (requested) then Row 2 (requested), then rest
    const popupApps: AppTile[] = [
        // Row 1
        { id: 'samsat', name: 'SAMSAT', icon: '/samsat.png', href: '/samsat', gradient: 'from-blue-500 to-indigo-600', description: 'SAMSAT' },
        { id: 'portsa', name: 'Port SA', icon: '/portsa.png', href: '/portsa', gradient: 'from-teal-500 to-cyan-600', description: 'Port San Antonio' },
        { id: 'dsec', name: 'DSEC', icon: '/dsec.png', href: '/dsec', gradient: 'from-slate-600 to-gray-700', description: 'Cybersecurity DSEC' },
        { id: 'robot', name: 'Robot', icon: '/robot.png', href: '/robot', gradient: 'from-gray-600 to-slate-700', description: 'Robot control' },
        // Row 2
        { id: 'aviation', name: 'Aviation', icon: '/aviation.png', href: '/aviation', gradient: 'from-sky-500 to-indigo-600', description: 'Aviation' },
        { id: 'space', name: 'Space', icon: '/space.png', href: '/space', gradient: 'from-purple-600 to-indigo-700', description: 'Space' },
        { id: 'cyber', name: 'Cyber', icon: '/cyber.png', href: '/cyber', gradient: 'from-slate-600 to-gray-700', description: 'Cybersecurity' },
        { id: 'vr', name: 'Virtual Reality', icon: '/vr.png', href: '/vr', gradient: 'from-fuchsia-500 to-purple-600', description: 'Virtual Reality' },
        // Row 3 (requested)
        { id: 'ai', name: 'AI', icon: '/ai.png', href: '/ai', gradient: 'from-emerald-500 to-teal-600', description: 'Artificial Intelligence' },
        { id: 'av', name: 'AV', icon: '/av.png', href: '/av', gradient: 'from-amber-500 to-orange-600', description: 'Autonomous/Audio-Visual' },
        { id: 'computer', name: 'Computer', icon: '/computer.png', href: '/computer', gradient: 'from-blue-600 to-indigo-700', description: 'Computer Science' },
        { id: 'it', name: 'IT', icon: '/it.png', href: '/it', gradient: 'from-cyan-600 to-blue-700', description: 'Information Technology' }
    ];

    const handleAppClick = (app: AppTile) => {
        if (app.id === 'stem-superstars') {
            setIsPopupOpen(true);
        } else {
            window.location.href = app.href;
        }
    };

    const AppGridComponent = ({ apps }: { apps: AppTile[] }) => (
        <div className="grid grid-cols-4 gap-16 w-fit mx-auto">
            {apps.map((app) => (
                <div
                    key={app.id}
                    onClick={() => handleAppClick(app)}
                    className={`
                        relative group block cursor-pointer
                        transform transition-all duration-150 ease-out
                        hover:scale-105 active:scale-95
                    `}
                >
                    {/* App Icon Container */}
                    <div className="relative">
                        {/* Icon Background */}
                        <div className={`
                            w-56 h-56 rounded-3xl
                            flex items-center justify-center
                            shadow-lg group-hover:shadow-xl
                            transition-all duration-200
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
                </div>
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
                <div className="flex-1 px-0 overflow-hidden pt-16">
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
                                className="w-full flex-shrink-0 flex items-center justify-center px-6 md:px-12"
                                style={{ width: `${100 / homeScreens.length}%` }}
                            >
                                <AppGridComponent apps={screen.apps} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Screen Indicator Dots removed (kept only the set near the dock) */}

                {/* Navigation Dots and Dock */}
                <div className="px-0 pt-96 pb-8">
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

                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-3 border border-white/20 shadow-2xl w-fit mx-auto max-w-full overflow-hidden">
                        <div className="flex justify-center space-x-5 w-fit">
                            <a href="/phone" className="flex flex-col items-center gap-3 p-3 rounded-2xl hover:bg-white/20 transition-all duration-200">
                                <div className="w-48 h-48 rounded-3xl flex items-center justify-center">
                                    <Image
                                        src="/phone.png"
                                        alt="Phone"
                                        width={192}
                                        height={192}
                                        className="w-48 h-48 object-contain rounded-3xl"
                                    />
                                </div>
                                <span className="text-2xl text-white font-medium">Phone</span>
                            </a>

                            <a href="/facetime" className="flex flex-col items-center gap-3 p-3 rounded-2xl hover:bg-white/20 transition-all duration-200">
                                <div className="w-48 h-48 rounded-3xl flex items-center justify-center">
                                    <Image
                                        src="/facetime.png"
                                        alt="FaceTime"
                                        width={192}
                                        height={192}
                                        className="w-48 h-48 object-contain rounded-3xl"
                                    />
                                </div>
                                <span className="text-2xl text-white font-medium">FaceTime</span>
                            </a>

                            <a href="/messages" className="flex flex-col items-center gap-3 p-3 rounded-2xl hover:bg-white/20 transition-all duration-200">
                                <div className="w-48 h-48 rounded-3xl flex items-center justify-center">
                                    <Image
                                        src="/messages.png"
                                        alt="Messages"
                                        width={192}
                                        height={192}
                                        className="w-48 h-48 object-contain rounded-3xl"
                                    />
                                </div>
                                <span className="text-2xl text-white font-medium">Messages</span>
                            </a>

                            <a href="/mail" className="flex flex-col items-center gap-3 p-3 rounded-2xl hover:bg-white/20 transition-all duration-200">
                                <div className="w-48 h-48 rounded-3xl flex items-center justify-center">
                                    <Image
                                        src="/mail.png"
                                        alt="Mail"
                                        width={192}
                                        height={192}
                                        className="w-48 h-48 object-contain rounded-3xl"
                                    />
                                </div>
                                <span className="text-2xl text-white font-medium">Mail</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* App Popup */}
            <AppPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                apps={popupApps}
            />
        </div>
    );
}
