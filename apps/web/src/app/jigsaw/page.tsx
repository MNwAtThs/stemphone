'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface PuzzlePiece {
    id: number;
    currentPosition: number;
    correctPosition: number;
    imageUrl: string;
    isEmpty: boolean;
}

interface PuzzleImage {
    id: string;
    name: string;
    url: string;
    difficulty: 'easy' | 'medium' | 'hard';
    pieces: number;
}

const puzzleImages: PuzzleImage[] = [
    {
        id: 'space-nebula',
        name: 'Space Nebula',
        url: '/stemphone/stemphone.org/wp-content/uploads/2025/05/eagle-nebula-11172_1920.jpg',
        difficulty: 'easy',
        pieces: 9
    },
    {
        id: 'astronaut',
        name: 'Astronaut',
        url: '/stemphone/stemphone.org/wp-content/uploads/2025/05/astronaut-11103_1920.jpg',
        difficulty: 'medium',
        pieces: 16
    },
    {
        id: 'mars',
        name: 'Planet Mars',
        url: '/stemphone/stemphone.org/wp-content/uploads/2025/05/mars-11012_1920.jpg',
        difficulty: 'hard',
        pieces: 25
    }
];

export default function JigsawPage() {
    const [selectedImage, setSelectedImage] = useState<PuzzleImage | null>(null);
    const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [moves, setMoves] = useState(0);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (startTime && !isComplete) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [startTime, isComplete]);

    const initializePuzzle = (image: PuzzleImage) => {
        setSelectedImage(image);
        setIsComplete(false);
        setMoves(0);
        setStartTime(new Date());
        setElapsedTime(0);

        const gridSize = Math.sqrt(image.pieces);
        const newPieces: PuzzlePiece[] = [];

        // Create pieces
        for (let i = 0; i < image.pieces; i++) {
            newPieces.push({
                id: i,
                currentPosition: i,
                correctPosition: i,
                imageUrl: image.url,
                isEmpty: false
            });
        }

        // Make last piece empty (sliding puzzle style)
        newPieces[image.pieces - 1].isEmpty = true;

        // Shuffle pieces
        shufflePieces(newPieces, image.pieces);
        setPieces(newPieces);
    };

    const shufflePieces = (pieces: PuzzlePiece[], totalPieces: number) => {
        const gridSize = Math.sqrt(totalPieces);
        let emptyPosition = totalPieces - 1;

        // Perform valid moves to shuffle
        for (let i = 0; i < 1000; i++) {
            const validMoves = getValidMoves(emptyPosition, gridSize);
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];

            // Swap pieces
            const pieceToMove = pieces.find(p => p.currentPosition === randomMove);
            const emptyPiece = pieces.find(p => p.currentPosition === emptyPosition);

            if (pieceToMove && emptyPiece) {
                const tempPosition = pieceToMove.currentPosition;
                pieceToMove.currentPosition = emptyPiece.currentPosition;
                emptyPiece.currentPosition = tempPosition;
                emptyPosition = randomMove;
            }
        }
    };

    const getValidMoves = (emptyPosition: number, gridSize: number): number[] => {
        const validMoves: number[] = [];
        const row = Math.floor(emptyPosition / gridSize);
        const col = emptyPosition % gridSize;

        // Up
        if (row > 0) validMoves.push(emptyPosition - gridSize);
        // Down
        if (row < gridSize - 1) validMoves.push(emptyPosition + gridSize);
        // Left
        if (col > 0) validMoves.push(emptyPosition - 1);
        // Right
        if (col < gridSize - 1) validMoves.push(emptyPosition + 1);

        return validMoves;
    };

    const handlePieceClick = (clickedPiece: PuzzlePiece) => {
        if (!selectedImage || clickedPiece.isEmpty) return;

        const gridSize = Math.sqrt(selectedImage.pieces);
        const emptyPiece = pieces.find(p => p.isEmpty);
        if (!emptyPiece) return;

        const validMoves = getValidMoves(emptyPiece.currentPosition, gridSize);

        if (validMoves.includes(clickedPiece.currentPosition)) {
            // Valid move - swap pieces
            const newPieces = [...pieces];
            const clickedIndex = newPieces.findIndex(p => p.id === clickedPiece.id);
            const emptyIndex = newPieces.findIndex(p => p.isEmpty);

            if (clickedIndex !== -1 && emptyIndex !== -1) {
                const tempPosition = newPieces[clickedIndex].currentPosition;
                newPieces[clickedIndex].currentPosition = newPieces[emptyIndex].currentPosition;
                newPieces[emptyIndex].currentPosition = tempPosition;

                setPieces(newPieces);
                setMoves(moves + 1);

                // Check if puzzle is complete
                const isCompleted = newPieces.every(piece =>
                    piece.isEmpty || piece.currentPosition === piece.correctPosition
                );

                if (isCompleted) {
                    setIsComplete(true);
                    // Haptic feedback
                    if ('vibrate' in navigator) {
                        navigator.vibrate([100, 50, 100]);
                    }
                }
            }
        }
    };

    const resetPuzzle = () => {
        if (selectedImage) {
            initializePuzzle(selectedImage);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getPieceStyle = (piece: PuzzlePiece, index: number): React.CSSProperties => {
        if (!selectedImage) return {};

        const gridSize = Math.sqrt(selectedImage.pieces);
        const pieceSize = 100 / gridSize;

        // Calculate background position based on correct position
        const correctRow = Math.floor(piece.correctPosition / gridSize);
        const correctCol = piece.correctPosition % gridSize;

        return {
            backgroundImage: piece.isEmpty ? 'none' : `url(${piece.imageUrl})`,
            backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
            backgroundPosition: `-${correctCol * pieceSize}% -${correctRow * pieceSize}%`,
            backgroundColor: piece.isEmpty ? 'rgba(255,255,255,0.1)' : 'transparent'
        };
    };

    // Puzzle completion screen
    if (isComplete && selectedImage) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 text-white flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="text-8xl mb-6">🎉</div>
                    <h2 className="text-4xl font-bold mb-4">Puzzle Complete!</h2>
                    <div className="text-2xl mb-2">Time: {formatTime(elapsedTime)}</div>
                    <div className="text-xl mb-8">Moves: {moves}</div>

                    {/* Show completed puzzle */}
                    <div className="mb-8">
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.name}
                            className="w-64 h-64 object-cover rounded-2xl mx-auto shadow-2xl"
                        />
                    </div>

                    <div className="space-x-4">
                        <button
                            onClick={resetPuzzle}
                            className="bg-yellow-600 hover:bg-yellow-700 px-8 py-3 rounded-full font-semibold transition-colors"
                        >
                            Play Again
                        </button>
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-full font-semibold transition-colors"
                        >
                            Choose New Puzzle
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Game screen
    if (selectedImage) {
        const gridSize = Math.sqrt(selectedImage.pieces);

        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 text-white">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="text-2xl p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        ←
                    </button>
                    <h1 className="text-xl font-semibold">Jigsaw Puzzle</h1>
                    <button
                        onClick={resetPuzzle}
                        className="text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
                    >
                        Reset
                    </button>
                </div>

                {/* Game Stats */}
                <div className="flex justify-center space-x-8 p-4 text-center">
                    <div>
                        <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
                        <div className="text-xs text-gray-300">Time</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{moves}</div>
                        <div className="text-xs text-gray-300">Moves</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{selectedImage.pieces}</div>
                        <div className="text-xs text-gray-300">Pieces</div>
                    </div>
                </div>

                {/* Puzzle Grid */}
                <div className="flex-1 flex items-center justify-center p-6">
                    <div
                        className="grid gap-1 bg-black/20 p-4 rounded-2xl max-w-sm mx-auto"
                        style={{
                            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                            aspectRatio: '1'
                        }}
                    >
                        {Array.from({ length: selectedImage.pieces }, (_, index) => {
                            const piece = pieces.find(p => p.currentPosition === index);
                            return (
                                <button
                                    key={index}
                                    onClick={() => piece && handlePieceClick(piece)}
                                    className={`
                                        aspect-square rounded-lg border-2 transition-all duration-200
                                        ${piece?.isEmpty
                                            ? 'border-dashed border-white/30 bg-white/5'
                                            : 'border-white/20 hover:border-white/40 hover:scale-105'
                                        }
                                    `}
                                    style={piece ? getPieceStyle(piece, index) : {}}
                                    disabled={piece?.isEmpty}
                                >
                                    {piece?.isEmpty && (
                                        <div className="w-full h-full flex items-center justify-center text-white/30">
                                            ⭕
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Instructions */}
                <div className="p-4 bg-black/20 backdrop-blur-sm">
                    <p className="text-center text-sm text-gray-300">
                        Tap pieces next to the empty space to move them. Complete the {selectedImage.name} puzzle!
                    </p>
                </div>
            </div>
        );
    }

    // Image selection screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/home" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">Jigsaw Puzzles</h1>
                <div className="w-8"></div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="text-center mb-8">
                    <div className="text-8xl mb-4">🧩</div>
                    <h2 className="text-3xl font-bold mb-2">Choose Your Puzzle</h2>
                    <p className="text-gray-300">Select a beautiful space image to solve!</p>
                </div>

                {/* Puzzle Selection */}
                <div className="space-y-4">
                    {puzzleImages.map((image) => (
                        <button
                            key={image.id}
                            onClick={() => initializePuzzle(image)}
                            className="w-full bg-black/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-black/30 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                    <img
                                        src={image.url}
                                        alt={image.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-xl font-bold mb-1">{image.name}</h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                                        <span className="capitalize">{image.difficulty}</span>
                                        <span>{image.pieces} pieces</span>
                                        <span>{Math.sqrt(image.pieces)}×{Math.sqrt(image.pieces)} grid</span>
                                    </div>
                                </div>
                                <div className="text-2xl">▶️</div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* How to Play */}
                <div className="mt-8 bg-blue-900/30 rounded-xl p-4 border border-blue-600/30">
                    <h3 className="font-semibold mb-2 text-blue-200">How to Play</h3>
                    <ul className="text-sm text-blue-200 space-y-1">
                        <li>• Tap pieces adjacent to the empty space to move them</li>
                        <li>• Arrange all pieces to recreate the original image</li>
                        <li>• Try to complete the puzzle in the fewest moves!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
