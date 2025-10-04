'use client';

import { useState, useEffect } from 'react';

export function StatusBar() {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [batteryLevel, setBatteryLevel] = useState(100);
    const [isCharging, setIsCharging] = useState(false);

    useEffect(() => {
        // Set initial time immediately on client
        setCurrentTime(new Date());

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
        <div className="flex justify-between items-center px-6 py-3 text-sm bg-black/20 rounded-2xl mx-6 mb-6 relative z-20">
            {/* Left side - Time and Date */}
            <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full px-3 py-1">
                    <span className="text-white font-mono text-sm">
                        {currentTime ? currentTime.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                        }) : '--:--:--'}
                    </span>
                </div>
            </div>

            {/* Right side - Signal, WiFi, and Battery */}
            <div className="flex items-center gap-4">
                {/* Cellular Signal */}
                <div className="flex items-end gap-1">
                    <div className="w-1 h-2 bg-white rounded-full"></div>
                    <div className="w-1 h-3 bg-white rounded-full"></div>
                    <div className="w-1 h-4 bg-white rounded-full"></div>
                    <div className="w-1 h-5 bg-white rounded-full"></div>
                </div>

                {/* WiFi Signal */}
                <div className="flex items-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C6.48 2.52 1.52 2.52 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C9.14 11.14 4.86 11.14 5 13z" />
                    </svg>
                </div>

                {/* Battery */}
                <div className="flex items-center gap-1">
                    <span className="text-white text-xs font-medium">{batteryLevel}%</span>
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
                                <div className="text-black text-xs font-bold">⚡</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
