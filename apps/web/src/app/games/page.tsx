'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Game {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'math' | 'science' | 'logic' | 'memory';
    difficulty: 'easy' | 'medium' | 'hard';
    gradient: string;
}

interface QuizQuestion {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

const games: Game[] = [
    {
        id: 'math-quiz',
        title: 'Math Challenge',
        description: 'Test your mathematical skills with fun problems',
        icon: '🧮',
        category: 'math',
        difficulty: 'medium',
        gradient: 'from-blue-500 to-purple-600'
    },
    {
        id: 'science-quiz',
        title: 'Science Explorer',
        description: 'Discover amazing science facts and principles',
        icon: '🔬',
        category: 'science',
        difficulty: 'medium',
        gradient: 'from-green-500 to-teal-600'
    },
    {
        id: 'memory-game',
        title: 'Memory Master',
        description: 'Match pairs and improve your memory skills',
        icon: '🧠',
        category: 'memory',
        difficulty: 'easy',
        gradient: 'from-pink-500 to-red-600'
    },
    {
        id: 'logic-puzzle',
        title: 'Logic Puzzles',
        description: 'Solve challenging logic and pattern problems',
        icon: '🧩',
        category: 'logic',
        difficulty: 'hard',
        gradient: 'from-orange-500 to-yellow-600'
    }
];

const mathQuestions: QuizQuestion[] = [
    {
        question: "What is 15 × 8?",
        options: ["120", "125", "115", "130"],
        correct: 0,
        explanation: "15 × 8 = 120. You can think of it as (10 × 8) + (5 × 8) = 80 + 40 = 120."
    },
    {
        question: "If a circle has a radius of 5 units, what is its area? (Use π ≈ 3.14)",
        options: ["78.5", "31.4", "15.7", "62.8"],
        correct: 0,
        explanation: "Area = π × r² = 3.14 × 5² = 3.14 × 25 = 78.5 square units."
    },
    {
        question: "What is the square root of 144?",
        options: ["12", "14", "16", "10"],
        correct: 0,
        explanation: "√144 = 12, because 12 × 12 = 144."
    },
    {
        question: "If you have 3/4 of a pizza and eat 1/3 of what you have, how much pizza is left?",
        options: ["1/2", "5/12", "1/4", "2/3"],
        correct: 0,
        explanation: "You eat 1/3 of 3/4, which is (1/3) × (3/4) = 1/4. So you have 3/4 - 1/4 = 1/2 left."
    }
];

const scienceQuestions: QuizQuestion[] = [
    {
        question: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Go", "Gd"],
        correct: 0,
        explanation: "Au comes from the Latin word 'aurum' meaning gold. Silver is Ag (argentum)."
    },
    {
        question: "How many bones are in an adult human body?",
        options: ["206", "195", "220", "180"],
        correct: 0,
        explanation: "Adults have 206 bones. Babies are born with about 270 bones, but many fuse together as they grow."
    },
    {
        question: "What gas makes up about 78% of Earth's atmosphere?",
        options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Argon"],
        correct: 0,
        explanation: "Nitrogen (N₂) makes up about 78% of our atmosphere, while oxygen is about 21%."
    },
    {
        question: "What is the speed of light in a vacuum?",
        options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"],
        correct: 0,
        explanation: "Light travels at approximately 299,792,458 meters per second, or about 300,000 kilometers per second."
    }
];

export default function GamesPage() {
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);

    // Memory game state
    const [memoryCards, setMemoryCards] = useState<string[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedCards, setMatchedCards] = useState<number[]>([]);
    const [memoryScore, setMemoryScore] = useState(0);
    const [moves, setMoves] = useState(0);

    const getCurrentQuestions = (): QuizQuestion[] => {
        if (selectedGame?.id === 'math-quiz') return mathQuestions;
        if (selectedGame?.id === 'science-quiz') return scienceQuestions;
        return [];
    };

    const handleAnswerSelect = (answerIndex: number) => {
        if (selectedAnswer !== null) return;

        setSelectedAnswer(answerIndex);
        const questions = getCurrentQuestions();
        const isCorrect = answerIndex === questions[currentQuestion].correct;

        if (isCorrect) {
            setScore(score + 1);
        }

        setShowExplanation(true);

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
                setShowExplanation(false);
            } else {
                setGameComplete(true);
            }
        }, 3000);
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setGameComplete(false);
    };

    const initializeMemoryGame = () => {
        const symbols = ['🔬', '🧪', '⚗️', '🔭', '🧬', '⚛️', '🌡️', '🔋'];
        const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
        setMemoryCards(cards);
        setFlippedCards([]);
        setMatchedCards([]);
        setMemoryScore(0);
        setMoves(0);
    };

    const handleCardClick = (index: number) => {
        if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
            return;
        }

        const newFlippedCards = [...flippedCards, index];
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
            setMoves(moves + 1);
            const [first, second] = newFlippedCards;

            if (memoryCards[first] === memoryCards[second]) {
                setMatchedCards([...matchedCards, first, second]);
                setMemoryScore(memoryScore + 10);
                setFlippedCards([]);

                if (matchedCards.length + 2 === memoryCards.length) {
                    setTimeout(() => setGameComplete(true), 500);
                }
            } else {
                setTimeout(() => setFlippedCards([]), 1000);
            }
        }
    };

    const startGame = (game: Game) => {
        setSelectedGame(game);
        if (game.id === 'memory-game') {
            initializeMemoryGame();
        } else {
            resetQuiz();
        }
    };

    const backToMenu = () => {
        setSelectedGame(null);
        setGameComplete(false);
    };

    // Quiz Game Render
    if (selectedGame && (selectedGame.id === 'math-quiz' || selectedGame.id === 'science-quiz')) {
        const questions = getCurrentQuestions();

        if (gameComplete) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white flex items-center justify-center">
                    <div className="text-center p-8">
                        <div className="text-8xl mb-6">🏆</div>
                        <h2 className="text-4xl font-bold mb-4">Quiz Complete!</h2>
                        <div className="text-6xl font-bold mb-4 text-yellow-400">
                            {score}/{questions.length}
                        </div>
                        <p className="text-xl mb-8">
                            {score === questions.length ? 'Perfect Score! Amazing!' :
                                score >= questions.length * 0.8 ? 'Great Job!' :
                                    score >= questions.length * 0.6 ? 'Good Work!' : 'Keep Learning!'}
                        </p>
                        <div className="space-x-4">
                            <button
                                onClick={resetQuiz}
                                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold transition-colors"
                            >
                                Play Again
                            </button>
                            <button
                                onClick={backToMenu}
                                className="bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-full font-semibold transition-colors"
                            >
                                Back to Games
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                    <button onClick={backToMenu} className="text-2xl">←</button>
                    <h1 className="text-xl font-semibold">{selectedGame.title}</h1>
                    <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                        {currentQuestion + 1}/{questions.length}
                    </div>
                </div>

                {/* Score */}
                <div className="p-4 text-center">
                    <div className="text-2xl font-bold">Score: {score}/{questions.length}</div>
                </div>

                {/* Question */}
                <div className="p-6">
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                        <h2 className="text-2xl font-bold mb-6 text-center">
                            {questions[currentQuestion].question}
                        </h2>

                        <div className="space-y-3">
                            {questions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={selectedAnswer !== null}
                                    className={`w-full p-4 rounded-xl text-left transition-colors ${selectedAnswer === null
                                            ? 'bg-white/10 hover:bg-white/20'
                                            : selectedAnswer === index
                                                ? index === questions[currentQuestion].correct
                                                    ? 'bg-green-600'
                                                    : 'bg-red-600'
                                                : index === questions[currentQuestion].correct
                                                    ? 'bg-green-600'
                                                    : 'bg-white/10'
                                        }`}
                                >
                                    <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                                    {option}
                                </button>
                            ))}
                        </div>

                        {showExplanation && (
                            <div className="mt-6 p-4 bg-blue-900/50 rounded-xl">
                                <h3 className="font-semibold mb-2">Explanation:</h3>
                                <p className="text-gray-200">{questions[currentQuestion].explanation}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Memory Game Render
    if (selectedGame && selectedGame.id === 'memory-game') {
        if (gameComplete) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 text-white flex items-center justify-center">
                    <div className="text-center p-8">
                        <div className="text-8xl mb-6">🧠</div>
                        <h2 className="text-4xl font-bold mb-4">Memory Master!</h2>
                        <div className="text-2xl mb-2">Score: {memoryScore}</div>
                        <div className="text-xl mb-8">Completed in {moves} moves</div>
                        <div className="space-x-4">
                            <button
                                onClick={() => initializeMemoryGame()}
                                className="bg-pink-600 hover:bg-pink-700 px-8 py-3 rounded-full font-semibold transition-colors"
                            >
                                Play Again
                            </button>
                            <button
                                onClick={backToMenu}
                                className="bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-full font-semibold transition-colors"
                            >
                                Back to Games
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 text-white">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                    <button onClick={backToMenu} className="text-2xl">←</button>
                    <h1 className="text-xl font-semibold">Memory Game</h1>
                    <div className="text-sm">Moves: {moves}</div>
                </div>

                {/* Score */}
                <div className="p-4 text-center">
                    <div className="text-2xl font-bold">Score: {memoryScore}</div>
                </div>

                {/* Game Board */}
                <div className="p-6">
                    <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                        {memoryCards.map((card, index) => (
                            <button
                                key={index}
                                onClick={() => handleCardClick(index)}
                                className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all duration-300 ${flippedCards.includes(index) || matchedCards.includes(index)
                                        ? 'bg-white/20 scale-105'
                                        : 'bg-white/10 hover:bg-white/15'
                                    }`}
                            >
                                {flippedCards.includes(index) || matchedCards.includes(index) ? card : '❓'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Main Games Menu
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/home" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">STEM Games</h1>
                <div className="w-8"></div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="text-center mb-8">
                    <div className="text-8xl mb-4">🎮</div>
                    <h2 className="text-3xl font-bold mb-2">Educational Games</h2>
                    <p className="text-gray-300">Learn while you play with these fun STEM games!</p>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {games.map((game) => (
                        <button
                            key={game.id}
                            onClick={() => startGame(game)}
                            className={`bg-gradient-to-br ${game.gradient} p-6 rounded-2xl text-left hover:scale-105 transition-transform duration-200`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-5xl">{game.icon}</div>
                                <div className="text-right">
                                    <div className="text-xs bg-white/20 px-2 py-1 rounded-full mb-1 capitalize">
                                        {game.category}
                                    </div>
                                    <div className="text-xs bg-white/20 px-2 py-1 rounded-full capitalize">
                                        {game.difficulty}
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                            <p className="text-gray-200 text-sm">{game.description}</p>
                        </button>
                    ))}
                </div>

                {/* Coming Soon */}
                <div className="mt-8 text-center">
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6">
                        <h3 className="text-xl font-bold mb-2">More Games Coming Soon!</h3>
                        <p className="text-gray-300">
                            We're working on more exciting STEM games including physics simulations,
                            chemistry experiments, and engineering challenges.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
