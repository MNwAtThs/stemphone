'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WeatherData {
    location: string;
    temperature: number;
    condition: string;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: string;
    uvIndex: number;
    visibility: number;
    icon: string;
    description: string;
}

interface WeatherFact {
    title: string;
    description: string;
    category: 'physics' | 'chemistry' | 'biology' | 'earth-science';
    icon: string;
}

const weatherFacts: WeatherFact[] = [
    {
        title: "Why is the Sky Blue?",
        description: "Blue light has a shorter wavelength and gets scattered more by molecules in Earth's atmosphere, making the sky appear blue to our eyes.",
        category: "physics",
        icon: "🌌"
    },
    {
        title: "How Do Clouds Form?",
        description: "Water vapor rises, cools, and condenses around tiny particles called condensation nuclei, forming the water droplets that make up clouds.",
        category: "earth-science",
        icon: "☁️"
    },
    {
        title: "What Causes Lightning?",
        description: "Static electricity builds up in storm clouds. When the charge becomes strong enough, it jumps between clouds or to the ground as lightning.",
        category: "physics",
        icon: "⚡"
    },
    {
        title: "The Water Cycle",
        description: "Water continuously moves through evaporation, condensation, and precipitation, driven by energy from the sun.",
        category: "earth-science",
        icon: "💧"
    },
    {
        title: "Air Pressure & Weather",
        description: "High pressure usually brings clear skies, while low pressure systems often bring clouds and storms.",
        category: "physics",
        icon: "🌡️"
    },
    {
        title: "Rainbow Formation",
        description: "Rainbows form when sunlight is refracted and reflected inside water droplets, separating white light into its component colors.",
        category: "physics",
        icon: "🌈"
    },
    {
        title: "Humidity & Comfort",
        description: "High humidity makes it feel hotter because sweat doesn't evaporate as easily, reducing our body's natural cooling system.",
        category: "biology",
        icon: "💦"
    },
    {
        title: "Wind Formation",
        description: "Wind is created by differences in air pressure caused by uneven heating of Earth's surface by the sun.",
        category: "earth-science",
        icon: "💨"
    }
];

// Simulated weather data (in a real app, this would come from an API)
const generateWeatherData = (): WeatherData => {
    const conditions = [
        { condition: 'Sunny', icon: '☀️', description: 'Clear skies with bright sunshine' },
        { condition: 'Partly Cloudy', icon: '⛅', description: 'Mix of sun and clouds' },
        { condition: 'Cloudy', icon: '☁️', description: 'Overcast skies' },
        { condition: 'Rainy', icon: '🌧️', description: 'Light to moderate rainfall' },
        { condition: 'Stormy', icon: '⛈️', description: 'Thunderstorms with heavy rain' },
        { condition: 'Windy', icon: '💨', description: 'Strong winds with clear skies' }
    ];

    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

    return {
        location: 'San Antonio, TX',
        temperature: Math.floor(Math.random() * 40) + 60, // 60-100°F
        condition: randomCondition.condition,
        humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
        pressure: Math.floor(Math.random() * 100) + 980, // 980-1080 hPa
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 mph
        windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        uvIndex: Math.floor(Math.random() * 11), // 0-10
        visibility: Math.floor(Math.random() * 5) + 5, // 5-10 miles
        icon: randomCondition.icon,
        description: randomCondition.description
    };
};

export default function WeatherPage() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [selectedFact, setSelectedFact] = useState<WeatherFact | null>(null);
    const [showFacts, setShowFacts] = useState(false);
    const [unit, setUnit] = useState<'F' | 'C'>('F');

    useEffect(() => {
        // Simulate loading weather data
        const loadWeather = () => {
            setWeather(generateWeatherData());
        };

        loadWeather();
        // Refresh weather data every 30 seconds
        const interval = setInterval(loadWeather, 30000);

        return () => clearInterval(interval);
    }, []);

    const convertTemperature = (temp: number, fromUnit: 'F' | 'C', toUnit: 'F' | 'C'): number => {
        if (fromUnit === toUnit) return temp;
        if (fromUnit === 'F' && toUnit === 'C') {
            return Math.round((temp - 32) * 5 / 9);
        } else {
            return Math.round((temp * 9 / 5) + 32);
        }
    };

    const getUVIndexColor = (uvIndex: number): string => {
        if (uvIndex <= 2) return 'text-green-400';
        if (uvIndex <= 5) return 'text-yellow-400';
        if (uvIndex <= 7) return 'text-orange-400';
        if (uvIndex <= 10) return 'text-red-400';
        return 'text-purple-400';
    };

    const getUVIndexDescription = (uvIndex: number): string => {
        if (uvIndex <= 2) return 'Low - Safe for outdoor activities';
        if (uvIndex <= 5) return 'Moderate - Use sun protection';
        if (uvIndex <= 7) return 'High - Seek shade during midday';
        if (uvIndex <= 10) return 'Very High - Avoid sun exposure';
        return 'Extreme - Stay indoors if possible';
    };

    if (!weather) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-spin">🌤️</div>
                    <p className="text-xl">Loading weather data...</p>
                </div>
            </div>
        );
    }

    if (selectedFact) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 text-white">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                    <button
                        onClick={() => setSelectedFact(null)}
                        className="text-2xl p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        ←
                    </button>
                    <h1 className="text-lg font-semibold">Weather Science</h1>
                    <div className="w-8"></div>
                </div>

                {/* Fact Detail */}
                <div className="p-6">
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                        <div className="text-8xl mb-6">{selectedFact.icon}</div>
                        <h2 className="text-3xl font-bold mb-4">{selectedFact.title}</h2>
                        <div className="inline-block bg-blue-600/30 px-3 py-1 rounded-full text-sm font-medium mb-6 capitalize">
                            {selectedFact.category.replace('-', ' ')}
                        </div>
                        <p className="text-lg leading-relaxed text-gray-200">
                            {selectedFact.description}
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setSelectedFact(null)}
                            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold transition-colors"
                        >
                            Back to Weather
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/home" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">Weather</h1>
                <button
                    onClick={() => setUnit(unit === 'F' ? 'C' : 'F')}
                    className="text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
                >
                    °{unit}
                </button>
            </div>

            {/* Current Weather */}
            <div className="p-6">
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 text-center mb-6">
                    <div className="text-8xl mb-4">{weather.icon}</div>
                    <h2 className="text-3xl font-bold mb-2">{weather.location}</h2>
                    <div className="text-6xl font-light mb-2">
                        {unit === 'F' ? weather.temperature : convertTemperature(weather.temperature, 'F', 'C')}°{unit}
                    </div>
                    <p className="text-xl text-gray-300 mb-4">{weather.condition}</p>
                    <p className="text-gray-400">{weather.description}</p>
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Humidity</p>
                                <p className="text-2xl font-bold">{weather.humidity}%</p>
                            </div>
                            <div className="text-3xl">💧</div>
                        </div>
                    </div>

                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Wind</p>
                                <p className="text-2xl font-bold">{weather.windSpeed} mph</p>
                                <p className="text-xs text-gray-400">{weather.windDirection}</p>
                            </div>
                            <div className="text-3xl">💨</div>
                        </div>
                    </div>

                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Pressure</p>
                                <p className="text-2xl font-bold">{weather.pressure}</p>
                                <p className="text-xs text-gray-400">hPa</p>
                            </div>
                            <div className="text-3xl">🌡️</div>
                        </div>
                    </div>

                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Visibility</p>
                                <p className="text-2xl font-bold">{weather.visibility}</p>
                                <p className="text-xs text-gray-400">miles</p>
                            </div>
                            <div className="text-3xl">👁️</div>
                        </div>
                    </div>
                </div>

                {/* UV Index */}
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-gray-400 text-sm">UV Index</p>
                            <p className={`text-3xl font-bold ${getUVIndexColor(weather.uvIndex)}`}>
                                {weather.uvIndex}
                            </p>
                        </div>
                        <div className="text-3xl">☀️</div>
                    </div>
                    <p className="text-sm text-gray-300">{getUVIndexDescription(weather.uvIndex)}</p>
                </div>

                {/* Weather Science Section */}
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Weather Science</h3>
                        <button
                            onClick={() => setShowFacts(!showFacts)}
                            className="text-2xl hover:scale-110 transition-transform"
                        >
                            🧪
                        </button>
                    </div>

                    {showFacts ? (
                        <div className="grid grid-cols-2 gap-3">
                            {weatherFacts.slice(0, 6).map((fact, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedFact(fact)}
                                    className="bg-white/10 hover:bg-white/20 p-3 rounded-lg text-left transition-colors"
                                >
                                    <div className="text-2xl mb-2">{fact.icon}</div>
                                    <p className="text-sm font-medium">{fact.title}</p>
                                    <p className="text-xs text-gray-400 capitalize mt-1">
                                        {fact.category.replace('-', ' ')}
                                    </p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-300 mb-3">
                                Learn about the science behind weather phenomena!
                            </p>
                            <button
                                onClick={() => setShowFacts(true)}
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-semibold transition-colors"
                            >
                                Explore Weather Science
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Educational Note */}
            <div className="p-4 m-4 bg-yellow-900/30 rounded-xl border border-yellow-600/30">
                <p className="text-sm text-yellow-200">
                    <strong>🏛️ Museum Note:</strong> This weather app uses simulated data for demonstration.
                    In a real deployment, it would connect to live weather APIs for accurate local conditions.
                </p>
            </div>
        </div>
    );
}
