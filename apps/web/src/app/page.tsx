'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LockScreen() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isClient, setIsClient] = useState(false);
    const [particles, setParticles] = useState<Array<{ left: string, top: string, delay: string, duration: string }>>([]);

    useEffect(() => {
        // Set client-side flag to prevent hydration mismatch
        setIsClient(true);

        // Generate particles only on client side
        const newParticles = [...Array(20)].map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            delay: `${Math.random() * 3}s`,
            duration: `${2 + Math.random() * 3}s`
        }));
        setParticles(newParticles);

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div
            className="min-h-screen text-white flex flex-col relative overflow-hidden"
            style={{
                backgroundImage: 'url(/Background.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            }}
        >
            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                        {/* Signal bars */}
                        <div className="flex items-end gap-1">
                            <div className="w-1 h-2 bg-white rounded-full"></div>
                            <div className="w-1 h-3 bg-white rounded-full"></div>
                            <div className="w-1 h-4 bg-white rounded-full"></div>
                            <div className="w-1 h-5 bg-white rounded-full"></div>
                        </div>
                        <span className="font-medium">SAMSAT</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>100%</span>
                        <div className="w-6 h-3 border border-white rounded-sm">
                            <div className="w-full h-full bg-green-400 rounded-sm"></div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                    {/* Time Display */}
                    <div className="text-center mb-12">
                        <div className="text-8xl font-thin tracking-wider mb-4 drop-shadow-2xl">
                            {formatTime(currentTime)}
                        </div>
                        <div className="text-2xl text-gray-300 font-light">
                            {formatDate(currentTime)}
                        </div>
                    </div>

                    {/* Museum Branding */}
                    <div className="text-center mb-16">
                        <div className="text-6xl mb-4 animate-bounce">🏛️</div>
                        <h1 className="text-3xl font-light mb-2">Stemphone</h1>
                        <p className="text-lg text-gray-400 mb-4">San Antonio Museum of Science & Technology</p>

                        {/* Interactive hint */}
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <span>Interactive Experience</span>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    {/* Unlock Button */}
                    <div className="relative">
                        <Link
                            href="/home"
                            className="
                relative group block
                w-32 h-32 rounded-full
                bg-gradient-to-br from-white/20 to-white/5
                border-2 border-white/30
                backdrop-blur-md
                flex items-center justify-center
                transition-all duration-300
                hover:scale-105 hover:border-white/50 active:scale-95
              "
                        >
                            {/* Unlock Icon */}
                            <div className="text-4xl transition-all duration-300 group-hover:scale-110">
                                🔓
                            </div>
                        </Link>

                        {/* Instruction text */}
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                            <p className="text-white/80 text-lg animate-pulse">
                                Tap to unlock
                            </p>

                            {/* Swipe up hint */}
                            <div className="mt-2 flex justify-center">
                                <div className="text-2xl animate-bounce">↑</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="text-center pb-8 px-6">
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>Interactive Experience Ready</span>
                        </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                        Touch anywhere to begin your journey
                    </div>
                </div>
            </div>
        </div>
    );
}
