'use client';

import { useState } from 'react';
import { AppPopup } from '@/components/AppPopup';

interface AppTile {
    id: string;
    name: string;
    icon: string;
    href: string;
    gradient: string;
    description: string;
}

// STEM Superstars specific apps
const stemSuperstarsApps: AppTile[] = [
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
    }
];

export default function StemSuperstars() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <div
            className="min-h-screen text-white flex flex-col relative"
            style={{
                backgroundImage: 'url(/Background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-6xl font-bold mb-8">STEM Superstars</h1>
                    <p className="text-2xl mb-12">Educational STEM Platform</p>
                    <button
                        onClick={handleOpenPopup}
                        className="bg-white/20 backdrop-blur-md rounded-3xl px-8 py-4 text-2xl font-medium hover:bg-white/30 transition-colors border border-white/20"
                    >
                        View All Apps
                    </button>
                </div>
            </div>

            <AppPopup
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
                apps={stemSuperstarsApps}
            />
        </div>
    );
}
