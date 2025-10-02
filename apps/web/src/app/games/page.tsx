'use client';

import Link from 'next/link';

export default function GamesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/home" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">Games</h1>
                <div className="w-8"></div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
                <div className="text-8xl mb-6">🎮</div>
                <h2 className="text-3xl font-bold mb-4">Games</h2>
                <p className="text-gray-300 mb-8">Interactive games coming soon!</p>

                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6">
                    <p className="text-lg">
                        This app will feature educational games and interactive experiences
                        designed for museum visitors of all ages.
                    </p>
                </div>
            </div>
        </div>
    );
}
