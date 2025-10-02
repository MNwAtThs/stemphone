'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAutoLock } from '@/contexts/AutoLockContext';

export default function SettingsPage() {
    const { settings, updateSettings } = useAutoLock();
    const [showAutoLockInfo, setShowAutoLockInfo] = useState(false);

    const timeoutOptions = [
        { value: 0.5, label: '30 seconds' },
        { value: 1, label: '1 minute' },
        { value: 2, label: '2 minutes' },
        { value: 3, label: '3 minutes' },
        { value: 5, label: '5 minutes' },
        { value: 10, label: '10 minutes' },
        { value: 15, label: '15 minutes' },
    ];

    const handleTimeoutChange = (minutes: number) => {
        updateSettings({ timeoutMinutes: minutes });
    };

    const handleEnabledToggle = () => {
        updateSettings({ enabled: !settings.enabled });
    };

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

                {/* Auto-Lock Settings */}
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="text-2xl">🔒</div>
                            <div>
                                <h3 className="text-lg font-semibold">Auto-Lock</h3>
                                <p className="text-sm text-gray-400">Lock screen after inactivity</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAutoLockInfo(!showAutoLockInfo)}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                            {showAutoLockInfo ? 'Hide' : 'Info'}
                        </button>
                    </div>

                    {showAutoLockInfo && (
                        <div className="mb-4 p-3 bg-blue-900/30 rounded-xl border border-blue-600/30">
                            <p className="text-sm text-blue-200">
                                Auto-lock automatically returns to the lock screen when no user activity
                                is detected for the specified time. This helps protect the kiosk from
                                unauthorized access and ensures a clean state for the next visitor.
                            </p>
                        </div>
                    )}

                    {/* Enable/Disable Toggle */}
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-white">Enable Auto-Lock</span>
                        <button
                            onClick={handleEnabledToggle}
                            className={`
                relative w-14 h-8 rounded-full transition-colors duration-200
                ${settings.enabled ? 'bg-green-500' : 'bg-gray-600'}
              `}
                        >
                            <div
                                className={`
                  absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200
                  ${settings.enabled ? 'translate-x-7' : 'translate-x-1'}
                `}
                            />
                        </button>
                    </div>

                    {/* Timeout Selection */}
                    {settings.enabled && (
                        <div>
                            <h4 className="text-md font-medium mb-3">Lock After</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {timeoutOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleTimeoutChange(option.value)}
                                        className={`
                      p-3 rounded-xl text-sm font-medium transition-colors
                      ${settings.timeoutMinutes === option.value
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }
                    `}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 p-3 bg-gray-800/50 rounded-xl">
                                <p className="text-sm text-gray-400">
                                    Current setting: <span className="text-white font-medium">
                                        {timeoutOptions.find(opt => opt.value === settings.timeoutMinutes)?.label ||
                                            `${settings.timeoutMinutes} minutes`}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
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
                            updateSettings({ enabled: true, timeoutMinutes: 2 });
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
