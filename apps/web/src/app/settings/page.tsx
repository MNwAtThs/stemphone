'use client';

import Link from 'next/link';

export default function SettingsPage() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/home" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">Settings</h1>
                <div className="w-8"></div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">⚙️</div>
                    <h2 className="text-2xl font-bold mb-2">Settings</h2>
                    <p className="text-gray-400">Configure your Stemphone experience</p>
                </div>


                {/* System Info */}
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-2xl">ℹ️</div>
                        <div>
                            <h3 className="text-lg font-semibold">System Information</h3>
                            <p className="text-sm text-gray-400">Device and app details</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Version</span>
                            <span className="text-white">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Platform</span>
                            <span className="text-white">Web PWA</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Museum</span>
                            <span className="text-white">SAMSAT</span>
                        </div>
                    </div>
                </div>

                {/* Reset Settings */}
                <div className="bg-red-900/20 backdrop-blur-sm rounded-2xl p-6 border border-red-600/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-2xl">🔄</div>
                        <div>
                            <h3 className="text-lg font-semibold text-red-300">Reset Settings</h3>
                            <p className="text-sm text-red-400">Restore default configuration</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            alert('Settings reset to defaults');
                        }}
                        className="w-full p-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-colors"
                    >
                        Reset to Defaults
                    </button>
                </div>
            </div>
        </div>
    );
}
