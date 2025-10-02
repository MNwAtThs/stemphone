'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LightScene {
    id: string;
    name: string;
    color: string;
    icon: string;
    description: string;
    gradient: string;
}

const lightScenes: LightScene[] = [
    {
        id: 'off',
        name: 'Off',
        color: '#000000',
        icon: '⚫',
        description: 'Turn off all lights',
        gradient: 'from-gray-800 to-black'
    },
    {
        id: 'white',
        name: 'White',
        color: '#FFFFFF',
        icon: '⚪',
        description: 'Bright white light',
        gradient: 'from-gray-100 to-white'
    },
    {
        id: 'red',
        name: 'Red',
        color: '#FF0000',
        icon: '🔴',
        description: 'Warm red glow',
        gradient: 'from-red-500 to-red-600'
    },
    {
        id: 'blue',
        name: 'Blue',
        color: '#0000FF',
        icon: '🔵',
        description: 'Cool blue ambiance',
        gradient: 'from-blue-500 to-blue-600'
    },
    {
        id: 'green',
        name: 'Green',
        color: '#00FF00',
        icon: '🟢',
        description: 'Natural green light',
        gradient: 'from-green-500 to-green-600'
    },
    {
        id: 'yellow',
        name: 'Yellow',
        color: '#FFFF00',
        icon: '🟡',
        description: 'Sunny yellow warmth',
        gradient: 'from-yellow-400 to-yellow-500'
    },
    {
        id: 'purple',
        name: 'Purple',
        color: '#800080',
        icon: '🟣',
        description: 'Mystical purple',
        gradient: 'from-purple-500 to-purple-600'
    },
    {
        id: 'rainbow',
        name: 'Rainbow',
        color: 'rainbow',
        icon: '🌈',
        description: 'Cycling rainbow colors',
        gradient: 'from-pink-500 via-purple-500 to-indigo-500'
    }
];

const presetModes = [
    {
        id: 'party',
        name: 'Party Mode',
        icon: '🎉',
        description: 'Fast color cycling',
        gradient: 'from-pink-500 to-purple-500'
    },
    {
        id: 'relax',
        name: 'Relax',
        icon: '😌',
        description: 'Soft, calming colors',
        gradient: 'from-blue-400 to-teal-400'
    },
    {
        id: 'focus',
        name: 'Focus',
        icon: '🎯',
        description: 'Bright, clear lighting',
        gradient: 'from-white to-blue-100'
    },
    {
        id: 'sleep',
        name: 'Sleep',
        icon: '😴',
        description: 'Dim, warm colors',
        gradient: 'from-orange-800 to-red-900'
    }
];

export default function LightsPage() {
    const [currentScene, setCurrentScene] = useState<string>('off');
    const [brightness, setBrightness] = useState(80);
    const [isConnected, setIsConnected] = useState(false);
    const [lastCommand, setLastCommand] = useState<string>('');

    useEffect(() => {
        // Check if we're running in Tauri
        checkTauriConnection();
    }, []);

    const checkTauriConnection = async () => {
        try {
            // Check if Tauri is available
            if (typeof window !== 'undefined' && (window as { __TAURI__?: { invoke: (cmd: string, args: Record<string, unknown>) => Promise<unknown> } }).__TAURI__) {
                setIsConnected(true);
                console.log('Tauri detected - ESP32 commands will be sent');
            } else {
                setIsConnected(false);
                console.log('Running in browser - ESP32 commands will be simulated');
            }
        } catch (error) {
            console.error('Error checking Tauri connection:', error);
            setIsConnected(false);
        }
    };

    const sendLightCommand = async (scene: string, options: Record<string, unknown> = {}) => {
        const command = {
            scene,
            brightness: brightness / 100,
            ...options
        };

        setLastCommand(`lights_set_scene: ${JSON.stringify(command)}`);

        try {
            if (isConnected && (window as { __TAURI__?: { invoke: (cmd: string, args: Record<string, unknown>) => Promise<unknown> } }).__TAURI__) {
                // Send command to Tauri backend
                await (window as unknown as { __TAURI__: { invoke: (cmd: string, args: Record<string, unknown>) => Promise<unknown> } }).__TAURI__.invoke('lights_set_scene', command);
                console.log('Light command sent to ESP32:', command);
            } else {
                // Simulate command for browser testing
                console.log('Simulated light command:', command);

                // Show visual feedback
                document.body.style.backgroundColor = lightScenes.find(s => s.id === scene)?.color || '#000000';
                setTimeout(() => {
                    document.body.style.backgroundColor = '';
                }, 1000);
            }

            setCurrentScene(scene);
        } catch (error) {
            console.error('Failed to send light command:', error);
            alert('Failed to control lights. Make sure the ESP32 is connected.');
        }
    };

    const handleSceneSelect = (scene: LightScene) => {
        sendLightCommand(scene.id, {
            color: scene.color,
            name: scene.name
        });
    };

    const handlePresetMode = (mode: { id: string; name: string }) => {
        sendLightCommand(mode.id, {
            mode: mode.id,
            name: mode.name
        });
    };

    const handleBrightnessChange = (newBrightness: number) => {
        setBrightness(newBrightness);
        if (currentScene !== 'off') {
            sendLightCommand(currentScene, { brightness: newBrightness / 100 });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">Lights</h1>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-xs">{isConnected ? 'ESP32' : 'Demo'}</span>
                </div>
            </div>

            {/* Connection Status */}
            <div className="p-4">
                <div className={`p-3 rounded-xl ${isConnected ? 'bg-green-900/50 border-green-600/50' : 'bg-yellow-900/50 border-yellow-600/50'} border`}>
                    <p className="text-sm">
                        {isConnected ? (
                            <>
                                <strong>✅ Connected:</strong> ESP32 light control is active
                            </>
                        ) : (
                            <>
                                <strong>⚠️ Demo Mode:</strong> Running in browser - commands will be simulated
                            </>
                        )}
                    </p>
                </div>
            </div>

            {/* Current Scene Display */}
            {currentScene !== 'off' && (
                <div className="p-4">
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                        <div className="text-6xl mb-4">
                            {lightScenes.find(s => s.id === currentScene)?.icon || '💡'}
                        </div>
                        <h2 className="text-2xl font-bold mb-2">
                            {lightScenes.find(s => s.id === currentScene)?.name || 'Unknown'}
                        </h2>
                        <p className="text-gray-300">
                            {lightScenes.find(s => s.id === currentScene)?.description}
                        </p>
                    </div>
                </div>
            )}

            {/* Brightness Control */}
            <div className="p-4">
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4">
                    <h3 className="text-lg font-semibold mb-4">Brightness</h3>
                    <div className="flex items-center space-x-4">
                        <span className="text-2xl">🔅</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={brightness}
                            onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
                            className="flex-1 h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-2xl">🔆</span>
                        <span className="text-sm text-gray-300 w-12">{brightness}%</span>
                    </div>
                </div>
            </div>

            {/* Color Scenes */}
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Colors</h3>
                <div className="grid grid-cols-4 gap-3">
                    {lightScenes.map((scene) => (
                        <button
                            key={scene.id}
                            onClick={() => handleSceneSelect(scene)}
                            className={`
                p-4 rounded-2xl text-center transition-all duration-200
                ${currentScene === scene.id
                                    ? 'ring-2 ring-white scale-105'
                                    : 'hover:scale-105'
                                }
                bg-gradient-to-br ${scene.gradient}
              `}
                        >
                            <div className="text-3xl mb-2">{scene.icon}</div>
                            <div className="text-sm font-medium">{scene.name}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Preset Modes */}
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Preset Modes</h3>
                <div className="grid grid-cols-2 gap-3">
                    {presetModes.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => handlePresetMode(mode)}
                            className={`
                p-4 rounded-2xl text-left transition-all duration-200
                hover:scale-105 bg-gradient-to-br ${mode.gradient}
              `}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="text-3xl">{mode.icon}</div>
                                <div>
                                    <div className="font-semibold">{mode.name}</div>
                                    <div className="text-sm opacity-80">{mode.description}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Debug Info */}
            {lastCommand && (
                <div className="p-4">
                    <div className="bg-gray-900/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">Last Command:</p>
                        <code className="text-xs text-green-400 break-all">{lastCommand}</code>
                    </div>
                </div>
            )}
        </div>
    );
}
