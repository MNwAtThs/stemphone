'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FlashlightPage() {
    const [isOn, setIsOn] = useState(false);
    const [brightness, setBrightness] = useState(100);
    const [color, setColor] = useState('#FFFFFF');
    const [isStrobe, setIsStrobe] = useState(false);
    const [strobeSpeed, setStrobeSpeed] = useState(500);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isOn && isStrobe) {
            interval = setInterval(() => {
                document.body.style.backgroundColor = document.body.style.backgroundColor === color ? '#000000' : color;
            }, strobeSpeed);
        } else if (isOn) {
            document.body.style.backgroundColor = color;
        } else {
            document.body.style.backgroundColor = '';
        }

        return () => {
            clearInterval(interval);
            if (!isOn) {
                document.body.style.backgroundColor = '';
            }
        };
    }, [isOn, color, isStrobe, strobeSpeed]);

    const toggleFlashlight = () => {
        setIsOn(!isOn);
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    };

    const handleColorChange = (newColor: string) => {
        setColor(newColor);
    };

    const toggleStrobe = () => {
        setIsStrobe(!isStrobe);
        if ('vibrate' in navigator) {
            navigator.vibrate(100);
        }
    };

    const presetColors = [
        { name: 'White', color: '#FFFFFF', gradient: 'from-gray-100 to-white' },
        { name: 'Red', color: '#FF0000', gradient: 'from-red-500 to-red-600' },
        { name: 'Blue', color: '#0000FF', gradient: 'from-blue-500 to-blue-600' },
        { name: 'Green', color: '#00FF00', gradient: 'from-green-500 to-green-600' },
        { name: 'Yellow', color: '#FFFF00', gradient: 'from-yellow-400 to-yellow-500' },
        { name: 'Purple', color: '#8000FF', gradient: 'from-purple-500 to-purple-600' }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isOn ? 'bg-white' : 'bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900'
            } ${isOn ? 'text-black' : 'text-white'}`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-4 ${isOn ? 'bg-black/10' : 'bg-black/20'
                } backdrop-blur-sm`}>
                <Link href="/home" className={`text-2xl ${isOn ? 'text-black' : 'text-white'}`}>
                    ←
                </Link>
                <h1 className={`text-xl font-semibold ${isOn ? 'text-black' : 'text-white'}`}>
                    Flashlight
                </h1>
                <div className="w-8"></div>
            </div>

            {/* Main Flashlight Control */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                {/* Flashlight Button */}
                <button
                    onClick={toggleFlashlight}
                    className={`
                        w-48 h-48 rounded-full mb-8 transition-all duration-300 shadow-2xl
                        ${isOn
                            ? 'bg-yellow-300 shadow-yellow-300/50 scale-110'
                            : 'bg-gray-700 hover:bg-gray-600 shadow-gray-700/50'
                        }
                        flex items-center justify-center
                    `}
                    style={{
                        backgroundColor: isOn ? color : undefined,
                        boxShadow: isOn ? `0 0 60px ${color}40` : undefined
                    }}
                >
                    <div className={`text-8xl ${isOn ? 'text-black' : 'text-white'}`}>
                        {isOn ? '🔆' : '🔦'}
                    </div>
                </button>

                {/* Status */}
                <div className="text-center mb-8">
                    <h2 className={`text-3xl font-bold mb-2 ${isOn ? 'text-black' : 'text-white'}`}>
                        {isOn ? 'ON' : 'OFF'}
                    </h2>
                    <p className={`${isOn ? 'text-gray-700' : 'text-gray-300'}`}>
                        {isOn ? 'Tap to turn off' : 'Tap to turn on'}
                    </p>
                </div>

                {/* Controls (only show when flashlight is on) */}
                {isOn && (
                    <div className="w-full max-w-md space-y-6">
                        {/* Brightness Control */}
                        <div className="bg-black/10 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="font-semibold mb-3 text-black">Brightness</h3>
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">🔅</span>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={brightness}
                                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                                    className="flex-1 h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-2xl">🔆</span>
                                <span className="text-sm text-gray-700 w-12">{brightness}%</span>
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div className="bg-black/10 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="font-semibold mb-3 text-black">Color</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {presetColors.map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => handleColorChange(preset.color)}
                                        className={`
                                            p-3 rounded-lg text-center transition-all duration-200
                                            ${color === preset.color
                                                ? 'ring-2 ring-black scale-105'
                                                : 'hover:scale-105'
                                            }
                                            bg-gradient-to-br ${preset.gradient}
                                        `}
                                    >
                                        <div className="font-semibold text-sm">{preset.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Strobe Mode */}
                        <div className="bg-black/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-black">Strobe Mode</h3>
                                <button
                                    onClick={toggleStrobe}
                                    className={`
                                        relative w-12 h-6 rounded-full transition-colors duration-200
                                        ${isStrobe ? 'bg-red-500' : 'bg-gray-400'}
                                    `}
                                >
                                    <div
                                        className={`
                                            absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200
                                            ${isStrobe ? 'translate-x-7' : 'translate-x-1'}
                                        `}
                                    />
                                </button>
                            </div>

                            {isStrobe && (
                                <div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-black">Slow</span>
                                        <input
                                            type="range"
                                            min="100"
                                            max="1000"
                                            step="100"
                                            value={strobeSpeed}
                                            onChange={(e) => setStrobeSpeed(parseInt(e.target.value))}
                                            className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="text-sm text-black">Fast</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Educational Note */}
            {!isOn && (
                <div className="p-4 m-4 bg-blue-900/30 rounded-xl border border-blue-600/30">
                    <p className="text-sm text-blue-200">
                        <strong>💡 STEM Fact:</strong> Flashlights work by converting electrical energy from batteries
                        into light energy through LED (Light Emitting Diode) technology. LEDs are much more efficient
                        than traditional incandescent bulbs!
                    </p>
                </div>
            )}
        </div>
    );
}
