'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    funFact?: string;
}

interface QuizCategory {
    id: string;
    name: string;
    icon: string;
    description: string;
    gradient: string;
    questions: QuizQuestion[];
}

const quizCategories: QuizCategory[] = [
    {
        id: 'space',
        name: 'Space & Astronomy',
        icon: '🚀',
        description: 'Explore the cosmos and learn about space',
        gradient: 'from-indigo-600 to-purple-600',
        questions: [
            {
                id: 'space1',
                question: 'Which planet is known as the "Red Planet"?',
                options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
                correct: 1,
                explanation: 'Mars appears red due to iron oxide (rust) on its surface.',
                category: 'space',
                difficulty: 'easy',
                funFact: 'A day on Mars is about 24 hours and 37 minutes - very similar to Earth!'
            },
            {
                id: 'space2',
                question: 'What is the closest star to Earth?',
                options: ['Alpha Centauri', 'Sirius', 'The Sun', 'Polaris'],
                correct: 2,
                explanation: 'The Sun is our closest star, about 93 million miles away.',
                category: 'space',
                difficulty: 'easy',
                funFact: 'Light from the Sun takes about 8 minutes and 20 seconds to reach Earth!'
            },
            {
                id: 'space3',
                question: 'How many moons does Jupiter have?',
                options: ['12', '27', '79', '95'],
                correct: 3,
                explanation: 'Jupiter has 95 confirmed moons, with the four largest discovered by Galileo.',
                category: 'space',
                difficulty: 'hard',
                funFact: 'Jupiter\'s moon Europa may have twice as much water as all Earth\'s oceans!'
            }
        ]
    },
    {
        id: 'physics',
        name: 'Physics',
        icon: '⚛️',
        description: 'Discover the laws that govern our universe',
        gradient: 'from-blue-600 to-cyan-600',
        questions: [
            {
                id: 'physics1',
                question: 'What is the speed of light in a vacuum?',
                options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '200,000 km/s'],
                correct: 0,
                explanation: 'Light travels at approximately 299,792,458 meters per second in a vacuum.',
                category: 'physics',
                difficulty: 'medium',
                funFact: 'Nothing with mass can travel faster than the speed of light!'
            },
            {
                id: 'physics2',
                question: 'What force keeps planets in orbit around the Sun?',
                options: ['Magnetism', 'Gravity', 'Centrifugal force', 'Nuclear force'],
                correct: 1,
                explanation: 'Gravity is the attractive force between masses that keeps planets orbiting the Sun.',
                category: 'physics',
                difficulty: 'easy',
                funFact: 'Gravity also causes time to run slightly slower - this is called time dilation!'
            }
        ]
    },
    {
        id: 'chemistry',
        name: 'Chemistry',
        icon: '🧪',
        description: 'Explore the building blocks of matter',
        gradient: 'from-green-600 to-teal-600',
        questions: [
            {
                id: 'chem1',
                question: 'What is the chemical symbol for gold?',
                options: ['Go', 'Gd', 'Au', 'Ag'],
                correct: 2,
                explanation: 'Au comes from the Latin word "aurum" meaning gold.',
                category: 'chemistry',
                difficulty: 'medium',
                funFact: 'Gold is so unreactive that it can last thousands of years without tarnishing!'
            },
            {
                id: 'chem2',
                question: 'How many protons does a carbon atom have?',
                options: ['4', '6', '8', '12'],
                correct: 1,
                explanation: 'Carbon has 6 protons, which defines it as element number 6 on the periodic table.',
                category: 'chemistry',
                difficulty: 'easy',
                funFact: 'Carbon can form more compounds than any other element - over 10 million known!'
            }
        ]
    },
    {
        id: 'biology',
        name: 'Biology',
        icon: '🧬',
        description: 'Learn about life and living organisms',
        gradient: 'from-emerald-600 to-green-600',
        questions: [
            {
                id: 'bio1',
                question: 'What is DNA short for?',
                options: ['Deoxyribonucleic Acid', 'Dynamic Nuclear Acid', 'Dual Nucleic Acid', 'Deoxyribose Nucleotide Acid'],
                correct: 0,
                explanation: 'DNA stands for Deoxyribonucleic Acid, the molecule that carries genetic information.',
                category: 'biology',
                difficulty: 'medium',
                funFact: 'If you unraveled all the DNA in your body, it would stretch about 10 billion miles!'
            },
            {
                id: 'bio2',
                question: 'How many bones are in an adult human body?',
                options: ['195', '206', '220', '185'],
                correct: 1,
                explanation: 'Adults have 206 bones. Babies are born with about 270, but many fuse as they grow.',
                category: 'biology',
                difficulty: 'easy',
                funFact: 'Your thigh bone (femur) is stronger than concrete!'
            }
        ]
    }
];

export default function QuizPage() {
    const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (startTime && !isComplete) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [startTime, isComplete]);

    const startQuiz = (category: QuizCategory) => {
        setSelectedCategory(category);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
        setIsComplete(false);
        setStartTime(new Date());
        setElapsedTime(0);
        setStreak(0);
    };

    const handleAnswerSelect = (answerIndex: number) => {
        if (selectedAnswer !== null || !selectedCategory) return;

        setSelectedAnswer(answerIndex);
        const currentQuestion = selectedCategory.questions[currentQuestionIndex];
        const isCorrect = answerIndex === currentQuestion.correct;

        if (isCorrect) {
            setScore(score + 1);
            setStreak(streak + 1);
            if (streak + 1 > bestStreak) {
                setBestStreak(streak + 1);
            }
        } else {
            setStreak(0);
        }

        setShowExplanation(true);

        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(isCorrect ? [50] : [200]);
        }

        setTimeout(() => {
            if (currentQuestionIndex < selectedCategory.questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(null);
                setShowExplanation(false);
            } else {
                setIsComplete(true);
            }
        }, 3000);
    };

    const resetQuiz = () => {
        if (selectedCategory) {
            startQuiz(selectedCategory);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Quiz completion screen
    if (isComplete && selectedCategory) {
        const percentage = Math.round((score / selectedCategory.questions.length) * 100);

        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-900 via-yellow-900 to-amber-900 text-white flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="text-8xl mb-6">
                        {percentage === 100 ? '🏆' : percentage >= 80 ? '🥇' : percentage >= 60 ? '🥈' : '🥉'}
                    </div>
                    <h2 className="text-4xl font-bold mb-4">Quiz Complete!</h2>

                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                        <div className="text-6xl font-bold mb-2 text-yellow-400">{score}/{selectedCategory.questions.length}</div>
                        <div className="text-2xl mb-2">{percentage}% Correct</div>
                        <div className="text-lg mb-2">Time: {formatTime(elapsedTime)}</div>
                        <div className="text-lg">Best Streak: {bestStreak}</div>
                    </div>

                    <p className="text-xl mb-8">
                        {percentage === 100 ? 'Perfect Score! You\'re a STEM genius!' :
                            percentage >= 80 ? 'Excellent work! Great STEM knowledge!' :
                                percentage >= 60 ? 'Good job! Keep learning!' : 'Keep exploring STEM - you\'re improving!'}
                    </p>

                    <div className="space-x-4">
                        <button
                            onClick={resetQuiz}
                            className="bg-yellow-600 hover:bg-yellow-700 px-8 py-3 rounded-full font-semibold transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-full font-semibold transition-colors"
                        >
                            Choose Category
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz question screen
    if (selectedCategory && !isComplete) {
        const currentQuestion = selectedCategory.questions[currentQuestionIndex];

        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-900 via-yellow-900 to-amber-900 text-white">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className="text-2xl p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        ←
                    </button>
                    <h1 className="text-lg font-semibold">{selectedCategory.name}</h1>
                    <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                        {currentQuestionIndex + 1}/{selectedCategory.questions.length}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="px-4 pb-4">
                    <div className="w-full bg-black/20 rounded-full h-2">
                        <div
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / selectedCategory.questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Game Stats */}
                <div className="flex justify-center space-x-6 p-4 text-center">
                    <div>
                        <div className="text-xl font-bold">{score}/{selectedCategory.questions.length}</div>
                        <div className="text-xs text-gray-300">Score</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold">{streak}</div>
                        <div className="text-xs text-gray-300">Streak</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold">{formatTime(elapsedTime)}</div>
                        <div className="text-xs text-gray-300">Time</div>
                    </div>
                </div>

                {/* Question */}
                <div className="flex-1 p-6">
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6">
                        {/* Difficulty Badge */}
                        <div className="flex justify-center mb-4">
                            <span className={`
                                px-3 py-1 rounded-full text-sm font-medium capitalize
                                ${currentQuestion.difficulty === 'easy' ? 'bg-green-600' :
                                    currentQuestion.difficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'}
                            `}>
                                {currentQuestion.difficulty}
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold mb-6 text-center leading-relaxed">
                            {currentQuestion.question}
                        </h2>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={selectedAnswer !== null}
                                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${selectedAnswer === null
                                            ? 'bg-white/10 hover:bg-white/20 hover:scale-102'
                                            : selectedAnswer === index
                                                ? index === currentQuestion.correct
                                                    ? 'bg-green-600 scale-102'
                                                    : 'bg-red-600 scale-102'
                                                : index === currentQuestion.correct
                                                    ? 'bg-green-600 scale-102'
                                                    : 'bg-white/10 opacity-50'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <span className="font-bold mr-3 text-lg">
                                            {String.fromCharCode(65 + index)}.
                                        </span>
                                        <span className="text-lg">{option}</span>
                                        {selectedAnswer !== null && index === currentQuestion.correct && (
                                            <span className="ml-auto text-2xl">✅</span>
                                        )}
                                        {selectedAnswer === index && index !== currentQuestion.correct && (
                                            <span className="ml-auto text-2xl">❌</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {showExplanation && (
                            <div className="mt-6 space-y-4">
                                <div className="p-4 bg-blue-900/50 rounded-xl">
                                    <h3 className="font-bold mb-2 text-blue-200">💡 Explanation:</h3>
                                    <p className="text-blue-100">{currentQuestion.explanation}</p>
                                </div>

                                {currentQuestion.funFact && (
                                    <div className="p-4 bg-purple-900/50 rounded-xl">
                                        <h3 className="font-bold mb-2 text-purple-200">🌟 Fun Fact:</h3>
                                        <p className="text-purple-100">{currentQuestion.funFact}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Category selection screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-900 via-yellow-900 to-amber-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/home" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">STEM Quiz</h1>
                <div className="w-8"></div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="text-center mb-8">
                    <div className="text-8xl mb-4">❓</div>
                    <h2 className="text-3xl font-bold mb-2">STEM Knowledge Quiz</h2>
                    <p className="text-gray-300">Test your science, technology, engineering & math knowledge!</p>
                </div>

                {/* Category Selection */}
                <div className="space-y-4">
                    {quizCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => startQuiz(category)}
                            className={`w-full bg-gradient-to-r ${category.gradient} p-6 rounded-2xl hover:scale-105 transition-transform duration-200`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="text-5xl">{category.icon}</div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                                    <p className="text-gray-200 mb-2">{category.description}</p>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <span>{category.questions.length} questions</span>
                                        <span>•</span>
                                        <span>Mixed difficulty</span>
                                    </div>
                                </div>
                                <div className="text-3xl">▶️</div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Quiz Stats */}
                <div className="mt-8 bg-black/20 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="font-semibold mb-3 text-center">Your Best Streaks</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-yellow-400">{bestStreak}</div>
                            <div className="text-sm text-gray-300">Best Streak</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-400">
                                {quizCategories.reduce((total, cat) => total + cat.questions.length, 0)}
                            </div>
                            <div className="text-sm text-gray-300">Total Questions</div>
                        </div>
                    </div>
                </div>

                {/* Educational Note */}
                <div className="mt-6 bg-blue-900/30 rounded-xl p-4 border border-blue-600/30">
                    <p className="text-sm text-blue-200">
                        <strong>🎓 Learning Tip:</strong> Each question includes detailed explanations and fun facts
                        to help you learn. Take your time and explore the fascinating world of STEM!
                    </p>
                </div>
            </div>
        </div>
    );
}
