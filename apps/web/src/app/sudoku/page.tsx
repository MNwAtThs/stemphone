'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type SudokuGrid = (number | null)[][];
type Difficulty = 'easy' | 'medium' | 'hard';

interface SudokuPuzzle {
    puzzle: SudokuGrid;
    solution: SudokuGrid;
    difficulty: Difficulty;
}

export default function SudokuPage() {
    const [grid, setGrid] = useState<SudokuGrid>([]);
    const [originalGrid, setOriginalGrid] = useState<SudokuGrid>([]);
    const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [mistakes, setMistakes] = useState(0);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showNumbers, setShowNumbers] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (startTime && !isComplete) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [startTime, isComplete]);

    // Generate a simple Sudoku puzzle
    const generatePuzzle = (difficulty: Difficulty): SudokuPuzzle => {
        // Create a solved grid first
        const solution: SudokuGrid = [
            [5, 3, 4, 6, 7, 8, 9, 1, 2],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [3, 4, 5, 2, 8, 6, 1, 7, 9]
        ];

        // Create puzzle by removing numbers based on difficulty
        const puzzle: SudokuGrid = solution.map(row => [...row]);

        const cellsToRemove = {
            easy: 35,
            medium: 45,
            hard: 55
        };

        const toRemove = cellsToRemove[difficulty];
        const positions = [];

        // Generate all possible positions
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                positions.push({ row, col });
            }
        }

        // Shuffle positions and remove numbers
        positions.sort(() => Math.random() - 0.5);
        for (let i = 0; i < toRemove; i++) {
            const { row, col } = positions[i];
            puzzle[row][col] = null;
        }

        return { puzzle, solution, difficulty };
    };

    const startNewGame = (selectedDifficulty: Difficulty) => {
        const puzzleData = generatePuzzle(selectedDifficulty);
        setGrid(puzzleData.puzzle);
        setOriginalGrid(puzzleData.puzzle.map(row => [...row]));
        setDifficulty(selectedDifficulty);
        setSelectedCell(null);
        setIsComplete(false);
        setMistakes(0);
        setStartTime(new Date());
        setElapsedTime(0);
        setShowNumbers(false);
    };

    const isValidMove = (row: number, col: number, num: number): boolean => {
        // Check row
        for (let c = 0; c < 9; c++) {
            if (c !== col && grid[row][c] === num) return false;
        }

        // Check column
        for (let r = 0; r < 9; r++) {
            if (r !== row && grid[r][col] === num) return false;
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;

        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if ((r !== row || c !== col) && grid[r][c] === num) return false;
            }
        }

        return true;
    };

    const handleCellClick = (row: number, col: number) => {
        if (originalGrid[row][col] !== null) return; // Can't modify original numbers
        setSelectedCell({ row, col });
        setShowNumbers(true);
    };

    const handleNumberSelect = (num: number) => {
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        const newGrid = grid.map(r => [...r]);

        if (isValidMove(row, col, num)) {
            newGrid[row][col] = num;
            setGrid(newGrid);

            // Check if puzzle is complete
            const isCompleted = newGrid.every(row =>
                row.every(cell => cell !== null)
            );

            if (isCompleted) {
                setIsComplete(true);
                if ('vibrate' in navigator) {
                    navigator.vibrate([100, 50, 100, 50, 100]);
                }
            }
        } else {
            setMistakes(mistakes + 1);
            // Brief red flash for invalid move
            if ('vibrate' in navigator) {
                navigator.vibrate(200);
            }
        }

        setShowNumbers(false);
        setSelectedCell(null);
    };

    const clearCell = () => {
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        if (originalGrid[row][col] !== null) return;

        const newGrid = grid.map(r => [...r]);
        newGrid[row][col] = null;
        setGrid(newGrid);
        setShowNumbers(false);
        setSelectedCell(null);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getCellStyle = (row: number, col: number): string => {
        let classes = 'w-8 h-8 border border-gray-400 flex items-center justify-center text-lg font-bold transition-colors ';

        // Original numbers (non-editable)
        if (originalGrid[row] && originalGrid[row][col] !== null) {
            classes += 'bg-gray-700 text-white ';
        } else {
            classes += 'bg-white/10 text-gray-200 hover:bg-white/20 ';
        }

        // Selected cell
        if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
            classes += 'bg-blue-500 text-white ';
        }

        // Thick borders for 3x3 boxes
        if (row % 3 === 0) classes += 'border-t-2 border-t-white ';
        if (col % 3 === 0) classes += 'border-l-2 border-l-white ';
        if (row === 8) classes += 'border-b-2 border-b-white ';
        if (col === 8) classes += 'border-r-2 border-r-white ';

        return classes;
    };

    // Completion screen
    if (isComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 text-white flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="text-8xl mb-6">🏆</div>
                    <h2 className="text-4xl font-bold mb-4">Sudoku Complete!</h2>
                    <div className="text-2xl mb-2">Time: {formatTime(elapsedTime)}</div>
                    <div className="text-xl mb-2">Mistakes: {mistakes}</div>
                    <div className="text-lg mb-8 capitalize">Difficulty: {difficulty}</div>

                    <div className="space-x-4">
                        <button
                            onClick={() => startNewGame(difficulty)}
                            className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-full font-semibold transition-colors"
                        >
                            Play Again
                        </button>
                        <button
                            onClick={() => setGrid([])}
                            className="bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-full font-semibold transition-colors"
                        >
                            New Difficulty
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Game screen
    if (grid.length > 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 text-white">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                    <button
                        onClick={() => setGrid([])}
                        className="text-2xl p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        ←
                    </button>
                    <h1 className="text-xl font-semibold">Sudoku</h1>
                    <button
                        onClick={() => startNewGame(difficulty)}
                        className="text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
                    >
                        New
                    </button>
                </div>

                {/* Game Stats */}
                <div className="flex justify-center space-x-8 p-4 text-center">
                    <div>
                        <div className="text-xl font-bold">{formatTime(elapsedTime)}</div>
                        <div className="text-xs text-gray-300">Time</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold">{mistakes}</div>
                        <div className="text-xs text-gray-300">Mistakes</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold capitalize">{difficulty}</div>
                        <div className="text-xs text-gray-300">Level</div>
                    </div>
                </div>

                {/* Sudoku Grid */}
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl">
                        <div className="grid grid-cols-9 gap-0 bg-white border-2 border-white">
                            {grid.map((row, rowIndex) =>
                                row.map((cell, colIndex) => (
                                    <button
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => handleCellClick(rowIndex, colIndex)}
                                        className={getCellStyle(rowIndex, colIndex)}
                                        disabled={originalGrid[rowIndex][colIndex] !== null}
                                    >
                                        {cell || ''}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Number Input */}
                {showNumbers && selectedCell && (
                    <div className="p-4 bg-black/20 backdrop-blur-sm">
                        <div className="max-w-sm mx-auto">
                            <div className="grid grid-cols-5 gap-3 mb-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => handleNumberSelect(num)}
                                        className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl text-xl font-bold transition-colors"
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={clearCell}
                                className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold transition-colors"
                            >
                                Clear Cell
                            </button>
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="p-4 bg-black/20 backdrop-blur-sm">
                    <p className="text-center text-sm text-gray-300">
                        Fill the grid so each row, column, and 3×3 box contains digits 1-9
                    </p>
                </div>
            </div>
        );
    }

    // Difficulty selection screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/home" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">Sudoku</h1>
                <div className="w-8"></div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="text-center mb-8">
                    <div className="text-8xl mb-4">🔢</div>
                    <h2 className="text-3xl font-bold mb-2">Sudoku Classic</h2>
                    <p className="text-gray-300">Choose your difficulty level</p>
                </div>

                {/* Difficulty Selection */}
                <div className="space-y-4 max-w-md mx-auto">
                    <button
                        onClick={() => startNewGame('easy')}
                        className="w-full bg-green-600 hover:bg-green-700 p-6 rounded-2xl transition-colors"
                    >
                        <div className="text-left">
                            <h3 className="text-2xl font-bold mb-2">Easy</h3>
                            <p className="text-green-200">Perfect for beginners</p>
                            <p className="text-sm text-green-300">35 numbers removed</p>
                        </div>
                    </button>

                    <button
                        onClick={() => startNewGame('medium')}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 p-6 rounded-2xl transition-colors"
                    >
                        <div className="text-left">
                            <h3 className="text-2xl font-bold mb-2">Medium</h3>
                            <p className="text-yellow-200">A good challenge</p>
                            <p className="text-sm text-yellow-300">45 numbers removed</p>
                        </div>
                    </button>

                    <button
                        onClick={() => startNewGame('hard')}
                        className="w-full bg-red-600 hover:bg-red-700 p-6 rounded-2xl transition-colors"
                    >
                        <div className="text-left">
                            <h3 className="text-2xl font-bold mb-2">Hard</h3>
                            <p className="text-red-200">For experts only</p>
                            <p className="text-sm text-red-300">55 numbers removed</p>
                        </div>
                    </button>
                </div>

                {/* How to Play */}
                <div className="mt-8 bg-blue-900/30 rounded-xl p-4 border border-blue-600/30">
                    <h3 className="font-semibold mb-2 text-blue-200">How to Play</h3>
                    <ul className="text-sm text-blue-200 space-y-1">
                        <li>• Fill each row with numbers 1-9</li>
                        <li>• Fill each column with numbers 1-9</li>
                        <li>• Fill each 3×3 box with numbers 1-9</li>
                        <li>• No number can repeat in any row, column, or box</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
