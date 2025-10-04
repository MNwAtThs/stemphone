'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
        <div className="flex justify-between items-center px-6 py-3 text-sm relative z-20 max-w-4xl mx-auto">
            {/* Left side - Time and Date */}
            <div className="flex items-center gap-3">
                <div className="bg-white rounded-2xl px-6 py-3 shadow-lg ring-2 ring-gray-300 ring-inset">
                    <span className="text-black font-mono text-4xl">
                        {currentTime ? currentTime.toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric'
                        }) + ' ' + currentTime.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                        }) : '--:--:--'}
                    </span>
                </div>
            </div>

            {/* Right side - Status Bar Image */}
            <div className="flex items-center mt-2 ml-20">
                <Image
                    src="/statusbar.png"
                    alt="Status Bar"
                    width={200}
                    height={50}
                    className="h-12 w-auto"
                />
            </div>
        </div>
    );
}
