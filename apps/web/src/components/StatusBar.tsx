'use client';

import { useState, useEffect } from 'react';

export function StatusBar() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [batteryLevel, setBatteryLevel] = useState(100);
    const [isCharging, setIsCharging] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Battery API (if available)
        if ('getBattery' in navigator) {
            (navigator as {
                getBattery: () => Promise<{
                    level: number;
                    charging: boolean;
                    addEventListener: (event: string, callback: () => void) => void;
                }>
            }).getBattery().then((battery: {
                level: number;
                charging: boolean;
                addEventListener: (event: string, callback: () => void) => void;
            }) => {
                setBatteryLevel(Math.round(battery.level * 100));
                setIsCharging(battery.charging);

                battery.addEventListener('levelchange', () => {
                    setBatteryLevel(Math.round(battery.level * 100));
                });

                battery.addEventListener('chargingchange', () => {
                    setIsCharging(battery.charging);
                });
            });
        }

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex justify-between items-center px-4 py-2 text-sm bg-black/20 backdrop-blur-sm relative z-20">
            {/* Left side - Signal and Carrier */}
            <div className="flex items-center gap-2">
                {/* Signal bars */}
                <div className="flex items-end gap-1">
                    <div className="w-1 h-2 bg-white rounded-full"></div>
                    <div className="w-1 h-3 bg-white rounded-full"></div>
                    <div className="w-1 h-4 bg-white rounded-full"></div>
                    <div className="w-1 h-5 bg-white rounded-full"></div>
                </div>
                <span className="text-white font-medium">SAMSAT</span>
                {/* WiFi icon */}
                <div className="text-white">📶</div>
            </div>

            {/* Center - Time */}
            <div className="text-white font-semibold">
                {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })}
            </div>

            {/* Right side - Battery and other indicators */}
            <div className="flex items-center gap-2">
                {/* Bluetooth */}
                <div className="text-white text-xs">🔵</div>

                {/* Battery */}
                <div className="flex items-center gap-1">
                    <span className="text-white text-xs">{batteryLevel}%</span>
                    <div className="relative">
                        <div className="w-6 h-3 border border-white rounded-sm">
                            <div
                                className={`h-full rounded-sm transition-all duration-300 ${isCharging ? 'bg-green-400' :
                                        batteryLevel > 20 ? 'bg-white' : 'bg-red-400'
                                    }`}
                                style={{ width: `${batteryLevel}%` }}
                            ></div>
                        </div>
                        {/* Battery tip */}
                        <div className="absolute -right-1 top-1 w-1 h-1 bg-white rounded-r-sm"></div>
                        {/* Charging indicator */}
                        {isCharging && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-black text-xs">⚡</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
