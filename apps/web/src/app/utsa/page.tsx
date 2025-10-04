'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Program {
    id: string;
    name: string;
    department: string;
    description: string;
    level: 'undergraduate' | 'graduate' | 'certificate';
    icon: string;
}

interface NewsItem {
    id: string;
    title: string;
    summary: string;
    date: string;
    category: string;
}

const stemPrograms: Program[] = [
    {
        id: 'computer-science',
        name: 'Computer Science',
        department: 'College of Engineering and Integrated Design',
        description: 'Learn programming, algorithms, software engineering, and cutting-edge computing technologies.',
        level: 'undergraduate',
        icon: '💻'
    },
    {
        id: 'engineering',
        name: 'Engineering',
        department: 'College of Engineering and Integrated Design',
        description: 'Multiple engineering disciplines including mechanical, electrical, civil, and biomedical.',
        level: 'undergraduate',
        icon: '⚙️'
    },
    {
        id: 'mathematics',
        name: 'Mathematics',
        department: 'College of Sciences',
        description: 'Pure and applied mathematics, statistics, and mathematical modeling.',
        level: 'undergraduate',
        icon: '📐'
    },
    {
        id: 'physics',
        name: 'Physics',
        department: 'College of Sciences',
        description: 'Explore the fundamental laws of nature from quantum mechanics to astrophysics.',
        level: 'undergraduate',
        icon: '⚛️'
    },
    {
        id: 'chemistry',
        name: 'Chemistry',
        department: 'College of Sciences',
        description: 'Study matter, its properties, composition, and the changes it undergoes.',
        level: 'undergraduate',
        icon: '🧪'
    },
    {
        id: 'biology',
        name: 'Biology',
        department: 'College of Sciences',
        description: 'Life sciences including molecular biology, ecology, and biotechnology.',
        level: 'undergraduate',
        icon: '🧬'
    }
];

const newsItems: NewsItem[] = [
    {
        id: 'news1',
        title: 'UTSA Engineering Students Win National Competition',
        summary: 'Team Roadrunner takes first place in the National Engineering Design Challenge.',
        date: '2025-09-15',
        category: 'Engineering'
    },
    {
        id: 'news2',
        title: 'New AI Research Lab Opens at UTSA',
        summary: 'State-of-the-art facility will focus on machine learning and robotics research.',
        date: '2025-09-10',
        category: 'Computer Science'
    },
    {
        id: 'news3',
        title: 'UTSA Partners with NASA for Space Research',
        summary: 'Collaborative program will study Mars geology and potential for life.',
        date: '2025-09-05',
        category: 'Physics'
    }
];

export default function UTSAPage() {
    const [activeTab, setActiveTab] = useState<'programs' | 'news' | 'connect'>('programs');
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

    if (selectedProgram) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-900 via-blue-900 to-indigo-900 text-white">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                    <button
                        onClick={() => setSelectedProgram(null)}
                        className="text-2xl p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        ←
                    </button>
                    <h1 className="text-lg font-semibold">Program Details</h1>
                    <div className="w-8"></div>
                </div>

                {/* Program Details */}
                <div className="p-6">
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 text-center mb-6">
                        <div className="text-6xl mb-4">{selectedProgram.icon}</div>
                        <h2 className="text-3xl font-bold mb-2">{selectedProgram.name}</h2>
                        <div className="inline-block bg-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-4 capitalize">
                            {selectedProgram.level}
                        </div>
                        <p className="text-gray-300 text-lg">{selectedProgram.department}</p>
                    </div>

                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                        <h3 className="text-xl font-bold mb-3">Program Description</h3>
                        <p className="text-gray-200 leading-relaxed">{selectedProgram.description}</p>
                    </div>

                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6">
                        <h3 className="text-xl font-bold mb-4">Next Steps</h3>
                        <div className="space-y-3">
                            <button className="w-full bg-orange-600 hover:bg-orange-700 p-4 rounded-xl text-left transition-colors">
                                <div className="font-semibold">📚 Learn More</div>
                                <div className="text-sm text-orange-200">Visit UTSA website for detailed information</div>
                            </button>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-xl text-left transition-colors">
                                <div className="font-semibold">📝 Apply Now</div>
                                <div className="text-sm text-blue-200">Start your application to UTSA</div>
                            </button>
                            <button className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-xl text-left transition-colors">
                                <div className="font-semibold">🎓 Campus Tour</div>
                                <div className="text-sm text-green-200">Schedule a visit to see the campus</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-900 via-blue-900 to-indigo-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/home" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">UTSA Connection</h1>
                <div className="w-8"></div>
            </div>

            {/* UTSA Logo and Branding */}
            <div className="p-6 text-center">
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
                    <div className="text-6xl mb-4">🏫</div>
                    <h2 className="text-3xl font-bold mb-2">University of Texas at San Antonio</h2>
                    <p className="text-gray-300">Connecting SAMSAT visitors to higher education opportunities</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-6 mb-6">
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-1 flex">
                    <button
                        onClick={() => setActiveTab('programs')}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${activeTab === 'programs'
                                ? 'bg-orange-600 text-white'
                                : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        Programs
                    </button>
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${activeTab === 'news'
                                ? 'bg-orange-600 text-white'
                                : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        News
                    </button>
                    <button
                        onClick={() => setActiveTab('connect')}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${activeTab === 'connect'
                                ? 'bg-orange-600 text-white'
                                : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        Connect
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 px-6">
                {activeTab === 'programs' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-4">STEM Programs</h3>
                        {stemPrograms.map((program) => (
                            <button
                                key={program.id}
                                onClick={() => setSelectedProgram(program)}
                                className="w-full bg-black/20 backdrop-blur-sm rounded-xl p-4 hover:bg-black/30 transition-colors text-left"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="text-3xl">{program.icon}</div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{program.name}</h4>
                                        <p className="text-gray-300 text-sm">{program.department}</p>
                                        <span className="inline-block bg-orange-600 px-2 py-1 rounded text-xs font-medium mt-1 capitalize">
                                            {program.level}
                                        </span>
                                    </div>
                                    <div className="text-xl">▶️</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'news' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-4">UTSA STEM News</h3>
                        {newsItems.map((news) => (
                            <div
                                key={news.id}
                                className="bg-black/20 backdrop-blur-sm rounded-xl p-4"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className="bg-blue-600 px-2 py-1 rounded text-xs font-medium">
                                        {news.category}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(news.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="font-bold text-lg mb-2">{news.title}</h4>
                                <p className="text-gray-300 text-sm">{news.summary}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'connect' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-4">Connect with UTSA</h3>

                        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                            <h4 className="font-bold text-lg mb-4">Get Started</h4>
                            <div className="space-y-3">
                                <button className="w-full bg-orange-600 hover:bg-orange-700 p-4 rounded-xl text-left transition-colors">
                                    <div className="font-semibold">🌐 Visit UTSA.edu</div>
                                    <div className="text-sm text-orange-200">Explore programs and campus life</div>
                                </button>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-xl text-left transition-colors">
                                    <div className="font-semibold">📞 Contact Admissions</div>
                                    <div className="text-sm text-blue-200">(210) 458-4011</div>
                                </button>
                                <button className="w-full bg-green-600 hover:bg-green-700 p-4 rounded-xl text-left transition-colors">
                                    <div className="font-semibold">📍 Campus Location</div>
                                    <div className="text-sm text-green-200">One UTSA Circle, San Antonio, TX</div>
                                </button>
                            </div>
                        </div>

                        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                            <h4 className="font-bold text-lg mb-4">Quick Facts</h4>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-orange-400">34,000+</div>
                                    <div className="text-sm text-gray-300">Students</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-400">170+</div>
                                    <div className="text-sm text-gray-300">Degree Programs</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-400">1969</div>
                                    <div className="text-sm text-gray-300">Founded</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-purple-400">Top 400</div>
                                    <div className="text-sm text-gray-300">Global Ranking</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                            <h4 className="font-bold text-lg mb-4">Why Choose UTSA?</h4>
                            <ul className="space-y-2 text-gray-200">
                                <li className="flex items-center space-x-2">
                                    <span className="text-green-400">✓</span>
                                    <span>Tier One research university</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="text-green-400">✓</span>
                                    <span>Strong STEM programs and research opportunities</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="text-green-400">✓</span>
                                    <span>Located in vibrant San Antonio</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="text-green-400">✓</span>
                                    <span>Diverse and inclusive community</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="text-green-400">✓</span>
                                    <span>Affordable tuition and financial aid</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom CTA */}
            <div className="p-6">
                <div className="bg-gradient-to-r from-orange-600 to-blue-600 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold mb-2">Ready to be a Roadrunner?</h3>
                    <p className="text-gray-200 mb-4">Start your STEM journey at UTSA today!</p>
                    <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
}
