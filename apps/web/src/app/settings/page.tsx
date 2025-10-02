'use client';

import Link from 'next/link';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">Settings</h1>
                <div className="w-8"></div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
                <div className="text-8xl mb-6">⚙️</div>
                <h2 className="text-3xl font-bold mb-4">Settings</h2>
                <p className="text-gray-300 mb-8">Configuration options coming soon!</p>

                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6">
                    <p className="text-lg">
                        This app will provide settings for volume, brightness,
                        accessibility options, and system preferences.
                    </p>
                </div>
            </div>
        </div>
    );
}
