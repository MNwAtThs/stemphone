'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SearchResult {
    id: string;
    title: string;
    description: string;
    url: string;
    category: 'education' | 'science' | 'technology' | 'museum';
    icon: string;
}

const educationalSites: SearchResult[] = [
    {
        id: 'nasa',
        title: 'NASA - National Aeronautics and Space Administration',
        description: 'Explore space missions, educational resources, and the latest discoveries in space exploration.',
        url: 'https://www.nasa.gov',
        category: 'science',
        icon: '🚀'
    },
    {
        id: 'khan-academy',
        title: 'Khan Academy',
        description: 'Free online courses, lessons and practice in math, science, computing, and more.',
        url: 'https://www.khanacademy.org',
        category: 'education',
        icon: '📚'
    },
    {
        id: 'smithsonian',
        title: 'Smithsonian Institution',
        description: 'Museums, research centers, and educational programs covering science, history, and culture.',
        url: 'https://www.si.edu',
        category: 'museum',
        icon: '🏛️'
    },
    {
        id: 'mit-opencourseware',
        title: 'MIT OpenCourseWare',
        description: 'Free lecture notes, exams, and videos from MIT courses in science and engineering.',
        url: 'https://ocw.mit.edu',
        category: 'education',
        icon: '🎓'
    },
    {
        id: 'national-geographic',
        title: 'National Geographic Kids',
        description: 'Educational content about animals, science, geography, and the natural world.',
        url: 'https://kids.nationalgeographic.com',
        category: 'science',
        icon: '🌍'
    },
    {
        id: 'scratch',
        title: 'Scratch Programming',
        description: 'Learn to code by creating interactive stories, games, and animations.',
        url: 'https://scratch.mit.edu',
        category: 'technology',
        icon: '💻'
    },
    {
        id: 'utsa',
        title: 'UTSA - University of Texas at San Antonio',
        description: 'Explore STEM programs and opportunities at our local university partner.',
        url: 'https://www.utsa.edu',
        category: 'education',
        icon: '🏫'
    },
    {
        id: 'samsat',
        title: 'SAMSAT - San Antonio Museum of Science and Technology',
        description: 'Learn more about our museum, exhibits, and educational programs.',
        url: 'https://samsat.org',
        category: 'museum',
        icon: '🔬'
    }
];

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const categories = [
        { id: 'all', name: 'All', icon: '🔍' },
        { id: 'education', name: 'Education', icon: '📚' },
        { id: 'science', name: 'Science', icon: '🔬' },
        { id: 'technology', name: 'Technology', icon: '💻' },
        { id: 'museum', name: 'Museums', icon: '🏛️' }
    ];

    const performSearch = (query: string) => {
        setIsSearching(true);

        // Simulate search delay
        setTimeout(() => {
            let results = educationalSites;

            // Filter by category
            if (selectedCategory !== 'all') {
                results = results.filter(site => site.category === selectedCategory);
            }

            // Filter by search term
            if (query.trim()) {
                const lowercaseQuery = query.toLowerCase();
                results = results.filter(site =>
                    site.title.toLowerCase().includes(lowercaseQuery) ||
                    site.description.toLowerCase().includes(lowercaseQuery)
                );
            }

            setSearchResults(results);
            setIsSearching(false);
        }, 500);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        performSearch(value);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        performSearch(searchTerm);
    };

    const openLink = (url: string) => {
        // In a real app, this would open the URL
        // For the kiosk, we might want to show a preview or redirect safely
        alert(`This would open: ${url}\n\nIn a real deployment, this would safely navigate to the educational resource.`);
    };

    const quickSearches = [
        'NASA space missions',
        'STEM careers',
        'Science experiments',
        'Math games',
        'Engineering projects',
        'UTSA programs'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-green-900 to-teal-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/home" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">Educational Search</h1>
                <div className="w-8"></div>
            </div>

            {/* Search Interface */}
            <div className="p-6">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-2xl font-bold mb-2">Discover STEM Resources</h2>
                    <p className="text-gray-300">Find educational websites and learning materials</p>
                </div>

                {/* Search Bar */}
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search for educational resources..."
                        className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white text-lg placeholder-gray-400"
                    />
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`
                                    flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors
                                    ${selectedCategory === category.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }
                                `}
                            >
                                <span>{category.icon}</span>
                                <span className="font-medium">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick Searches */}
                {!searchTerm && (
                    <div className="mb-6">
                        <h3 className="font-semibold mb-3">Quick Searches</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {quickSearches.map((search, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSearchChange(search)}
                                    className="bg-white/10 hover:bg-white/20 p-3 rounded-lg text-left transition-colors"
                                >
                                    <div className="text-sm font-medium">{search}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search Results */}
                <div className="space-y-4">
                    {isSearching ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4 animate-spin">🔍</div>
                            <p className="text-gray-300">Searching...</p>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <>
                            <h3 className="font-semibold">
                                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                            </h3>
                            {searchResults.map((result) => (
                                <button
                                    key={result.id}
                                    onClick={() => openLink(result.url)}
                                    className="w-full bg-black/20 backdrop-blur-sm rounded-xl p-4 hover:bg-black/30 transition-colors text-left"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="text-3xl flex-shrink-0">{result.icon}</div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg mb-1">{result.title}</h4>
                                            <p className="text-gray-300 text-sm mb-2">{result.description}</p>
                                            <div className="flex items-center space-x-2">
                                                <span className={`
                                                    px-2 py-1 rounded text-xs font-medium capitalize
                                                    ${result.category === 'education' ? 'bg-blue-600' :
                                                        result.category === 'science' ? 'bg-green-600' :
                                                            result.category === 'technology' ? 'bg-purple-600' : 'bg-orange-600'}
                                                `}>
                                                    {result.category}
                                                </span>
                                                <span className="text-xs text-gray-400">{result.url}</span>
                                            </div>
                                        </div>
                                        <div className="text-xl">🔗</div>
                                    </div>
                                </button>
                            ))}
                        </>
                    ) : searchTerm ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-4">🤔</div>
                            <p className="text-gray-300">No results found for &quot;{searchTerm}&quot;</p>
                            <p className="text-sm text-gray-400 mt-2">Try different keywords or browse categories</p>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Safety Notice */}
            <div className="p-4 m-4 bg-yellow-900/30 rounded-xl border border-yellow-600/30">
                <p className="text-sm text-yellow-200">
                    <strong>🔒 Safe Browsing:</strong> This search feature provides curated educational resources.
                    All links are pre-approved for museum use and lead to safe, educational content.
                </p>
            </div>
        </div>
    );
}
