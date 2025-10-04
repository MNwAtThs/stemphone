'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

const morseCodeMap: { [key: string]: string } = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', ' ': '/'
};

const reverseMorseMap: { [key: string]: string } = {};
Object.entries(morseCodeMap).forEach(([letter, morse]) => {
    reverseMorseMap[morse] = letter;
});

export default function MorseCodePage() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(200); // milliseconds
    const audioContextRef = useRef<AudioContext | null>(null);

    const textToMorse = (text: string): string => {
        return text.toUpperCase()
            .split('')
            .map(char => morseCodeMap[char] || char)
            .join(' ');
    };

    const morseToText = (morse: string): string => {
        return morse.split(' ')
            .map(code => reverseMorseMap[code] || code)
            .join('');
    };

    const handleInputChange = (value: string) => {
        setInputText(value);
        if (mode === 'encode') {
            setOutputText(textToMorse(value));
        } else {
            setOutputText(morseToText(value));
        }
    };

    const switchMode = () => {
        const newMode = mode === 'encode' ? 'decode' : 'encode';
        setMode(newMode);
        setInputText('');
        setOutputText('');
    };

    const clearAll = () => {
        setInputText('');
        setOutputText('');
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // Show feedback
            const button = document.activeElement as HTMLButtonElement;
            if (button) {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1000);
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    };

    const playMorseCode = async (morseText: string) => {
        if (isPlaying) return;

        setIsPlaying(true);

        try {
            // Create audio context if it doesn't exist
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            const audioContext = audioContextRef.current;
            const frequency = 600; // Hz

            for (let i = 0; i < morseText.length; i++) {
                const char = morseText[i];

                if (char === '.') {
                    // Dot - short beep
                    await playTone(audioContext, frequency, playbackSpeed * 0.3);
                } else if (char === '-') {
                    // Dash - long beep
                    await playTone(audioContext, frequency, playbackSpeed);
                } else if (char === ' ') {
                    // Space between letters
                    await sleep(playbackSpeed * 0.7);
                } else if (char === '/') {
                    // Space between words
                    await sleep(playbackSpeed * 2);
                }

                // Small pause between dots/dashes
                if (char === '.' || char === '-') {
                    await sleep(playbackSpeed * 0.3);
                }
            }
        } catch (error) {
            console.error('Error playing morse code:', error);
        }

        setIsPlaying(false);
    };

    const playTone = (audioContext: AudioContext, frequency: number, duration: number): Promise<void> => {
        return new Promise((resolve) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);

            setTimeout(resolve, duration);
        });
    };

    const sleep = (ms: number): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const quickInsert = (text: string) => {
        setInputText(text);
        handleInputChange(text);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/home" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">Morse Code</h1>
                <button
                    onClick={switchMode}
                    className="text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
                >
                    {mode === 'encode' ? 'Decode' : 'Encode'}
                </button>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">📡</div>
                    <h2 className="text-2xl font-bold mb-2">Morse Code Translator</h2>
                    <p className="text-gray-300">
                        {mode === 'encode' ? 'Convert text to Morse code' : 'Convert Morse code to text'}
                    </p>
                </div>

                {/* Mode Indicator */}
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-center space-x-4">
                        <div className={`px-4 py-2 rounded-lg ${mode === 'encode' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                            Text → Morse
                        </div>
                        <div className="text-2xl">⇄</div>
                        <div className={`px-4 py-2 rounded-lg ${mode === 'decode' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                            Morse → Text
                        </div>
                    </div>
                </div>

                {/* Input Section */}
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        {mode === 'encode' ? 'Enter Text:' : 'Enter Morse Code:'}
                    </label>
                    <textarea
                        value={inputText}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder={mode === 'encode' ? 'Type your message here...' : 'Enter morse code (use . - and spaces)...'}
                        className="w-full h-24 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                    />
                </div>

                {/* Output Section */}
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300">
                            {mode === 'encode' ? 'Morse Code:' : 'Decoded Text:'}
                        </label>
                        <button
                            onClick={() => copyToClipboard(outputText)}
                            className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full transition-colors"
                            disabled={!outputText}
                        >
                            Copy
                        </button>
                    </div>
                    <div className="min-h-24 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white font-mono text-lg">
                        {outputText || (mode === 'encode' ? 'Morse code will appear here...' : 'Decoded text will appear here...')}
                    </div>
                </div>

                {/* Audio Playback (for encoded morse) */}
                {mode === 'encode' && outputText && (
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Audio Playback</h3>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-300">Speed:</span>
                                <select
                                    value={playbackSpeed}
                                    onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))}
                                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                                >
                                    <option value={100}>Fast</option>
                                    <option value={200}>Normal</option>
                                    <option value={300}>Slow</option>
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={() => playMorseCode(outputText)}
                            disabled={isPlaying}
                            className={`w-full py-3 rounded-lg font-semibold transition-colors ${isPlaying
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                                }`}
                        >
                            {isPlaying ? '🔊 Playing...' : '🔊 Play Morse Code'}
                        </button>
                    </div>
                )}

                {/* Quick Examples */}
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-6">
                    <h3 className="font-semibold mb-3">Quick Examples</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => quickInsert('SOS')}
                            className="bg-red-600 hover:bg-red-700 p-3 rounded-lg transition-colors"
                        >
                            <div className="font-semibold">SOS</div>
                            <div className="text-xs text-red-200">Emergency signal</div>
                        </button>
                        <button
                            onClick={() => quickInsert('HELLO')}
                            className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition-colors"
                        >
                            <div className="font-semibold">HELLO</div>
                            <div className="text-xs text-blue-200">Greeting</div>
                        </button>
                        <button
                            onClick={() => quickInsert('SAMSAT')}
                            className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg transition-colors"
                        >
                            <div className="font-semibold">SAMSAT</div>
                            <div className="text-xs text-purple-200">Museum name</div>
                        </button>
                        <button
                            onClick={() => quickInsert('STEM')}
                            className="bg-green-600 hover:bg-green-700 p-3 rounded-lg transition-colors"
                        >
                            <div className="font-semibold">STEM</div>
                            <div className="text-xs text-green-200">Education</div>
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex space-x-4">
                    <button
                        onClick={clearAll}
                        className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={switchMode}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
                    </button>
                </div>

                {/* Educational Info */}
                <div className="mt-6 bg-blue-900/30 rounded-xl p-4 border border-blue-600/30">
                    <h3 className="font-semibold mb-2 text-blue-200">📚 About Morse Code</h3>
                    <p className="text-sm text-blue-200">
                        Morse code was invented by Samuel Morse in the 1830s for telegraph communication.
                        It uses dots (short signals) and dashes (long signals) to represent letters and numbers.
                        It's still used today in radio communication and emergency situations!
                    </p>
                </div>
            </div>
        </div>
    );
}
