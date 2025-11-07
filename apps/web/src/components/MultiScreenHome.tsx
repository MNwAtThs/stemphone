'use client';

import { useState, useRef, useEffect, cloneElement } from 'react';
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

interface PopupDictionary {
    [key: string]: AppTile[];
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
        icon: '/images/apps/stem-superstars.png',
        href: '/stem-superstars',
        gradient: 'from-blue-500 to-purple-600',
        description: 'STEM education platform'
    },
    {
        id: 'nasa',
        name: 'NASA',
        icon: '/images/apps/nasa.png',
        href: '/nasa',
        gradient: 'from-gray-800 to-blue-900',
        description: 'NASA space exploration'
    },
    {
        id: 'ieee',
        name: 'IEEE',
        icon: '/images/apps/ieee.png',
        href: '/ieee',
        gradient: 'from-blue-600 to-indigo-700',
        description: 'IEEE engineering society'
    },
    {
        id: 'music',
        name: 'Music',
        icon: '/images/apps/music.png',
        href: '/music',
        gradient: 'from-pink-500 to-red-500',
        description: 'Music and audio player'
    },
    {
        id: 'photos',
        name: 'Photos',
        icon: '/images/apps/photos.png',
        href: '/photos',
        gradient: 'from-green-500 to-emerald-500',
        description: 'Photo gallery'
    },
    {
        id: 'videos',
        name: 'Videos',
        icon: '/images/apps/videos.png',
        href: '/videos',
        gradient: 'from-red-500 to-pink-500',
        description: 'Video player'
    },
    /* DISABLED - Not implemented
    {
        id: 'quizzes',
        name: 'Quizzes',
        icon: '/images/apps/quizzes.png',
        href: '/quizzes',
        gradient: 'from-purple-500 to-indigo-500',
        description: 'Educational quizzes'
    },
    */
    {
        id: 'morsecode',
        name: 'Morse Code',
        icon: '/images/apps/morsecode.png',
        href: '/morsecode',
        gradient: 'from-blue-600 to-cyan-600',
        description: 'Morse code translator'
    },
    {
        id: 'calculator',
        name: 'Calculator',
        icon: '/images/apps/calculator.png',
        href: '/calculator',
        gradient: 'from-slate-600 to-gray-700',
        description: 'Scientific calculator'
    },
    /* DISABLED - Not finished
    {
        id: 'games',
        name: 'Games',
        icon: '/images/apps/games.png',
        href: '/games',
        gradient: 'from-purple-500 to-indigo-500',
        description: 'Educational games'
    },
    */
    /* DISABLED - No LEDs installed
    {
        id: 'dataflow',
        name: 'Data Flow',
        icon: '/images/apps/dataflow.png',
        href: '/dataflow',
        gradient: 'from-teal-500 to-cyan-500',
        description: 'Data visualization'
    },
    */
    {
        id: 'donate',
        name: 'Donate',
        icon: '/images/apps/donate.png',
        href: '/donate',
        gradient: 'from-green-500 to-emerald-500',
        description: 'Support the project'
    },
    /* DISABLED - No Pucklight installed
    {
        id: 'flashlight',
        name: 'Flashlight',
        icon: '/images/apps/flashlight.png',
        href: '/flashlight',
        gradient: 'from-yellow-400 to-yellow-600',
        description: 'Screen flashlight'
    },
    */
    {
        id: 'utsa-interns',
        name: 'UTSA Interns',
        icon: '/images/apps/utsa.png',
        href: '/utsa-interns',
        gradient: 'from-orange-600 to-blue-800',
        description: 'UTSA internship program'
    }
];

/*
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
];*/

const homeScreens: HomeScreen[] = [
    {
        id: 'original',
        title: 'Classic Apps',
        apps: originalApps
    }/*,
    {
        id: 'modern',
        title: 'STEM Lab',
        apps: modernApps
    }*/
];

interface MultiScreenHomeProps {
    currentTime: Date;
}

export function MultiScreenHome({ currentTime }: MultiScreenHomeProps) {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [activePopupID, setActivePopupID] = useState<string | null>(null);
    const [activeApps, setActiveApps] = useState<AppTile[]>([]);
    const [popupHistory, setPopupHistory] = useState<string[]>([]);

    const goToScreen = (screenIndex: number) => {
        setCurrentScreen(screenIndex);
    };

    const popupApps: PopupDictionary = {
        // Popup app ordering: Row 1 (requested) then Row 2 (requested), then rest
        'stem-superstars': [
            // Row 1
            { id: 'samsat', name: 'SAMSAT', icon: '/images/apps/samsat.png', href: '/samsat', gradient: 'from-blue-500 to-indigo-600', description: 'SAMSAT' },
            { id: 'portsa', name: 'Port SA', icon: '/images/apps/portsa.png', href: '/portsa', gradient: 'from-teal-500 to-cyan-600', description: 'Port San Antonio' },
            { id: 'dsec', name: 'DSEC', icon: '/images/apps/dsec.png', href: '/dsec', gradient: 'from-slate-600 to-gray-700', description: 'Cybersecurity DSEC' },
            { id: 'robot', name: 'Robot', icon: '/images/apps/robot.png', href: '/robot', gradient: 'from-gray-600 to-slate-700', description: 'Robot control' },
            // Row 2
            { id: 'aviation', name: 'Aviation', icon: '/images/apps/aviation.png', href: '/aviation', gradient: 'from-sky-500 to-indigo-600', description: 'Aviation' },
            { id: 'space', name: 'Space', icon: '/images/apps/space.png', href: '/space', gradient: 'from-purple-600 to-indigo-700', description: 'Space' },
            { id: 'cyber', name: 'Cyber', icon: '/images/apps/cyber.png', href: '/cyber', gradient: 'from-slate-600 to-gray-700', description: 'Cybersecurity' },
            { id: 'vr', name: 'Virtual Reality', icon: '/images/apps/vr.png', href: '/vr', gradient: 'from-fuchsia-500 to-purple-600', description: 'Virtual Reality' },
            // Row 3 (requested)
            { id: 'ai', name: 'AI', icon: '/images/apps/ai.png', href: '/ai', gradient: 'from-emerald-500 to-teal-600', description: 'Artificial Intelligence' },
            { id: 'av', name: 'AV', icon: '/images/apps/av.png', href: '/av', gradient: 'from-amber-500 to-orange-600', description: 'Autonomous/Audio-Visual' },
            { id: 'computer', name: 'Computer', icon: '/images/apps/computer.png', href: '/computer', gradient: 'from-blue-600 to-indigo-700', description: 'Computer Science' },
            { id: 'it', name: 'IT', icon: '/images/apps/it.png', href: '/it', gradient: 'from-cyan-600 to-blue-700', description: 'Information Technology' }
        ],

        // Board of Directors (uses same popup UI as apps, 4x2 grid)
        'samsat': [
            // Row 1 (left to right)
            //{ id: 'david-monroe', name: 'David Monroe', icon: '/images/people/samsatbod/davidmonroe.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Board member' },
            { id: 'dominic-papagni', name: 'Dominic Papagni', icon: '/images/people/samsatbod/dominicpapagni.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Board member' },
            { id: 'allison-levine', name: 'Allison Levine', icon: '/images/people/samsatbod/allisonlevine.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Board member' },
            { id: 'philip-nelson', name: 'Philip Nelson', icon: '/images/people/samsatbod/philipnelson.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Board member' },
            // Row 2 (left to right)
            { id: 'ricardo-maldonado', name: 'Ricardo Maldonado', icon: '/images/people/samsatbod/ricardomaldonado.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Board member' },
            { id: 'raul-reyna', name: 'Raul Reyna', icon: '/images/people/samsatbod/raulreyna.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Board member' },
            { id: 'scott-gray', name: 'Scott Gray', icon: '/images/people/unknown.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Board member' },
            { id: 'john-strieby', name: 'John Strieby', icon: '/images/people/unknown.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Board member' }
        ],

        // Port SA Leadership grid (3x4), uses available Port SA images
        'portsa': [
            // Row 1
            { id: 'abigail-ottmers', name: 'Abigail Ottmers', icon: '/images/people/portsa/abigailottmers.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Port SA leader' },
            { id: 'adrienne-cox', name: 'Adrienne Cox', icon: '/images/people/portsa/adriennecox.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Port SA leader' },
            { id: 'caroline-diaz', name: 'Caroline Diaz', icon: '/images/people/portsa/carolinediaz.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Port SA leader' },
            { id: 'curtis-casey', name: 'Curtis Casey', icon: '/images/people/portsa/curtiscasey.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Port SA leader' },
            // Row 2
            { id: 'jim-perschbach', name: 'Jim Perschbach', icon: '/images/people/portsa/jimperschbach.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Port SA leader' },
            { id: 'juan-antonio', name: 'Juan Antonio', icon: '/images/people/portsa/juanantonio.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Port SA leader' },
            { id: 'marcel-johnson', name: 'Marcel Johnson', icon: '/images/people/portsa/marceljohnson.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Port SA leader' },
            { id: 'paco-felici', name: 'Paco Felici', icon: '/images/people/portsa/pacofelici.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Port SA leader' },
            // Row 3
            { id: 'pat-cruzen', name: 'Pat Cruzen', icon: '/images/people/portsa/patcruzen.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Port SA leader' },
            { id: 'ramon-flores', name: 'Ramon Flores', icon: '/images/people/portsa/ramonflores.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Port SA leader' },
            { id: 'rick-crider', name: 'Rick Crider', icon: '/images/people/portsa/rickcrider.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Port SA leader' },
            { id: 'will-garrett', name: 'Will Garrett', icon: '/images/people/portsa/willgarrett.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'Port SA leader' }
        ],

	//IEEE
        'ieee': [
            // Row 1
            { id: 'walt-downing', name: 'Walt Downing', icon: '/images/people/ieee/waltdowning.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'IEEE Member' },
            { id: 'nils-smith', name: 'Nils Smith', icon: '/images/people/ieee/nilssmith.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'IEEE Member' },
            { id: 't-scott-atkinson', name: 'T. Scott Atkinson', icon: '/images/people/ieee/tscottatkinson.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'IEEE Member' },
            { id: 'garrett-polhamus', name: 'Garrett Polhamus', icon: '/images/people/unknown.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'IEEE Member' },
            { id: 'ernest-franke', name: 'Ernest Franke', icon: '/images/people/ieee/ernestfranke.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'IEEE Member' },
            { id: 'chris-camargo', name: 'Chris Camargo', icon: '/images/people/unknown.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'IEEE Member' },
            { id: 'joe-redfield', name: 'Joe Redfield', icon: '/images/people/ieee/joeredfield.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'IEEE Member' },
            { id: 'jennifer-henriquez', name: 'Jennifer Henriquez', icon: '/images/people/ieee/jenniferhenriquez.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'IEEE Member' },
            { id: 'sriram-nagaraj', name: 'Sriram Nagaraj', icon: '/images/people/unknown.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'IEEE Member' },
            { id: 'warren-conner', name: 'Warren Conner', icon: '/images/people/unknown.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'IEEE Member' },
            { id: 'patrick-stockton', name: 'Patrick Stockton', icon: '/images/people/unknown.png', href: '#', gradient: 'from-gray-200 to-gray-300', description: 'IEEE Member' },
        ],

        // DSEC - Shows article content instead of app grid
        'dsec': [],

        // Music Player - Shows music player UI
        'music': [],

        // Robot - Shows robot image
        'robot': [],

        // Aviation - Shows aviation image
        'aviation': [],

        // Space - Shows space image
        'space': [],

        // AI - Shows AI image
        'ai': [],

        // NASA - Shows NASA photo gallery
        'nasa': [],

        // Photos - Shows photo gallery
        'photos': [],

        // Videos - Shows video gallery
        'videos': [],

	// Sammy - Shows Sammy image
	'sammy': [],

	// Donate - Shows donate gallery
	'donate': [],

	// Sammy - Shows Sammy image
	'morsecode': [],
    };

    // Map popup IDs to their titles
    const popupTitles: { [key: string]: string } = {
        'samsat': 'Board of Directors',
        'portsa': 'Port SA Leadership',
        'ieee': 'IEEE',
        'dsec': 'DSEC',
        'music': 'Music Player',
        'robot': 'ROBOTS',
	'sammy': 'Sammy',
        'aviation': 'AVIATION',
        'space': 'SPACE',
        'ai': 'ARTIFICIAL INTELLIGENCE',
        'nasa': 'NASA Photo Gallery',
        'photos': 'Photos',
        'videos': 'Video',
	'donate': 'Donate to Samsat',
	'morsecode': 'Learn Morse Code',
    };

    const handleAppClick = (app: AppTile) => {
        // Don't open popup if href is '#' (people images) or if no popup exists
        if (app.href === '#' || popupApps[app.id] == null) {
            return;
        }
        // Track popup history - if we're opening a nested popup, save current popup to history
        if (activePopupID) {
            setPopupHistory([...popupHistory, activePopupID]);
        }
        setActivePopupID(app.id);
        setActiveApps(popupApps[app.id]);
        return;
    };

    const handlePopupClose = () => {
        // If there's history, go back to previous popup
        if (popupHistory.length > 0) {
            const previousPopupID = popupHistory[popupHistory.length - 1];
            const newHistory = popupHistory.slice(0, -1);
            setPopupHistory(newHistory);
            setActivePopupID(previousPopupID);
            setActiveApps(popupApps[previousPopupID]);
        } else {
            // No history, close completely
            setActivePopupID(null);
            setActiveApps([]);
            setPopupHistory([]);
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
            className="h-[1920px] text-white flex flex-col relative"
            style={{
                backgroundImage: 'url(/images/background/Background.png)',
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
                                        src="/images/apps/phone.png"
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
                                        src="/images/apps/facetime.png"
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
                                        src="/images/apps/messages.png"
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
                                        src="/images/apps/mail.png"
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
                isOpen={activePopupID != null}
                onClose={handlePopupClose}
                apps={activeApps}
                title={activePopupID ? (popupTitles[activePopupID] || 'Apps') : 'Apps'}
                onItemClick={(app) => { handleAppClick(app) }}
            />

        </div>
    );
}
