'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatusBar } from '@/components/StatusBar';
import { AppGrid } from '@/components/AppGrid';

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
        {/* Time Display */}
        <div className="text-center py-8 px-4">
          <div className="text-6xl font-thin tracking-wide mb-2">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </div>
          <div className="text-lg text-gray-300">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* App Grid */}
        <div className="flex-1 px-6">
          <AppGrid />
        </div>

        {/* Dock */}
        <div className="px-6 pb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <div className="flex justify-center space-x-8">
              <Link href="/" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                  🏠
                </div>
                <span className="text-xs text-gray-300">Home</span>
              </Link>

              <Link href="/music" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center text-2xl">
                  🎵
                </div>
                <span className="text-xs text-gray-300">Music</span>
              </Link>

              <Link href="/lights" className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
                  💡
                </div>
                <span className="text-xs text-gray-300">Lights</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
