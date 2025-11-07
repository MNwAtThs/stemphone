'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AudioEngine } from '@/lib/AudioEngine';

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
    onItemClick?: (app: AppTile) => void;
    title?: string;
}

interface Track {
    id: string;
    title: string;
    artist: string;
    duration: number;
    src: string;
    cover?: string;
}

const demoTracks: Track[] = [
    {
        id: '1',
        title: 'Ambient Space',
        artist: 'SAMSAT Audio',
        duration: 180,
        src: '/audio/ambient-space.mp3',
        cover: '🌌'
    },
    {
        id: '2',
        title: 'Ocean Waves',
        artist: 'Nature Sounds',
        duration: 240,
        src: '/audio/ocean-waves.mp3',
        cover: '🌊'
    },
    {
        id: '3',
        title: 'Forest Birds',
        artist: 'Nature Sounds',
        duration: 200,
        src: '/audio/forest-birds.mp3',
        cover: '🌲'
    },
    {
        id: '4',
        title: 'Rain Drops',
        artist: 'Relaxing Sounds',
        duration: 300,
        src: '/audio/rain-drops.mp3',
        cover: '🌧️'
    }
];

export function AppPopup({ isOpen, onClose, apps, onItemClick, title = 'STEM Superstars Apps' }: AppPopupProps) {
    const [pressedApp, setPressedApp] = useState<string | null>(null);
    
    // Music player state
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [audioEngine] = useState(() => AudioEngine.getInstance());
    const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());

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

    // Music player effects
    useEffect(() => {
        if (title === 'Music Player') {
            // Set up audio engine callbacks
            audioEngine.onPlay = () => setIsPlaying(true);
            audioEngine.onPause = () => setIsPlaying(false);
            audioEngine.onStop = () => {
                setIsPlaying(false);
                setCurrentTime(0);
            };
            audioEngine.onTimeUpdate = (time: number) => setCurrentTime(time);
            audioEngine.onTrackEnd = () => {
                setIsPlaying(false);
                setCurrentTime(0);
            };
            audioEngine.onError = (error: Error | string) => {
                console.warn('Audio error:', error);
                setIsPlaying(false);
                // Don't show error to user, just stop playback
            };

            return () => {
                // Cleanup on unmount or title change
                audioEngine.stop();
            };
        }
    }, [title, audioEngine]);

    const playTrack = (track: Track) => {
        if (currentTrack?.id === track.id && isPlaying) {
            audioEngine.pause();
        } else {
            setCurrentTrack(track);
            try {
                audioEngine.loadAndPlay(track.src, volume);
            } catch (error) {
                console.warn('Failed to play track:', track.title, error);
                setIsPlaying(false);
            }
        }
    };

    const togglePlayPause = () => {
        if (currentTrack) {
            if (isPlaying) {
                audioEngine.pause();
            } else {
                audioEngine.play();
            }
        }
    };

    const stopTrack = () => {
        audioEngine.stop();
        setCurrentTrack(null);
    };

    const playNextTrack = () => {
        if (!currentTrack) return;
        const currentIndex = demoTracks.findIndex(t => t.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % demoTracks.length;
        playTrack(demoTracks[nextIndex]);
    };

    const playPreviousTrack = () => {
        if (!currentTrack) return;
        const currentIndex = demoTracks.findIndex(t => t.id === currentTrack.id);
        const prevIndex = currentIndex === 0 ? demoTracks.length - 1 : currentIndex - 1;
        playTrack(demoTracks[prevIndex]);
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        audioEngine.setVolume(newVolume);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        audioEngine.seek(newTime);
        setCurrentTime(newTime);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleLike = (trackId: string) => {
        setLikedTracks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(trackId)) {
                newSet.delete(trackId);
            } else {
                newSet.add(trackId);
            }
            return newSet;
        });
    };

    const isLiked = (trackId: string) => likedTracks.has(trackId);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-3xl p-8 max-w-6xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative">
                {/* Close button - Top right of popup */}
                <button
                    onClick={onClose}
                    className="absolute right-8 top-8 rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 transition-colors z-10"
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

                {/* Samsat Logo for Board of Directors - Above the title */}
                {title === 'Board of Directors' && (
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/logos/samsat_logo.png"
                            alt="Samsat Logo"
                            width={200}
                            height={100}
                            className="h-16 w-auto"
                        />
                    </div>
                )}

                {/* Port SA Logo for Port SA Leadership - Above the title */}
                {title === 'Port SA Leadership' && (
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/logos/portsa_logo.png"
                            alt="Port SA Logo"
                            width={200}
                            height={100}
                            className="h-16 w-auto"
                        />
                    </div>
                )}

                {/* IEEE Logo for IEEE - Above the title */}
                {title === 'IEEE' && (
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/logos/ieee_logo.png"
                            alt="IEEE Logo"
                            width={200}
                            height={100}
                            className="h-16 w-auto"
                        />
                    </div>
                )}

                {/* DSEC Logo for DSEC Article - Above the title */}
                {title === 'DSEC' && (
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/apps/dsec.png"
                            alt="DSEC Logo"
                            width={200}
                            height={100}
                            className="h-16 w-auto"
                        />
                    </div>
                )}

                {/* IEEE Logo for IEEE Members - Above the title */}
                {title === 'IEEE' && (
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/logos/IEEE-logo.png"
                            alt="IEEE Logo"
                            width={200}
                            height={100}
                            className="h-16 w-auto"
                        />
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-5xl font-bold text-gray-900 text-center">{title}</h2>
                </div>

                {/* DSEC Article Content */}
                {title === 'DSEC' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-blue-50 rounded-2xl p-8 mb-6">
                            <div className="text-center mb-6">
                                <div className="text-6xl font-bold text-blue-600 mb-2">53,053</div>
                                <div className="text-lg text-gray-700">students, educators, and other participants engaged in DSEC-funded activities during Option Year Two</div>
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h3>

                            <p className="text-gray-700 mb-4">
                                This Annual Program Review summarizes the activities and outcomes of the Defense Science, Technology, Engineering, and Mathematics (STEM) Education Consortium (DSEC) during Option Year Two, September 1, 2021 – August 31, 2022.
                            </p>

                            <p className="text-gray-700 mb-4">
                                Launched in 2019 by the Department of Defense (DoD), DSEC is a collaborative partnership designed to broaden STEM literacy and develop a diverse and agile workforce for national defense. The consortium is aligned to the Federal STEM Education Strategic Plan and represents DoD's investment in evidence-based approaches to develop the science and technology workforce.
                            </p>

                            <h4 className="text-xl font-semibold text-gray-900 mb-3">Management Elements</h4>
                            <p className="text-gray-700 mb-3">To achieve its goals, DSEC is organized into five management elements:</p>

                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                                <li><strong>Element 1:</strong> Provides leadership and coordination of DSEC, including planning and execution of consortium-wide deliverables</li>
                                <li><strong>Element 2:</strong> Manages data collection, assessment/analysis, and reports for DSEC</li>
                                <li><strong>Element 3:</strong> Promotes DoD STEM and DSEC as a coordinated and cohesive effort offering students and teachers a pathway of STEM education and career opportunities</li>
                                <li><strong>Element 4:</strong> Develops and implements evidence-based STEM education programs and activities</li>
                                <li><strong>Element 5:</strong> Provides technical assistance and professional development for STEM educators</li>
                            </ul>

                            <div className="bg-gray-100 rounded-lg p-4 mt-6">
                                <p className="text-sm text-gray-600 italic">
                                    DSEC continues to make significant progress in advancing STEM education and workforce development through collaborative partnerships and evidence-based programming.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : title === 'ROBOTS' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <Image
                                src="/images/graphics/robotics-engineer-working-on-maintenance-of-roboti-2023-11-27-05-28-47-utc-scaled.jpg"
                                alt="Robotics Engineer"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                ) : title === 'AVIATION' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <Image
                                src="/images/graphics/the-history-of-boeing-aviation-v0-qbf8n6b497ga1.png.webp"
                                alt="History of Boeing Aviation"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                ) : title === 'SPACE' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <Image
                                src="/images/graphics/astronaut-in-space.jpg"
                                alt="Astronaut in Space"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                ) : title === 'ARTIFICIAL INTELLIGENCE' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <Image
                                src="/images/graphics/Artificial_Intelligence__AI__Machine_Learning_-_30212411048.jpg"
                                alt="Artificial Intelligence"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                ) : title === 'NASA Photo Gallery' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <Image
                                src="/images/graphics/Nasa-5.jpg"
                                alt="NASA Photo Gallery"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                ) : title === 'Music Player' ? (
                    <div className="max-w-2xl mx-auto">
                        {/* Album Cover and Track Info */}
                        <div className="text-center mb-8">
                            <div className="inline-block mb-4">
                                <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 shadow-2xl flex items-center justify-center overflow-hidden">
                                    {currentTrack ? (
                                        <div className="text-9xl">{currentTrack.cover || '🎵'}</div>
                                    ) : (
                                        <div className="text-9xl text-white/50">🎵</div>
                                    )}
                                </div>
                            </div>
                            {currentTrack && (
                                <div className="mt-4 px-4">
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        <div className="flex-1 min-w-0 overflow-hidden relative h-8 flex items-center justify-center">
                                            {currentTrack.title.length > 20 ? (
                                                <div className="marquee-container w-full">
                                                    <div className="marquee-text text-2xl font-bold text-gray-900">
                                                        {currentTrack.title} • {currentTrack.title}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {currentTrack.title}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => toggleLike(currentTrack.id)}
                                            className="flex-shrink-0 p-2 hover:scale-110 transition-transform active:scale-95"
                                            title={isLiked(currentTrack.id) ? "Unlike" : "Like"}
                                        >
                                            <svg 
                                                className={`w-7 h-7 transition-all duration-200 ${
                                                    isLiked(currentTrack.id) 
                                                        ? 'text-red-500 fill-current scale-110' 
                                                        : 'text-gray-400 hover:text-red-400'
                                                }`}
                                                fill={isLiked(currentTrack.id) ? "currentColor" : "none"}
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-gray-600 text-lg">{currentTrack.artist}</p>
                                </div>
                            )}
                        </div>

                        {/* Player Controls */}
                        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                            {/* Progress Bar */}
                            <div className="mb-6">
                                <input
                                    type="range"
                                    min="0"
                                    max={currentTrack?.duration || 0}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                />
                                <div className="flex justify-between text-sm text-gray-600 mt-1">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(currentTrack?.duration || 0)}</span>
                                </div>
                            </div>

                            {/* Control Buttons */}
                            <div className="flex items-center justify-center space-x-6 mb-6">
                                {/* Previous Track Button */}
                                <button
                                    onClick={playPreviousTrack}
                                    className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!currentTrack}
                                    title="Previous Track"
                                >
                                    <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                                    </svg>
                                </button>

                                {/* Play/Pause Button */}
                                <button
                                    onClick={togglePlayPause}
                                    className="p-5 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!currentTrack}
                                    title={isPlaying ? "Pause" : "Play"}
                                >
                                    {isPlaying ? (
                                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>

                                {/* Next Track Button */}
                                <button
                                    onClick={playNextTrack}
                                    className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!currentTrack}
                                    title="Next Track"
                                >
                                    <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0011 6v2.798l-5.445-3.63z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Volume Control */}
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                </svg>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                />
                                <span className="text-sm text-gray-600 w-12 text-right">{Math.round(volume * 100)}%</span>
                            </div>
                        </div>

                        {/* Track List */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Tracks</h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {demoTracks.map((track) => (
                                    <div
                                        key={track.id}
                                        onClick={() => playTrack(track)}
                                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                                            currentTrack?.id === track.id
                                                ? 'bg-purple-100 border-2 border-purple-400'
                                                : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="text-3xl">{track.cover}</div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 truncate">{track.title}</h4>
                                                <p className="text-gray-600 text-sm">{track.artist}</p>
                                                <p className="text-gray-500 text-xs">{formatTime(track.duration)}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {currentTrack?.id === track.id && isPlaying && (
                                                    <div className="text-2xl animate-pulse">🎵</div>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleLike(track.id);
                                                    }}
                                                    className="p-1 hover:scale-110 transition-transform"
                                                    type="button"
                                                >
                                                    <svg 
                                                        className={`w-5 h-5 transition-colors ${
                                                            isLiked(track.id) 
                                                                ? 'text-red-500 fill-current' 
                                                                : 'text-gray-400 hover:text-red-400'
                                                        }`}
                                                        fill={isLiked(track.id) ? "currentColor" : "none"}
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* App Grid */
                    <div className="grid grid-cols-4 gap-4 justify-items-center">
                        {apps.map((app) => (
                            onItemClick && app.href !== '#' ? (
                                <button
                                    key={app.id}
                                    type="button"
                                    className={`
                                    relative group block cursor-pointer pointer-events-auto z-10
                                    transform transition-all duration-150 ease-out
                                    ${pressedApp === app.id ? 'scale-95' : 'hover:scale-105'}
                                    active:scale-95
                                `}
                                    onClick={() => onItemClick(app)}
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
                                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>

                                        {/* Press effect */}
                                        {/* Press effect disabled to avoid intercepting clicks */}
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
                                </button>
                            ) : app.href !== '#' ? (
                                <a
                                    key={app.id}
                                    href={app.href}
                                    className={`
                                    relative group block
                                    transform transition-all duration-150 ease-out
                                    cursor-pointer
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
                            ) : (
                                <div
                                    key={app.id}
                                    className="relative group block cursor-default"
                                >
                                    {/* App Icon Container */}
                                    <div className="relative">
                                        {/* Icon Background */}
                                        <div className="w-40 h-40 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-200">
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
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
