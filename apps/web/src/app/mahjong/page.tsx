'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MahjongTile {
    id: string;
    symbol: string;
    type: 'dots' | 'bamboo' | 'characters' | 'honors' | 'flowers';
    value: number;
    position: { x: number, y: number, z: number };
    isSelected: boolean;
    isMatched: boolean;
    isBlocked: boolean;
}

const tileSymbols = {
    dots: ['🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡'],
    bamboo: ['🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘'],
    characters: ['🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏'],
    honors: ['🀀', '🀁', '🀂', '🀃', '🀄', '🀅', '🀆'],
    flowers: ['🀢', '🀣', '🀤', '🀥', '🀦', '🀧', '🀨', '🀩']
};

export default function MahjongPage() {
    const [tiles, setTiles] = useState<MahjongTile[]>([]);
    const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [totalPairs, setTotalPairs] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (startTime && !isComplete) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [startTime, isComplete]);

    const generateTiles = (): MahjongTile[] => {
        const allTiles: MahjongTile[] = [];
        let tileId = 0;

        // Create pairs of tiles (simplified layout)
        const tileTypes = [
            ...tileSymbols.dots.slice(0, 6),
            ...tileSymbols.bamboo.slice(0, 6),
            ...tileSymbols.characters.slice(0, 6),
            ...tileSymbols.honors.slice(0, 6)
        ];

        // Create a simple 8x6 grid layout
        const positions = [];
        for (let y = 0; y < 6; y++) {
            for (let x = 0; x < 8; x++) {
                positions.push({ x, y, z: 0 });
            }
        }

        // Create pairs of tiles
        for (let i = 0; i < 24; i++) {
            const symbol = tileTypes[i % tileTypes.length];
            const type = symbol.includes('🀙') ? 'dots' :
                symbol.includes('🀐') ? 'bamboo' :
                    symbol.includes('🀇') ? 'characters' : 'honors';

            // Create two identical tiles
            for (let j = 0; j < 2; j++) {
                allTiles.push({
                    id: `${tileId++}`,
                    symbol,
                    type,
                    value: i,
                    position: positions[allTiles.length],
                    isSelected: false,
                    isMatched: false,
                    isBlocked: false
                });
            }
        }

        // Shuffle tiles
        for (let i = allTiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allTiles[i], allTiles[j]] = [allTiles[j], allTiles[i]];
        }

        // Assign shuffled positions
        allTiles.forEach((tile, index) => {
            tile.position = positions[index];
        });

        return allTiles;
    };

    const startNewGame = () => {
        const newTiles = generateTiles();
        setTiles(newTiles);
        setSelectedTiles([]);
        setMatchedPairs(0);
        setTotalPairs(newTiles.length / 2);
        setIsComplete(false);
        setStartTime(new Date());
        setElapsedTime(0);
        setHintsUsed(0);
        setShowHint(false);
        updateBlockedTiles(newTiles);
    };

    const updateBlockedTiles = (currentTiles: MahjongTile[]) => {
        const updatedTiles = currentTiles.map(tile => {
            if (tile.isMatched) return tile;

            // Check if tile is blocked by other tiles
            const isBlocked = currentTiles.some(otherTile =>
                !otherTile.isMatched &&
                otherTile.id !== tile.id &&
                Math.abs(otherTile.position.x - tile.position.x) <= 0.5 &&
                Math.abs(otherTile.position.y - tile.position.y) <= 0.5 &&
                otherTile.position.z > tile.position.z
            );

            return { ...tile, isBlocked };
        });

        setTiles(updatedTiles);
    };

    const handleTileClick = (clickedTile: MahjongTile) => {
        if (clickedTile.isMatched || clickedTile.isBlocked) return;

        const newSelectedTiles = [...selectedTiles];
        const tileIndex = newSelectedTiles.indexOf(clickedTile.id);

        if (tileIndex > -1) {
            // Deselect tile
            newSelectedTiles.splice(tileIndex, 1);
        } else if (newSelectedTiles.length < 2) {
            // Select tile
            newSelectedTiles.push(clickedTile.id);
        } else {
            // Replace first selected tile
            newSelectedTiles[0] = newSelectedTiles[1];
            newSelectedTiles[1] = clickedTile.id;
        }

        setSelectedTiles(newSelectedTiles);

        // Check for match when two tiles are selected
        if (newSelectedTiles.length === 2) {
            const tile1 = tiles.find(t => t.id === newSelectedTiles[0]);
            const tile2 = tiles.find(t => t.id === newSelectedTiles[1]);

            if (tile1 && tile2 && tile1.symbol === tile2.symbol) {
                // Match found!
                setTimeout(() => {
                    const updatedTiles = tiles.map(tile => ({
                        ...tile,
                        isSelected: false,
                        isMatched: tile.id === tile1.id || tile.id === tile2.id ? true : tile.isMatched
                    }));

                    setTiles(updatedTiles);
                    setSelectedTiles([]);
                    setMatchedPairs(matchedPairs + 1);
                    updateBlockedTiles(updatedTiles);

                    // Check if game is complete
                    if (matchedPairs + 1 === totalPairs) {
                        setIsComplete(true);
                        if ('vibrate' in navigator) {
                            navigator.vibrate([100, 50, 100, 50, 100]);
                        }
                    }
                }, 500);
            } else {
                // No match - deselect after delay
                setTimeout(() => {
                    setSelectedTiles([]);
                }, 1000);
            }
        }

        // Update tile selection state
        const updatedTiles = tiles.map(tile => ({
            ...tile,
            isSelected: newSelectedTiles.includes(tile.id)
        }));
        setTiles(updatedTiles);
    };

    const useHint = () => {
        if (hintsUsed >= 3) return; // Limit hints

        const availableTiles = tiles.filter(tile => !tile.isMatched && !tile.isBlocked);
        const matchingPairs: string[][] = [];

        // Find all matching pairs
        for (let i = 0; i < availableTiles.length; i++) {
            for (let j = i + 1; j < availableTiles.length; j++) {
                if (availableTiles[i].symbol === availableTiles[j].symbol) {
                    matchingPairs.push([availableTiles[i].id, availableTiles[j].id]);
                }
            }
        }

        if (matchingPairs.length > 0) {
            const randomPair = matchingPairs[Math.floor(Math.random() * matchingPairs.length)];
            setSelectedTiles(randomPair);
            setHintsUsed(hintsUsed + 1);
            setShowHint(true);

            const updatedTiles = tiles.map(tile => ({
                ...tile,
                isSelected: randomPair.includes(tile.id)
            }));
            setTiles(updatedTiles);

            setTimeout(() => {
                setShowHint(false);
                setSelectedTiles([]);
                const resetTiles = tiles.map(tile => ({
                    ...tile,
                    isSelected: false
                }));
                setTiles(resetTiles);
            }, 2000);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Completion screen
    if (isComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="text-8xl mb-6">🏆</div>
                    <h2 className="text-4xl font-bold mb-4">Mahjong Complete!</h2>
                    <div className="text-2xl mb-2">Time: {formatTime(elapsedTime)}</div>
                    <div className="text-xl mb-2">Hints Used: {hintsUsed}/3</div>
                    <div className="text-lg mb-8">Pairs Matched: {matchedPairs}</div>

                    <div className="space-x-4">
                        <button
                            onClick={startNewGame}
                            className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-full font-semibold transition-colors"
                        >
                            Play Again
                        </button>
                        <Link
                            href="/home"
                            className="inline-block bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-full font-semibold transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Game screen
    if (tiles.length > 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                    <Link href="/home" className="text-2xl">←</Link>
                    <h1 className="text-xl font-semibold">Mahjong</h1>
                    <button
                        onClick={startNewGame}
                        className="text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
                    >
                        New
                    </button>
                </div>

                {/* Game Stats */}
                <div className="flex justify-center space-x-6 p-4 text-center">
                    <div>
                        <div className="text-xl font-bold">{formatTime(elapsedTime)}</div>
                        <div className="text-xs text-gray-300">Time</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold">{matchedPairs}/{totalPairs}</div>
                        <div className="text-xs text-gray-300">Pairs</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold">{hintsUsed}/3</div>
                        <div className="text-xs text-gray-300">Hints</div>
                    </div>
                </div>

                {/* Game Board */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl max-w-lg mx-auto">
                        <div className="grid grid-cols-8 gap-1">
                            {Array.from({ length: 48 }, (_, index) => {
                                const tile = tiles.find(t =>
                                    t.position.x === index % 8 &&
                                    t.position.y === Math.floor(index / 8)
                                );

                                if (!tile || tile.isMatched) {
                                    return (
                                        <div
                                            key={index}
                                            className="w-10 h-12 rounded border border-transparent"
                                        />
                                    );
                                }

                                return (
                                    <button
                                        key={tile.id}
                                        onClick={() => handleTileClick(tile)}
                                        disabled={tile.isBlocked}
                                        className={`
                                            w-10 h-12 rounded border-2 text-2xl flex items-center justify-center
                                            transition-all duration-200 font-bold
                                            ${tile.isSelected
                                                ? 'border-yellow-400 bg-yellow-600 scale-110 shadow-lg'
                                                : tile.isBlocked
                                                    ? 'border-gray-600 bg-gray-700 opacity-50 cursor-not-allowed'
                                                    : 'border-white/30 bg-white/10 hover:border-white/50 hover:bg-white/20 hover:scale-105'
                                            }
                                        `}
                                    >
                                        {tile.symbol}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="p-4 bg-black/20 backdrop-blur-sm">
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={useHint}
                            disabled={hintsUsed >= 3 || showHint}
                            className={`
                                px-6 py-3 rounded-full font-semibold transition-colors
                                ${hintsUsed >= 3 || showHint
                                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                    : 'bg-blue-600 hover:bg-blue-700'
                                }
                            `}
                        >
                            💡 Hint ({3 - hintsUsed} left)
                        </button>

                        <button
                            onClick={() => setSelectedTiles([])}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full font-semibold transition-colors"
                        >
                            Clear Selection
                        </button>
                    </div>

                    {showHint && (
                        <div className="mt-4 text-center">
                            <p className="text-yellow-300 text-sm animate-pulse">
                                💡 These tiles can be matched!
                            </p>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="p-4 bg-black/20 backdrop-blur-sm">
                    <p className="text-center text-sm text-gray-300">
                        Match identical tiles that are not blocked by other tiles. Selected: {selectedTiles.length}/2
                    </p>
                </div>
            </div>
        );
    }

    // Start screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/home" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">Mahjong Solitaire</h1>
                <div className="w-8"></div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="text-center mb-8">
                    <div className="text-8xl mb-4">🀄</div>
                    <h2 className="text-3xl font-bold mb-2">Mahjong Solitaire</h2>
                    <p className="text-gray-300">Match identical tiles to clear the board</p>
                </div>

                {/* Game Preview */}
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-6 text-center">
                    <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto mb-4">
                        {['🀙', '🀚', '🀐', '🀑', '🀇', '🀈', '🀀', '🀄'].map((symbol, index) => (
                            <div
                                key={index}
                                className="w-12 h-14 bg-white/10 rounded border border-white/30 flex items-center justify-center text-2xl"
                            >
                                {symbol}
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-300 text-sm">
                        Match pairs of identical tiles to remove them from the board
                    </p>
                </div>

                {/* Start Button */}
                <div className="text-center">
                    <button
                        onClick={startNewGame}
                        className="bg-green-600 hover:bg-green-700 px-12 py-4 rounded-full text-xl font-semibold transition-colors"
                    >
                        Start New Game
                    </button>
                </div>

                {/* How to Play */}
                <div className="mt-8 bg-blue-900/30 rounded-xl p-4 border border-blue-600/30">
                    <h3 className="font-semibold mb-2 text-blue-200">How to Play</h3>
                    <ul className="text-sm text-blue-200 space-y-1">
                        <li>• Select two identical tiles to match them</li>
                        <li>• Tiles must not be blocked by other tiles</li>
                        <li>• Clear all tiles to win the game</li>
                        <li>• Use hints if you get stuck (3 hints available)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
