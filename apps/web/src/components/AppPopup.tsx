'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AudioEngine } from '@/lib/AudioEngine';

interface AppTile {
    id: string;
    name: string;
    icon: string;
    href: string;
    gradient: string;
    description: string;
}

interface AppPopupProps {
    isOpen: boolean;
    onClose: () => void;
    apps: AppTile[];
    onItemClick?: (app: AppTile) => void;
    title?: string;
}

interface Track {
    id: string;
    title: string;
    artist: string;
    duration: number;
    src: string;
    cover?: string;
}

const demoTracks: Track[] = [
    {
        id: '1',
        title: 'Seven Nation TESLA COIL Army',
        artist: 'SAMSAT Radio',
        duration: 180,
        src: '/audio/seven-nation-tesla-coil-army.mp3',
        cover: '🎵'
    },
    {
        id: '2',
        title: 'AC/DC Thunderstruck - Tesla Coils',
        artist: 'SAMSAT Radio',
        duration: 240,
        src: '/audio/acdc-thunderstruck-tesla-coils.mp3',
        cover: '🎵'
    },
    {
        id: '3',
        title: 'He\'s a Pirate - Tesla Coils',
        artist: 'SAMSAT Radio',
        duration: 200,
        src: '/audio/hes-a-pirate-tesla-coils.mp3',
        cover: '🎵'
    },
    {
        id: '4',
        title: 'Tesla Coils Radio',
        artist: 'SAMSAT Radio',
        duration: 300,
        src: '/audio/tesla-coils-radio.mp3',
        cover: '🎵'
    }
];

export function AppPopup({ isOpen, onClose, apps, onItemClick, title = 'STEM Superstars Apps' }: AppPopupProps) {
    const [pressedApp, setPressedApp] = useState<string | null>(null);

    // Music player state
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [audioEngine] = useState(() => AudioEngine.getInstance());
    const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());

    // Calculator state
    type CalculatorMode = 'basic' | 'scientific' | 'converter';
    const [calcDisplay, setCalcDisplay] = useState('0');
    const [calcPreviousValue, setCalcPreviousValue] = useState<number | null>(null);
    const [calcOperation, setCalcOperation] = useState<string | null>(null);
    const [calcWaitingForOperand, setCalcWaitingForOperand] = useState(false);
    const [calcMode, setCalcMode] = useState<CalculatorMode>('basic');
    const [calcMemory, setCalcMemory] = useState(0);
    const [calcHistory, setCalcHistory] = useState<string[]>([]);
    const [conversionType, setConversionType] = useState<'length' | 'mass' | 'temperature'>('length');
    const [fromUnit, setFromUnit] = useState(0);
    const [toUnit, setToUnit] = useState(1);
    const [conversionValue, setConversionValue] = useState('1');

    // Pattern Generation state
    const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);

    // Flashlight state
    const [flashlightOn, setFlashlightOn] = useState(false);

    const handleAppPress = (appId: string) => {
        setPressedApp(appId);
        // Haptic feedback if available
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    };

    const handleAppRelease = () => {
        setPressedApp(null);
    };

    // Close popup when clicking outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Close popup with Escape key and disable scroll
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Disable body scroll
            document.body.style.overflow = 'hidden';
            // Also prevent scroll on touch devices
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            // Re-enable body scroll
            document.body.style.overflow = 'unset';
            document.body.style.position = 'unset';
            document.body.style.width = 'unset';
        };
    }, [isOpen, onClose]);

    // Music player effects
    useEffect(() => {
        if (title === 'Music Player') {
            // Set up audio engine callbacks
            audioEngine.onPlay = () => setIsPlaying(true);
            audioEngine.onPause = () => setIsPlaying(false);
            audioEngine.onStop = () => {
                setIsPlaying(false);
                setCurrentTime(0);
            };
            audioEngine.onTimeUpdate = (time: number) => setCurrentTime(time);
            audioEngine.onTrackEnd = () => {
                setIsPlaying(false);
                setCurrentTime(0);
            };
            audioEngine.onError = (error: Error | string) => {
                console.warn('Audio error:', error);
                setIsPlaying(false);
                // Don't show error to user, just stop playback
            };

            return () => {
                // Cleanup on unmount or title change
                audioEngine.stop();
            };
        }
    }, [title, audioEngine]);

    const playTrack = (track: Track) => {
        if (currentTrack?.id === track.id && isPlaying) {
            audioEngine.pause();
        } else {
            setCurrentTrack(track);
            try {
                audioEngine.loadAndPlay(track.src, volume);
            } catch (error) {
                console.warn('Failed to play track:', track.title, error);
                setIsPlaying(false);
            }
        }
    };

    const togglePlayPause = () => {
        if (currentTrack) {
            if (isPlaying) {
                audioEngine.pause();
            } else {
                audioEngine.play();
            }
        }
    };

    const stopTrack = () => {
        audioEngine.stop();
        setCurrentTrack(null);
    };

    const playNextTrack = () => {
        if (!currentTrack) return;
        const currentIndex = demoTracks.findIndex(t => t.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % demoTracks.length;
        playTrack(demoTracks[nextIndex]);
    };

    const playPreviousTrack = () => {
        if (!currentTrack) return;
        const currentIndex = demoTracks.findIndex(t => t.id === currentTrack.id);
        const prevIndex = currentIndex === 0 ? demoTracks.length - 1 : currentIndex - 1;
        playTrack(demoTracks[prevIndex]);
    };

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
        audioEngine.setVolume(newVolume);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        audioEngine.seek(newTime);
        setCurrentTime(newTime);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleLike = (trackId: string) => {
        setLikedTracks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(trackId)) {
                newSet.delete(trackId);
            } else {
                newSet.add(trackId);
            }
            return newSet;
        });
    };

    const isLiked = (trackId: string) => likedTracks.has(trackId);

    // Calculator functions
    const conversions = {
        length: {
            name: 'Length',
            baseUnit: 'meter',
            units: [
                { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
                { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
                { name: 'Meter', symbol: 'm', factor: 1 },
                { name: 'Kilometer', symbol: 'km', factor: 1000 },
                { name: 'Inch', symbol: 'in', factor: 0.0254 },
                { name: 'Foot', symbol: 'ft', factor: 0.3048 },
                { name: 'Yard', symbol: 'yd', factor: 0.9144 },
                { name: 'Mile', symbol: 'mi', factor: 1609.34 }
            ]
        },
        mass: {
            name: 'Mass',
            baseUnit: 'kilogram',
            units: [
                { name: 'Milligram', symbol: 'mg', factor: 0.000001 },
                { name: 'Gram', symbol: 'g', factor: 0.001 },
                { name: 'Kilogram', symbol: 'kg', factor: 1 },
                { name: 'Pound', symbol: 'lb', factor: 0.453592 },
                { name: 'Ounce', symbol: 'oz', factor: 0.0283495 }
            ]
        },
        temperature: {
            name: 'Temperature',
            baseUnit: 'celsius',
            units: [
                { name: 'Celsius', symbol: '°C', factor: 1 },
                { name: 'Fahrenheit', symbol: '°F', factor: 1 },
                { name: 'Kelvin', symbol: 'K', factor: 1 }
            ]
        }
    };

    const calcInputNumber = (num: string) => {
        if (calcWaitingForOperand) {
            setCalcDisplay(num);
            setCalcWaitingForOperand(false);
        } else {
            setCalcDisplay(calcDisplay === '0' ? num : calcDisplay + num);
        }
    };

    const calcInputDecimal = () => {
        if (calcWaitingForOperand) {
            setCalcDisplay('0.');
            setCalcWaitingForOperand(false);
        } else if (calcDisplay.indexOf('.') === -1) {
            setCalcDisplay(calcDisplay + '.');
        }
    };

    const calcClear = () => {
        setCalcDisplay('0');
        setCalcPreviousValue(null);
        setCalcOperation(null);
        setCalcWaitingForOperand(false);
    };

    const calcCalculate = (firstValue: number, secondValue: number, operation: string): number => {
        switch (operation) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '×':
                return firstValue * secondValue;
            case '÷':
                return secondValue !== 0 ? firstValue / secondValue : 0;
            case '^':
                return Math.pow(firstValue, secondValue);
            default:
                return secondValue;
        }
    };

    const calcPerformOperation = (nextOperation: string) => {
        const inputValue = parseFloat(calcDisplay);

        if (calcPreviousValue === null) {
            setCalcPreviousValue(inputValue);
        } else if (calcOperation) {
            const currentValue = calcPreviousValue || 0;
            const newValue = calcCalculate(currentValue, inputValue, calcOperation);

            setCalcDisplay(String(newValue));
            setCalcPreviousValue(newValue);

            const historyEntry = `${currentValue} ${calcOperation} ${inputValue} = ${newValue}`;
            setCalcHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
        }

        setCalcWaitingForOperand(true);
        setCalcOperation(nextOperation === '=' ? null : nextOperation);
        if (nextOperation === '=') {
            setCalcPreviousValue(null);
        }
    };

    const calcPerformScientificOperation = (func: string) => {
        const inputValue = parseFloat(calcDisplay);
        let result: number;

        switch (func) {
            case 'sin':
                result = Math.sin(inputValue * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(inputValue * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(inputValue * Math.PI / 180);
                break;
            case 'log':
                result = Math.log10(inputValue);
                break;
            case 'ln':
                result = Math.log(inputValue);
                break;
            case 'sqrt':
                result = Math.sqrt(inputValue);
                break;
            case '1/x':
                result = 1 / inputValue;
                break;
            case 'x²':
                result = inputValue * inputValue;
                break;
            case 'π':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
            default:
                return;
        }

        setCalcDisplay(String(result));
        setCalcWaitingForOperand(true);

        const historyEntry = `${func}(${inputValue}) = ${result}`;
        setCalcHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
    };

    const calcMemoryStore = () => setCalcMemory(parseFloat(calcDisplay));
    const calcMemoryRecall = () => {
        setCalcDisplay(String(calcMemory));
        setCalcWaitingForOperand(true);
    };
    const calcMemoryClear = () => setCalcMemory(0);
    const calcMemoryAdd = () => setCalcMemory(calcMemory + parseFloat(calcDisplay));

    const convertUnits = (value: number, fromIdx: number, toIdx: number, type: keyof typeof conversions): number => {
        if (type === 'temperature') {
            const fromUnit = conversions[type].units[fromIdx];
            const toUnit = conversions[type].units[toIdx];

            if (fromUnit.symbol === '°C' && toUnit.symbol === '°F') {
                return (value * 9 / 5) + 32;
            } else if (fromUnit.symbol === '°F' && toUnit.symbol === '°C') {
                return (value - 32) * 5 / 9;
            } else if (fromUnit.symbol === '°C' && toUnit.symbol === 'K') {
                return value + 273.15;
            } else if (fromUnit.symbol === 'K' && toUnit.symbol === '°C') {
                return value - 273.15;
            } else if (fromUnit.symbol === '°F' && toUnit.symbol === 'K') {
                return ((value - 32) * 5 / 9) + 273.15;
            } else if (fromUnit.symbol === 'K' && toUnit.symbol === '°F') {
                return ((value - 273.15) * 9 / 5) + 32;
            }
            return value;
        } else {
            const fromFactor = conversions[type].units[fromIdx].factor;
            const toFactor = conversions[type].units[toIdx].factor;
            return (value * fromFactor) / toFactor;
        }
    };

    const convertedValue = conversionValue ?
        convertUnits(parseFloat(conversionValue) || 0, fromUnit, toUnit, conversionType) : 0;

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8 overflow-hidden"
            onClick={handleBackdropClick}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
        >
            <div className="bg-white rounded-3xl p-8 max-w-6xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative">
                {/* Close button - Top right of popup */}
                <button
                    onClick={onClose}
                    className="absolute right-8 top-8 rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 transition-colors z-10"
                    aria-label="Close"
                >
                    <svg
                        className="w-7 h-7"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Samsat Logo for Board of Directors - Above the title */}
                {title === 'Board of Directors' && (
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/logos/samsat_logo.png"
                            alt="Samsat Logo"
                            width={200}
                            height={100}
                            className="h-16 w-auto"
                        />
                    </div>
                )}

                {/* Port SA Logo for Port SA Leadership - Above the title */}
                {title === 'Port SA Leadership' && (
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/logos/portsa_logo.png"
                            alt="Port SA Logo"
                            width={200}
                            height={100}
                            className="h-16 w-auto"
                        />
                    </div>
                )}

                {/* DSEC Logo for DSEC Article - Above the title */}
                {title === 'DSEC' && (
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/apps/dsec.png"
                            alt="DSEC Logo"
                            width={200}
                            height={100}
                            className="h-16 w-auto"
                        />
                    </div>
                )}

                {/* IEEE Logo for IEEE Members - Above the title */}
                {title === 'IEEE' && (
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/logos/IEEE-logo.png"
                            alt="IEEE Logo"
                            width={200}
                            height={100}
                            className="h-16 w-auto"
                        />
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-5xl font-bold text-gray-900 text-center">{title}</h2>
                </div>

                {/* DSEC Article Content */}
                {title === 'DSEC' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-blue-50 rounded-2xl p-8 mb-6">
                            <div className="text-center mb-6">
                                <div className="text-6xl font-bold text-blue-600 mb-2">53,053</div>
                                <div className="text-lg text-gray-700">students, educators, and other participants engaged in DSEC-funded activities during Option Year Two</div>
                            </div>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h3>

                            <p className="text-gray-700 mb-4">
                                This Annual Program Review summarizes the activities and outcomes of the Defense Science, Technology, Engineering, and Mathematics (STEM) Education Consortium (DSEC) during Option Year Two, September 1, 2021 – August 31, 2022.
                            </p>

                            <p className="text-gray-700 mb-4">
                                Launched in 2019 by the Department of Defense (DoD), DSEC is a collaborative partnership designed to broaden STEM literacy and develop a diverse and agile workforce for national defense. The consortium is aligned to the Federal STEM Education Strategic Plan and represents DoD's investment in evidence-based approaches to develop the science and technology workforce.
                            </p>

                            <h4 className="text-xl font-semibold text-gray-900 mb-3">Management Elements</h4>
                            <p className="text-gray-700 mb-3">To achieve its goals, DSEC is organized into five management elements:</p>

                            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                                <li><strong>Element 1:</strong> Provides leadership and coordination of DSEC, including planning and execution of consortium-wide deliverables</li>
                                <li><strong>Element 2:</strong> Manages data collection, assessment/analysis, and reports for DSEC</li>
                                <li><strong>Element 3:</strong> Promotes DoD STEM and DSEC as a coordinated and cohesive effort offering students and teachers a pathway of STEM education and career opportunities</li>
                                <li><strong>Element 4:</strong> Develops and implements evidence-based STEM education programs and activities</li>
                                <li><strong>Element 5:</strong> Provides technical assistance and professional development for STEM educators</li>
                            </ul>

                            <div className="bg-gray-100 rounded-lg p-4 mt-6">
                                <p className="text-sm text-gray-600 italic">
                                    DSEC continues to make significant progress in advancing STEM education and workforce development through collaborative partnerships and evidence-based programming.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : title === 'SAMMY' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6 flex justify-center">
                            <Image
                                src="/images/graphics/sammy.png"
                                alt="SAMMY Robot"
                                width={600}
                                height={400}
                                className="w-auto h-auto max-w-md rounded-2xl shadow-lg"
                            />
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-8">
                            <Image
                                src="/images/graphics/Sammy-Drive-QR-code.png"
                                alt="QR Code"
                                width={200}
                                height={200}
                                className="w-48 h-48 object-contain"
                            />
                            <Image
                                src="/images/graphics/Drive-Now-3.png"
                                alt="Drive Now"
                                width={200}
                                height={200}
                                className="w-48 h-48 object-contain"
                            />
                            <Image
                                src="/images/graphics/Connect-Buttonx2.png"
                                alt="Connect Button"
                                width={200}
                                height={200}
                                className="w-48 h-48 object-contain"
                            />
                        </div>
                    </div>
                ) : title === 'ROBOTS' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <Image
                                src="/images/graphics/robotics-engineer-working-on-maintenance-of-roboti-2023-11-27-05-28-47-utc-scaled.jpg"
                                alt="Robotics Engineer"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                ) : title === 'AVIATION' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <Image
                                src="/images/graphics/the-history-of-boeing-aviation-v0-qbf8n6b497ga1.png.webp"
                                alt="History of Boeing Aviation"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                ) : title === 'SPACE' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <Image
                                src="/images/graphics/astronaut-in-space.jpg"
                                alt="Astronaut in Space"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                ) : title === 'ARTIFICIAL INTELLIGENCE' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <Image
                                src="/images/graphics/Artificial_Intelligence__AI__Machine_Learning_-_30212411048.jpg"
                                alt="Artificial Intelligence"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                ) : title === 'NASA Photo Gallery' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <Image
                                src="/images/graphics/Nasa-5.jpg"
                                alt="NASA Photo Gallery"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                ) : title === 'Learn Morse Code' ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <Image
                                src="/images/graphics/international_morse_code.png"
                                alt="International Morse Code"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                ) : title === 'Calculator' ? (
                    <div className="max-w-4xl mx-auto">
                        {/* Mode Selector */}
                        <div className="mb-4">
                            <div className="grid grid-cols-3 gap-2 bg-gray-200 p-1 rounded-lg">
                                <button
                                    onClick={() => setCalcMode('basic')}
                                    className={`p-2 rounded-md font-semibold transition-colors ${calcMode === 'basic' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900'
                                        }`}
                                >
                                    Basic
                                </button>
                                <button
                                    onClick={() => setCalcMode('scientific')}
                                    className={`p-2 rounded-md font-semibold transition-colors ${calcMode === 'scientific' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900'
                                        }`}
                                >
                                    Scientific
                                </button>
                                <button
                                    onClick={() => setCalcMode('converter')}
                                    className={`p-2 rounded-md font-semibold transition-colors ${calcMode === 'converter' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900'
                                        }`}
                                >
                                    Converter
                                </button>
                            </div>
                        </div>

                        {/* Display */}
                        {calcMode !== 'converter' && (
                            <div className="mb-4">
                                <div className="bg-gray-100 rounded-2xl p-6">
                                    <div className="text-right">
                                        <div className="text-4xl font-mono font-bold mb-2 break-all text-gray-900">
                                            {calcDisplay}
                                        </div>
                                        {calcOperation && calcPreviousValue !== null && (
                                            <div className="text-gray-600 text-lg">
                                                {calcPreviousValue} {calcOperation}
                                            </div>
                                        )}
                                        {calcMemory !== 0 && (
                                            <div className="text-blue-600 text-sm">
                                                Memory: {calcMemory}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Calculator Interface */}
                        {calcMode === 'basic' && (
                            <div className="grid grid-cols-4 gap-3">
                                <button onClick={calcClear} className="col-span-2 bg-red-600 hover:bg-red-700 p-4 rounded-xl text-lg font-semibold transition-colors text-white">
                                    Clear
                                </button>
                                <button onClick={calcMemoryClear} className="bg-purple-600 hover:bg-purple-700 p-4 rounded-xl text-sm font-semibold transition-colors text-white">
                                    MC
                                </button>
                                <button onClick={() => calcPerformOperation('÷')} className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    ÷
                                </button>
                                <button onClick={() => calcInputNumber('7')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    7
                                </button>
                                <button onClick={() => calcInputNumber('8')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    8
                                </button>
                                <button onClick={() => calcInputNumber('9')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    9
                                </button>
                                <button onClick={() => calcPerformOperation('×')} className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    ×
                                </button>
                                <button onClick={() => calcInputNumber('4')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    4
                                </button>
                                <button onClick={() => calcInputNumber('5')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    5
                                </button>
                                <button onClick={() => calcInputNumber('6')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    6
                                </button>
                                <button onClick={() => calcPerformOperation('-')} className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    -
                                </button>
                                <button onClick={() => calcInputNumber('1')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    1
                                </button>
                                <button onClick={() => calcInputNumber('2')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    2
                                </button>
                                <button onClick={() => calcInputNumber('3')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    3
                                </button>
                                <button onClick={() => calcPerformOperation('+')} className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    +
                                </button>
                                <button onClick={() => calcInputNumber('0')} className="col-span-2 bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    0
                                </button>
                                <button onClick={calcInputDecimal} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    .
                                </button>
                                <button onClick={() => calcPerformOperation('=')} className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                    =
                                </button>
                            </div>
                        )}

                        {calcMode === 'scientific' && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-5 gap-2">
                                    <button onClick={() => calcPerformScientificOperation('sin')} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-sm font-semibold transition-colors text-white">
                                        sin
                                    </button>
                                    <button onClick={() => calcPerformScientificOperation('cos')} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-sm font-semibold transition-colors text-white">
                                        cos
                                    </button>
                                    <button onClick={() => calcPerformScientificOperation('tan')} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-sm font-semibold transition-colors text-white">
                                        tan
                                    </button>
                                    <button onClick={() => calcPerformScientificOperation('log')} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-sm font-semibold transition-colors text-white">
                                        log
                                    </button>
                                    <button onClick={() => calcPerformScientificOperation('ln')} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-sm font-semibold transition-colors text-white">
                                        ln
                                    </button>
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    <button onClick={() => calcPerformScientificOperation('sqrt')} className="bg-green-600 hover:bg-green-700 p-3 rounded-lg text-sm font-semibold transition-colors text-white">
                                        √
                                    </button>
                                    <button onClick={() => calcPerformScientificOperation('x²')} className="bg-green-600 hover:bg-green-700 p-3 rounded-lg text-sm font-semibold transition-colors text-white">
                                        x²
                                    </button>
                                    <button onClick={() => calcPerformOperation('^')} className="bg-green-600 hover:bg-green-700 p-3 rounded-lg text-sm font-semibold transition-colors text-white">
                                        x^y
                                    </button>
                                    <button onClick={() => calcPerformScientificOperation('1/x')} className="bg-green-600 hover:bg-green-700 p-3 rounded-lg text-sm font-semibold transition-colors text-white">
                                        1/x
                                    </button>
                                    <button onClick={() => calcPerformScientificOperation('π')} className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-sm font-semibold transition-colors text-white">
                                        π
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    <button onClick={calcMemoryStore} className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg text-sm font-semibold transition-colors text-white">
                                        MS
                                    </button>
                                    <button onClick={calcMemoryRecall} className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg text-sm font-semibold transition-colors text-white">
                                        MR
                                    </button>
                                    <button onClick={calcMemoryAdd} className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg text-sm font-semibold transition-colors text-white">
                                        M+
                                    </button>
                                    <button onClick={calcMemoryClear} className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg text-sm font-semibold transition-colors text-white">
                                        MC
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    <button onClick={calcClear} className="col-span-2 bg-red-600 hover:bg-red-700 p-4 rounded-xl text-lg font-semibold transition-colors text-white">
                                        Clear
                                    </button>
                                    <button onClick={() => calcPerformOperation('÷')} className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        ÷
                                    </button>
                                    <button onClick={() => calcInputNumber('7')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        7
                                    </button>
                                    <button onClick={() => calcInputNumber('8')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        8
                                    </button>
                                    <button onClick={() => calcInputNumber('9')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        9
                                    </button>
                                    <button onClick={() => calcPerformOperation('×')} className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        ×
                                    </button>
                                    <button onClick={() => calcInputNumber('4')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        4
                                    </button>
                                    <button onClick={() => calcInputNumber('5')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        5
                                    </button>
                                    <button onClick={() => calcInputNumber('6')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        6
                                    </button>
                                    <button onClick={() => calcPerformOperation('-')} className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        -
                                    </button>
                                    <button onClick={() => calcInputNumber('1')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        1
                                    </button>
                                    <button onClick={() => calcInputNumber('2')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        2
                                    </button>
                                    <button onClick={() => calcInputNumber('3')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        3
                                    </button>
                                    <button onClick={() => calcPerformOperation('+')} className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        +
                                    </button>
                                    <button onClick={() => calcInputNumber('0')} className="col-span-2 bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        0
                                    </button>
                                    <button onClick={calcInputDecimal} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        .
                                    </button>
                                    <button onClick={() => calcPerformOperation('=')} className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl text-xl font-semibold transition-colors text-white">
                                        =
                                    </button>
                                </div>
                            </div>
                        )}

                        {calcMode === 'converter' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(conversions).map(([key, conv]) => (
                                        <button
                                            key={key}
                                            onClick={() => setConversionType(key as 'length' | 'mass' | 'temperature')}
                                            className={`p-3 rounded-lg font-semibold transition-colors ${conversionType === key
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                                }`}
                                        >
                                            {conv.name}
                                        </button>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Value to Convert</label>
                                    <input
                                        type="number"
                                        value={conversionValue}
                                        onChange={(e) => setConversionValue(e.target.value)}
                                        className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-lg"
                                        placeholder="Enter value"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                                    <select
                                        value={fromUnit}
                                        onChange={(e) => setFromUnit(parseInt(e.target.value))}
                                        className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900"
                                    >
                                        {conversions[conversionType].units.map((unit, index) => (
                                            <option key={index} value={index}>
                                                {unit.name} ({unit.symbol})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                    <select
                                        value={toUnit}
                                        onChange={(e) => setToUnit(parseInt(e.target.value))}
                                        className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900"
                                    >
                                        {conversions[conversionType].units.map((unit, index) => (
                                            <option key={index} value={index}>
                                                {unit.name} ({unit.symbol})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-1">Result</div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {convertedValue.toFixed(6).replace(/\.?0+$/, '')} {conversions[conversionType].units[toUnit].symbol}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* History */}
                        {calcMode !== 'converter' && calcHistory.length > 0 && (
                            <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">History</h3>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                    {calcHistory.slice(0, 3).map((entry, index) => (
                                        <div key={index} className="text-xs text-gray-700 font-mono">
                                            {entry}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : title === 'Pattern Generation' ? (
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {[
                                { gen: 1, year: '1980s', colors: ['White'], description: 'White light moves up and down', meaning: 'First cell phones - voice only' },
                                { gen: 2, year: '1990s', colors: ['White', 'Red'], description: 'White and red lights flash back and forth', meaning: 'Text messages and clearer calls' },
                                { gen: 3, year: '2000s', colors: ['Red→Green', 'Yellow→Purple'], description: 'Colors change and fade', meaning: 'Internet and video on phones' },
                                { gen: 4, year: '2010s', colors: ['Red', 'Green', 'Purple', 'Yellow', 'Blue', 'White'], description: 'Two colors chase each other', meaning: 'Faster speeds, HD videos, streaming' },
                                { gen: 5, year: '2019', colors: ['Blue', 'Orange', 'Purple', 'Red', 'Blue', 'Orange'], description: 'Many colors move smoothly', meaning: 'Smart devices and super-fast internet' },
                                { gen: 6, year: '2030', colors: ['Red', 'Blue', 'Yellow', 'Orange'], description: 'Color streams bounce around', meaning: 'Future AI and hologram technology' },
                            ].map((genInfo) => (
                                <button
                                    key={genInfo.gen}
                                    onClick={() => setSelectedGeneration(selectedGeneration === genInfo.gen ? null : genInfo.gen)}
                                    className={`p-4 rounded-xl border-2 transition-all ${
                                        selectedGeneration === genInfo.gen
                                            ? 'border-blue-600 bg-blue-50 shadow-lg'
                                            : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900 mb-2">
                                            G{genInfo.gen} ({genInfo.year})
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-2 mb-2">
                                            {genInfo.colors.map((color, idx) => {
                                                const colorMap: { [key: string]: string } = {
                                                    'White': 'bg-gray-200 border-gray-400',
                                                    'Red': 'bg-red-500 border-red-700',
                                                    'Green': 'bg-green-500 border-green-700',
                                                    'Yellow': 'bg-yellow-400 border-yellow-600',
                                                    'Purple': 'bg-purple-500 border-purple-700',
                                                    'Blue': 'bg-blue-500 border-blue-700',
                                                    'Orange': 'bg-orange-500 border-orange-700',
                                                    'Red→Green': 'bg-gradient-to-r from-red-500 to-green-500 border-gray-600',
                                                    'Yellow→Purple': 'bg-gradient-to-r from-yellow-400 to-purple-500 border-gray-600',
                                                };
                                                const isGradient = color.includes('→');
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`w-8 h-8 rounded-full border-2 ${colorMap[color] || 'bg-gray-300 border-gray-500'}`}
                                                        title={color}
                                                    />
                                                );
                                            })}
                                        </div>
                                        {selectedGeneration === genInfo.gen && (
                                            <div className="mt-3 text-left space-y-2 pt-3 border-t border-gray-300">
                                                <div className="text-sm">
                                                    <span className="font-semibold text-gray-700">What It Looks Like:</span>
                                                    <div className="text-gray-600">{genInfo.description}</div>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="font-semibold text-gray-700">What It Means:</span>
                                                    <div className="text-gray-600">{genInfo.meaning}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : title === 'Flashlight' ? (
                    <div className="max-w-2xl mx-auto">
                        <div className="flex flex-col items-center justify-center min-h-[400px]">
                            {/* Flashlight Icon/Visual */}
                            <div className={`mb-8 transition-all duration-300 ${flashlightOn ? 'opacity-100' : 'opacity-30'}`}>
                                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center ${
                                    flashlightOn 
                                        ? 'bg-yellow-200 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.8)]' 
                                        : 'bg-gray-300 border-gray-400'
                                }`}>
                                    <svg 
                                        className={`w-16 h-16 ${flashlightOn ? 'text-yellow-600' : 'text-gray-500'}`}
                                        fill="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M9 2C7.89 2 7 2.89 7 4V7H6C4.89 7 4 7.89 4 9V19C4 20.11 4.89 21 6 21H18C19.11 21 20 20.11 20 19V9C20 7.89 19.11 7 18 7H17V4C17 2.89 16.11 2 15 2H9M9 4H15V7H9V4M6 9H18V19H6V9M8 11V17H10V11H8M14 11V17H16V11H14Z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Status Text */}
                            <div className="mb-8 text-center">
                                <div className={`text-3xl font-bold mb-2 ${flashlightOn ? 'text-yellow-600' : 'text-gray-500'}`}>
                                    {flashlightOn ? 'ON' : 'OFF'}
                                </div>
                                <div className="text-gray-600 text-lg">
                                    {flashlightOn ? 'Flashlight is active' : 'Flashlight is off'}
                                </div>
                            </div>

                            {/* Vertical Toggle Switch */}
                            <div className="flex flex-col items-center">
                                <label className="text-sm font-semibold text-gray-700 mb-2">OFF</label>
                                <button
                                    onClick={() => setFlashlightOn(!flashlightOn)}
                                    className={`relative w-16 h-32 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-200 ${
                                        flashlightOn 
                                            ? 'bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)]' 
                                            : 'bg-gray-300'
                                    }`}
                                    aria-label="Toggle flashlight"
                                >
                                    <span
                                        className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 w-12 h-12 rounded-full bg-white shadow-lg ${
                                            flashlightOn ? 'top-2' : 'bottom-2'
                                        }`}
                                    />
                                </button>
                                <label className="text-sm font-semibold text-gray-700 mt-2">ON</label>
                            </div>
                        </div>
                    </div>
                ) : title === 'UTSA Interns' ? (
                    <div className="max-w-4xl mx-auto">
                        {/* Logos */}
                        <div className="flex flex-col items-center mb-8">
                            <Image
                                src="/images/logos/Intern-RD-Logo-Black-scaled.png"
                                alt="Intern Research and Development Logo"
                                width={400}
                                height={200}
                                className="w-auto h-24 mb-4"
                            />
                            <Image
                                src="/images/logos/NSF-Logo-scaled.png"
                                alt="NSF Logo"
                                width={200}
                                height={100}
                                className="w-auto h-16"
                            />
                        </div>

                        {/* Project Description */}
                        <div className="mb-8 text-gray-700">
                            <p className="mb-4">
                                This work is supported by U.S. National Science Foundation Award Number 2417095: Intern Research and Development at the Science Center: Exploring Roles and Learning as Students and Mentors Build High-Tech Exhibits.
                            </p>
                            <p className="mb-4">
                                The STEMPhone is an innovative, interactive exhibit designed to replicate the look and feel of a giant smartphone. It offers an engaging, touch-based interface that allows museum visitors to explore STEM concepts and resources in a familiar "mobile app" environment.
                            </p>
                            <p>
                                The project challenged the interns to design intuitive user interfaces, integrate complex systems, and ensure a seamless, interactive experience. They gained hands-on experience in both software development and hardware integration, pushing them to think critically and collaborate to bring a vision to life.
                            </p>
                        </div>

                        {/* UTSA Description */}
                        <div className="mb-8 bg-blue-900 text-white p-6 rounded-xl">
                            <h3 className="text-2xl font-bold mb-4">About The University of Texas at San Antonio</h3>
                            <p className="mb-3">
                                The University of Texas at San Antonio (UTSA) is a public research university located in San Antonio, Texas.
                            </p>
                            <p className="mb-3">
                                UTSA is redefining higher education by empowering career-ready graduates, delivering degrees with exceptional return on investment and fueling economic growth. With a focus on student success and research excellence, UTSA is serving as a model for the urban-serving public universities of the future.
                            </p>
                            <p>
                                Through the transformational learning experiences that we provide, UTSA is creating bold futures for our students, the citizens of San Antonio and beyond.
                            </p>
                        </div>

                        {/* Interns Section */}
                        <div className="space-y-6">
                            {/* Intern 1 - Sandra Sreejith */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                {/* Header */}
                                <div className="bg-blue-900 p-4 flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-lg bg-blue-800 border-2 border-orange-500 flex items-center justify-center flex-shrink-0">
                                        <Image
                                            src="/images/people/unknown.png"
                                            alt="Sandra Sreejith"
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white">Sandra Sreejith</h4>
                                </div>
                                
                                {/* About Me */}
                                <div className="bg-orange-600 p-4">
                                    <h5 className="text-xl font-bold text-white mb-2">About Me</h5>
                                    <p className="text-white mb-2">
                                        Sandra is currently pursuing a bachelors degree in Computer Engineering at UTSA.
                                    </p>
                                    <p className="text-white">
                                        She was the Team Lead for this project and kept the team organized and on track throughout each phase. She developed the calculator app from the ground up, ensuring that it was user friendly and fully functional. She also helped ensure that STEMPhone maintained a cohesive and professional appearance that resembled a smart phone device.
                                    </p>
                                </div>

                                {/* Hobbies/Passions */}
                                <div className="bg-orange-600 p-4">
                                    <h5 className="text-xl font-bold text-white mb-2">Hobbies/Passions</h5>
                                    <p className="text-white">
                                        Sandra's technical passions include coding, circuit design, and embedded systems development. Outside of her technical work, she enjoys dancing, capturing moments through photography, and exploring her creativity with arts and crafts.
                                    </p>
                                </div>

                                {/* Major */}
                                <div className="bg-orange-600 p-4">
                                    <h5 className="text-xl font-bold text-white mb-2">Major</h5>
                                    <p className="text-white">B.S. Computer Engineering</p>
                                </div>

                                {/* Footer */}
                                <div className="bg-blue-900 p-4 text-center">
                                    <p className="text-white">Team Lead, Web Developer, and Software Engineering Intern</p>
                                </div>
                            </div>

                            {/* Intern 2 - Placeholder */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <div className="bg-blue-900 p-4 flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-lg bg-blue-800 border-2 border-orange-500 flex items-center justify-center flex-shrink-0">
                                        <Image
                                            src="/images/people/unknown.png"
                                            alt="Intern"
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white">Intern Name</h4>
                                </div>
                                <div className="bg-orange-600 p-4">
                                    <h5 className="text-xl font-bold text-white mb-2">About Me</h5>
                                    <p className="text-white">Add intern information here.</p>
                                </div>
                                <div className="bg-orange-600 p-4">
                                    <h5 className="text-xl font-bold text-white mb-2">Hobbies/Passions</h5>
                                    <p className="text-white">Add hobbies and passions here.</p>
                                </div>
                                <div className="bg-orange-600 p-4">
                                    <h5 className="text-xl font-bold text-white mb-2">Major</h5>
                                    <p className="text-white">Add major here.</p>
                                </div>
                                <div className="bg-blue-900 p-4 text-center">
                                    <p className="text-white">Add roles here</p>
                                </div>
                            </div>

                            {/* Intern 3 - Placeholder */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <div className="bg-blue-900 p-4 flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-lg bg-blue-800 border-2 border-orange-500 flex items-center justify-center flex-shrink-0">
                                        <Image
                                            src="/images/people/unknown.png"
                                            alt="Intern"
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                    <h4 className="text-2xl font-bold text-white">Intern Name</h4>
                                </div>
                                <div className="bg-orange-600 p-4">
                                    <h5 className="text-xl font-bold text-white mb-2">About Me</h5>
                                    <p className="text-white">Add intern information here.</p>
                                </div>
                                <div className="bg-orange-600 p-4">
                                    <h5 className="text-xl font-bold text-white mb-2">Hobbies/Passions</h5>
                                    <p className="text-white">Add hobbies and passions here.</p>
                                </div>
                                <div className="bg-orange-600 p-4">
                                    <h5 className="text-xl font-bold text-white mb-2">Major</h5>
                                    <p className="text-white">Add major here.</p>
                                </div>
                                <div className="bg-blue-900 p-4 text-center">
                                    <p className="text-white">Add roles here</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : title === 'Phone' ? (
                    <div className="max-w-2xl mx-auto">
                        <div className="flex flex-col items-center justify-center min-h-[400px]">
                            <div className="mb-8">
                                <div className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center mb-6 mx-auto">
                                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Phone</h3>
                                    <p className="text-gray-600">Make a call or view contacts</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                                <button className="p-6 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors">
                                    <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                    </svg>
                                </button>
                                <button className="p-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors">
                                    <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                </button>
                                <button className="p-6 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors">
                                    <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.69.28-.26 0-.51-.1-.69-.28L.28 13.52c-.18-.17-.28-.42-.28-.69 0-.26.1-.51.28-.69C3.34 8.78 7.46 7 12 7s8.66 1.78 11.72 5.14c.18.18.28.43.28.69 0 .26-.1.51-.28.69l-2.12 2.12c-.18.18-.43.28-.69.28-.26 0-.51-.1-.69-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.51-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : title === 'FaceTime' ? (
                    <div className="max-w-2xl mx-auto">
                        <div className="flex flex-col items-center justify-center min-h-[400px]">
                            <div className="mb-8">
                                <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center mb-6 mx-auto">
                                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">FaceTime</h3>
                                    <p className="text-gray-600">Start a video call</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                                <button className="p-6 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors">
                                    <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                                    </svg>
                                </button>
                                <button className="p-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors">
                                    <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                </button>
                                <button className="p-6 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors">
                                    <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.69.28-.26 0-.51-.1-.69-.28L.28 13.52c-.18-.17-.28-.42-.28-.69 0-.26.1-.51.28-.69C3.34 8.78 7.46 7 12 7s8.66 1.78 11.72 5.14c.18.18.28.43.28.69 0 .26-.1.51-.28.69l-2.12 2.12c-.18.18-.43.28-.69.28-.26 0-.51-.1-.69-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.51-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : title === 'Messages' ? (
                    <div className="max-w-2xl mx-auto">
                        <div className="flex flex-col min-h-[500px]">
                            <div className="mb-4">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Messages</h3>
                                <div className="space-y-3">
                                    <div className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                                J
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900">John Doe</div>
                                                <div className="text-sm text-gray-600">Hello, how are you?</div>
                                            </div>
                                            <div className="text-xs text-gray-500">2:30 PM</div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                                                S
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900">Sarah Smith</div>
                                                <div className="text-sm text-gray-600">Thanks for the update!</div>
                                            </div>
                                            <div className="text-xs text-gray-500">1:15 PM</div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                                                M
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900">Mike Johnson</div>
                                                <div className="text-sm text-gray-600">See you tomorrow!</div>
                                            </div>
                                            <div className="text-xs text-gray-500">12:00 PM</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-auto pt-4 border-t border-gray-200">
                                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors">
                                    New Message
                                </button>
                            </div>
                        </div>
                    </div>
                ) : title === 'Mail' ? (
                    <div className="max-w-2xl mx-auto">
                        <div className="flex flex-col min-h-[500px]">
                            <div className="mb-4">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mail</h3>
                                <div className="space-y-3">
                                    <div className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer border-l-4 border-blue-500">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                N
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="font-semibold text-gray-900">Newsletter</div>
                                                    <div className="text-xs text-gray-500">10:30 AM</div>
                                                </div>
                                                <div className="text-sm text-gray-600 font-medium mb-1">Weekly STEM Updates</div>
                                                <div className="text-sm text-gray-600 truncate">Check out this week's latest STEM news and events...</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                T
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="font-semibold text-gray-900">Team Update</div>
                                                    <div className="text-xs text-gray-500">Yesterday</div>
                                                </div>
                                                <div className="text-sm text-gray-600 font-medium mb-1">Project Status</div>
                                                <div className="text-sm text-gray-600 truncate">Here's the latest update on our project progress...</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                                E
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="font-semibold text-gray-900">Event Invitation</div>
                                                    <div className="text-xs text-gray-500">2 days ago</div>
                                                </div>
                                                <div className="text-sm text-gray-600 font-medium mb-1">STEM Conference 2025</div>
                                                <div className="text-sm text-gray-600 truncate">You're invited to join us at the annual STEM conference...</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-auto pt-4 border-t border-gray-200">
                                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors">
                                    Compose
                                </button>
                            </div>
                        </div>
                    </div>
                ) : title === 'Music Player' ? (
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <h2 className="text-4xl font-bold text-purple-700 mb-2">SAMSAT RADIO</h2>
                            <p className="text-purple-600 text-sm">(Click the Play Button to Start Click on Pause Button to Stop)</p>
                        </div>

                        {/* SAMSAT Logo */}
                        <div className="flex justify-center mb-6">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 shadow-xl flex items-center justify-center border-4 border-white">
                                <Image
                                    src="/images/logos/samsat_logo.png"
                                    alt="SAMSAT Logo"
                                    width={120}
                                    height={120}
                                    className="w-24 h-24 object-contain rounded-full"
                                />
                            </div>
                        </div>

                        {/* Currently Playing Track */}
                        {currentTrack && (
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-6 border-2 border-purple-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="flex-1 min-w-0 overflow-hidden">
                                                {currentTrack.title.length > 25 ? (
                                                    <div className="marquee-container w-full">
                                                        <div className="marquee-text text-xl font-bold text-purple-900">
                                                            {currentTrack.title} • {currentTrack.title}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-xl font-bold text-purple-900">
                                                        {currentTrack.title}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <div className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                                                    LIVE
                                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                                </div>
                                                <button
                                                    onClick={() => toggleLike(currentTrack.id)}
                                                    className="p-1 hover:scale-110 transition-transform"
                                                    title={isLiked(currentTrack.id) ? "Unlike" : "Like"}
                                                >
                                                    <svg
                                                        className={`w-6 h-6 transition-all duration-200 ${isLiked(currentTrack.id)
                                                            ? 'text-red-500 fill-current scale-110'
                                                            : 'text-gray-400 hover:text-red-400'
                                                            }`}
                                                        fill={isLiked(currentTrack.id) ? "currentColor" : "none"}
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Player Controls */}
                        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                            {/* Control Buttons Row */}
                            <div className="flex items-center justify-center space-x-4 mb-4">
                                {/* Previous Track Button */}
                                <button
                                    onClick={playPreviousTrack}
                                    className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed text-purple-700"
                                    disabled={!currentTrack}
                                    title="Previous Track"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                                    </svg>
                                </button>

                                {/* Play/Pause Button */}
                                <button
                                    onClick={togglePlayPause}
                                    className="p-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!currentTrack}
                                    title={isPlaying ? "Pause" : "Play"}
                                >
                                    {isPlaying ? (
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>

                                {/* Next Track Button */}
                                <button
                                    onClick={playNextTrack}
                                    className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed text-purple-700"
                                    disabled={!currentTrack}
                                    title="Next Track"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0011 6v2.798l-5.445-3.63z" />
                                    </svg>
                                </button>

                                {/* Volume Button */}
                                <button
                                    className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md transition-all hover:scale-110 text-purple-700"
                                    title="Volume"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {/* Share Button */}
                                <button
                                    className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md transition-all hover:scale-110 text-purple-700"
                                    title="Share"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342c-.346 0-.654.11-.88.29l-4.88 3.88a1 1 0 01-1.414-1.414l4.88-3.88c.226-.18.534-.29.88-.29h6.632c.346 0 .654.11.88.29l4.88 3.88a1 1 0 011.414 1.414l-4.88 3.88c-.226.18-.534.29-.88.29H8.684zM15.316 10.658c.346 0 .654-.11.88-.29l4.88-3.88a1 1 0 011.414 1.414l-4.88 3.88c-.226.18-.534.29-.88.29H8.684c-.346 0-.654-.11-.88-.29l-4.88-3.88a1 1 0 011.414-1.414l4.88 3.88c.226.18.534.29.88.29h6.632z" />
                                    </svg>
                                </button>

                                {/* Playlist Button */}
                                <button
                                    className="p-3 rounded-full bg-white hover:bg-gray-100 shadow-md transition-all hover:scale-110 text-purple-700"
                                    title="Playlist"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                </button>
                            </div>

                            {/* Volume Control */}
                            <div className="flex items-center justify-center space-x-3 mt-4">
                                <svg className="w-5 h-5 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                </svg>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 max-w-xs"
                                />
                                <span className="text-sm text-purple-700 w-12 text-right font-semibold">{Math.round(volume * 100)}%</span>
                            </div>

                            {/* Progress Bar */}
                            {currentTrack && (
                                <div className="mt-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max={currentTrack.duration || 0}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                    />
                                    <div className="flex justify-between text-sm text-purple-700 mt-1">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(currentTrack.duration || 0)}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Track List */}
                        <div>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {demoTracks.map((track) => (
                                    <div
                                        key={track.id}
                                        className={`w-full p-3 rounded-xl transition-all duration-200 ${currentTrack?.id === track.id
                                            ? 'bg-purple-100 border-2 border-purple-400'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            {/* Track Logo */}
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center flex-shrink-0">
                                                <Image
                                                    src="/images/logos/samsat_logo.png"
                                                    alt="SAMSAT"
                                                    width={32}
                                                    height={32}
                                                    className="w-8 h-8 object-contain"
                                                />
                                            </div>
                                            {/* Track Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 truncate">{track.title}</h4>
                                            </div>
                                            {/* Play Button */}
                                            <button
                                                onClick={() => playTrack(track)}
                                                className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-all hover:scale-110 flex-shrink-0"
                                                title="Play Track"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : title === 'Photos' ? (
                    <div className="max-w-4xl mx-auto">
                        {/* Photo Grid - 2x2 Square */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="relative group">
                                <div className="aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <Image
                                        src="/images/graphics/Samsat-photos1-1.png"
                                        alt="SAMSAT Photo 1"
                                        width={600}
                                        height={600}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                            <div className="relative group">
                                <div className="aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <Image
                                        src="/images/graphics/Samsat-photos2-1.png"
                                        alt="SAMSAT Photo 2"
                                        width={600}
                                        height={600}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                            <div className="relative group">
                                <div className="aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <Image
                                        src="/images/graphics/Samsat-photos3.png"
                                        alt="SAMSAT Photo 3"
                                        width={600}
                                        height={600}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                            <div className="relative group">
                                <div className="aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <Image
                                        src="/images/graphics/Samsat-photos4.png"
                                        alt="SAMSAT Photo 4"
                                        width={600}
                                        height={600}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
		) : title === 'Donate to Samsat' ? (
                        <div className="grid grid-cols-3 gap-3">
			<div className="relative group">
					<Image
						src="/images/graphics/launch_dreams_beyond_the_stars.png"
						alt="Donate QR Code"
						width={400}
						height={800}
						className="w-half h-half object-cover group-hover:scale-105"
					/>
			</div>
			<div className="grid grid-cols-1 gap-1">
			<div className="relative group fg-stone-800 center">
			<div className="fg-stone-800 center">
				<p>(USE YOUR PHONE CAMERA TO SCAN)</p>
			</div>
			</div>
			<div className="relative group">
					<Image
						src="/images/graphics/donate_scanme.png"
						alt="Donate QR Code"
						width={400}
						height={700}
						className="w-half h-half object-cover group-hover:scale-105"
					/>
			</div>
			</div>
			<div className="relative group">
					<Image
						src="/images/graphics/transform_dreams_into_reality.png"
						alt="Donate QR Code"
						width={400}
						height={700}
						className="w-half h-half object-cover group-hover:scale-105"
					/>
			</div>
			</div>
                ) : title === 'Video' ? (
                    <div className="max-w-5xl mx-auto">
                        {/* Video Grid - 2 columns, 3 rows */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Row 1 */}
                            <div className="relative group">
                                <div className="aspect-video overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-900">
                                    <iframe
                                        className="w-full h-full"
                                        src="https://www.youtube.com/embed/122W4TZ1r3c"
                                        title="Video 1"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                            <div className="relative group">
                                <div className="aspect-video overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-900">
                                    <iframe
                                        className="w-full h-full"
                                        src="https://www.youtube.com/embed/P6OyxIRshAw"
                                        title="Video 2"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                            {/* Row 2 */}
                            <div className="relative group">
                                <div className="aspect-video overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-900">
                                    <iframe
                                        className="w-full h-full"
                                        src="https://www.youtube.com/embed/Fxs5ot5qIfc"
                                        title="Video 3"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                            <div className="relative group">
                                <div className="aspect-video overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-900">
                                    <iframe
                                        className="w-full h-full"
                                        src="https://www.youtube.com/embed/lJaXoR4C-Gg"
                                        title="Video 4"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                            {/* Row 3 */}
                            <div className="relative group">
                                <div className="aspect-video overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-900">
                                    <iframe
                                        className="w-full h-full"
                                        src="https://www.youtube.com/embed/mW364WKGrF4"
                                        title="Video 5"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                            <div className="relative group">
                                <div className="aspect-video overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-900">
                                    <iframe
                                        className="w-full h-full"
                                        src="https://www.youtube.com/embed/dCeW0NvcTjg"
                                        title="Video 6"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* App Grid */
                    <div className={`grid ${title === 'Games' ? 'grid-cols-2' : 'grid-cols-4'} gap-4 justify-items-center`}>
                        {apps.map((app) => (
                            onItemClick && app.href !== '#' ? (
                                <button
                                    key={app.id}
                                    type="button"
                                    className={`
                                    relative group block cursor-pointer pointer-events-auto z-10
                                    transform transition-all duration-150 ease-out
                                    ${pressedApp === app.id ? 'scale-95' : 'hover:scale-105'}
                                    active:scale-95
                                `}
                                    onClick={() => onItemClick(app)}
                                    onTouchStart={() => handleAppPress(app.id)}
                                    onTouchEnd={handleAppRelease}
                                    onMouseDown={() => handleAppPress(app.id)}
                                    onMouseUp={handleAppRelease}
                                    onMouseLeave={handleAppRelease}
                                >
                                    {/* App Icon Container */}
                                    <div className="relative">
                                        {/* Icon Background */}
                                        <div className={`
                                    w-40 h-40 rounded-3xl
                                    flex items-center justify-center
                                    shadow-lg group-hover:shadow-xl
                                    transition-all duration-200
                                    ${pressedApp === app.id ? 'brightness-90' : ''}
                                `}>
                                            {app.icon.startsWith('/') ? (
                                                <Image
                                                    src={app.icon}
                                                    alt={app.name}
                                                    width={160}
                                                    height={160}
                                                    className="w-40 h-40 object-contain rounded-3xl"
                                                />
                                            ) : (
                                                <div className={`w-40 h-40 rounded-3xl bg-gradient-to-br ${app.gradient} flex items-center justify-center`}>
                                                    <span className="text-6xl">{app.icon}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Shine effect */}
                                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>

                                        {/* Press effect */}
                                        {/* Press effect disabled to avoid intercepting clicks */}
                                    </div>

                                    {/* App Name */}
                                    <div className="mt-5 text-center">
                                        <span className="text-gray-800 text-xl font-medium leading-tight block">
                                            {app.name}
                                        </span>
                                    </div>

                                    {/* Tooltip on hover (for desktop) */}
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                        {app.description}
                                    </div>
                                </button>
                            ) : app.href !== '#' ? (
                                <a
                                    key={app.id}
                                    href={app.href}
                                    className={`
                                    relative group block
                                    transform transition-all duration-150 ease-out
                                    cursor-pointer
                                    ${pressedApp === app.id ? 'scale-95' : 'hover:scale-105'}
                                    active:scale-95
                                `}
                                    onTouchStart={() => handleAppPress(app.id)}
                                    onTouchEnd={handleAppRelease}
                                    onMouseDown={() => handleAppPress(app.id)}
                                    onMouseUp={handleAppRelease}
                                    onMouseLeave={handleAppRelease}
                                >
                                    {/* App Icon Container */}
                                    <div className="relative">
                                        {/* Icon Background */}
                                        <div className={`
                                        w-40 h-40 rounded-3xl
                                        flex items-center justify-center
                                        shadow-lg group-hover:shadow-xl
                                        transition-all duration-200
                                        ${pressedApp === app.id ? 'brightness-90' : ''}
                                    `}>
                                            {app.icon.startsWith('/') ? (
                                                <Image
                                                    src={app.icon}
                                                    alt={app.name}
                                                    width={160}
                                                    height={160}
                                                    className="w-40 h-40 object-contain rounded-3xl"
                                                />
                                            ) : (
                                                <div className={`w-40 h-40 rounded-3xl bg-gradient-to-br ${app.gradient} flex items-center justify-center`}>
                                                    <span className="text-6xl">{app.icon}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Shine effect */}
                                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                                        {/* Press effect */}
                                        {pressedApp === app.id && (
                                            <div className="absolute inset-0 rounded-3xl bg-black/20"></div>
                                        )}
                                    </div>

                                    {/* App Name */}
                                    <div className="mt-5 text-center">
                                        <span className="text-gray-800 text-xl font-medium leading-tight block">
                                            {app.name}
                                        </span>
                                    </div>

                                    {/* Tooltip on hover (for desktop) */}
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                        {app.description}
                                    </div>
                                </a>
                            ) : (
                                <div
                                    key={app.id}
                                    className="relative group block cursor-default"
                                >
                                    {/* App Icon Container */}
                                    <div className="relative">
                                        {/* Icon Background */}
                                        <div className="w-40 h-40 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-200">
                                            {app.icon.startsWith('/') ? (
                                                <Image
                                                    src={app.icon}
                                                    alt={app.name}
                                                    width={160}
                                                    height={160}
                                                    className="w-40 h-40 object-contain rounded-3xl"
                                                />
                                            ) : (
                                                <div className={`w-40 h-40 rounded-3xl bg-gradient-to-br ${app.gradient} flex items-center justify-center`}>
                                                    <span className="text-6xl">{app.icon}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* App Name */}
                                    <div className="mt-5 text-center">
                                        <span className="text-gray-800 text-xl font-medium leading-tight block">
                                            {app.name}
                                        </span>
                                    </div>

                                    {/* Tooltip on hover (for desktop) */}
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                        {app.description}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
