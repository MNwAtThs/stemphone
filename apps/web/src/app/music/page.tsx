'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AudioEngine } from '@/lib/AudioEngine';

interface Track {
    id: string;
    title: string;
    artist: string;
    duration: number;
    src: string;
    cover?: string;
}

// Demo tracks (in production, these would come from an API or local files)
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

export default function MusicPage() {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [audioEngine] = useState(() => AudioEngine.getInstance());

    useEffect(() => {
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

        return () => {
            // Cleanup on unmount
            audioEngine.stop();
        };
    }, [audioEngine]);

    const playTrack = (track: Track) => {
        if (currentTrack?.id === track.id && isPlaying) {
            audioEngine.pause();
        } else {
            setCurrentTrack(track);
            audioEngine.loadAndPlay(track.src, volume);
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

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        audioEngine.setVolume(newVolume);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/home" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">Music</h1>
                <div className="w-8"></div>
            </div>

            {/* Now Playing Section */}
            {currentTrack && (
                <div className="p-6 bg-black/20 backdrop-blur-sm m-4 rounded-2xl">
                    <div className="text-center mb-6">
                        <div className="text-6xl mb-4">{currentTrack.cover}</div>
                        <h2 className="text-2xl font-bold mb-2">{currentTrack.title}</h2>
                        <p className="text-gray-300">{currentTrack.artist}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-300 mb-2">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(currentTrack.duration)}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-white rounded-full h-2 transition-all duration-300"
                                style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center space-x-8">
                        <button
                            onClick={stopTrack}
                            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                            <div className="w-6 h-6 bg-white rounded-sm"></div>
                        </button>

                        <button
                            onClick={togglePlayPause}
                            className="p-4 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
                        >
                            {isPlaying ? (
                                <div className="flex space-x-1">
                                    <div className="w-2 h-6 bg-black"></div>
                                    <div className="w-2 h-6 bg-black"></div>
                                </div>
                            ) : (
                                <div className="w-0 h-0 border-l-[12px] border-l-black border-y-[8px] border-y-transparent ml-1"></div>
                            )}
                        </button>

                        <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                            <div className="text-xl">🔀</div>
                        </button>
                    </div>

                    {/* Volume Control */}
                    <div className="mt-6">
                        <div className="flex items-center space-x-4">
                            <span className="text-xl">🔊</span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-sm text-gray-300">{Math.round(volume * 100)}%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Track List */}
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-4">Available Tracks</h3>
                <div className="space-y-2">
                    {demoTracks.map((track) => (
                        <button
                            key={track.id}
                            onClick={() => playTrack(track)}
                            className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${currentTrack?.id === track.id
                                ? 'bg-white/20 border-2 border-white/40'
                                : 'bg-white/10 hover:bg-white/15'
                                }`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="text-3xl">{track.cover}</div>
                                <div className="flex-1">
                                    <h4 className="font-semibold">{track.title}</h4>
                                    <p className="text-gray-300 text-sm">{track.artist}</p>
                                    <p className="text-gray-400 text-xs">{formatTime(track.duration)}</p>
                                </div>
                                {currentTrack?.id === track.id && isPlaying && (
                                    <div className="text-2xl animate-pulse">🎵</div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Warning Message */}
            <div className="p-4 m-4 bg-yellow-900/50 rounded-xl border border-yellow-600/50">
                <p className="text-sm text-yellow-200">
                    <strong>Note:</strong> Audio files are not included in this demo.
                    In production, add audio files to the <code>/public/audio/</code> directory.
                </p>
            </div>
        </div>
    );
}
