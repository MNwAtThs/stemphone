'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Element {
    number: number;
    symbol: string;
    name: string;
    atomicMass: number;
    category: string;
    period: number;
    group: number;
    electronConfig: string;
    description: string;
    uses: string[];
    discoveredBy?: string;
    discoveredYear?: number;
}

const elements: Element[] = [
    {
        number: 1,
        symbol: 'H',
        name: 'Hydrogen',
        atomicMass: 1.008,
        category: 'nonmetal',
        period: 1,
        group: 1,
        electronConfig: '1s¹',
        description: 'The lightest and most abundant element in the universe. It makes up about 75% of all matter.',
        uses: ['Fuel cells', 'Rocket fuel', 'Chemical processing', 'Hydrogenation'],
        discoveredBy: 'Henry Cavendish',
        discoveredYear: 1766
    },
    {
        number: 2,
        symbol: 'He',
        name: 'Helium',
        atomicMass: 4.003,
        category: 'noble-gas',
        period: 1,
        group: 18,
        electronConfig: '1s²',
        description: 'A noble gas that is chemically inert and lighter than air. Second most abundant element in the universe.',
        uses: ['Balloons', 'Cooling systems', 'Breathing gas for divers', 'MRI machines'],
        discoveredBy: 'Pierre Janssen',
        discoveredYear: 1868
    },
    {
        number: 6,
        symbol: 'C',
        name: 'Carbon',
        atomicMass: 12.011,
        category: 'nonmetal',
        period: 2,
        group: 14,
        electronConfig: '[He] 2s² 2p²',
        description: 'The basis of all organic chemistry and life on Earth. Can form four bonds with other atoms.',
        uses: ['Diamonds', 'Graphite', 'Steel production', 'Organic compounds'],
        discoveredBy: 'Ancient civilizations',
        discoveredYear: -3750
    },
    {
        number: 8,
        symbol: 'O',
        name: 'Oxygen',
        atomicMass: 15.999,
        category: 'nonmetal',
        period: 2,
        group: 16,
        electronConfig: '[He] 2s² 2p⁴',
        description: 'Essential for respiration and combustion. Makes up about 21% of Earth\'s atmosphere.',
        uses: ['Breathing', 'Combustion', 'Steel production', 'Medical treatment'],
        discoveredBy: 'Carl Wilhelm Scheele',
        discoveredYear: 1772
    },
    {
        number: 26,
        symbol: 'Fe',
        name: 'Iron',
        atomicMass: 55.845,
        category: 'transition-metal',
        period: 4,
        group: 8,
        electronConfig: '[Ar] 3d⁶ 4s²',
        description: 'The most common element on Earth by mass. Essential for blood and steel production.',
        uses: ['Steel', 'Construction', 'Hemoglobin', 'Magnets'],
        discoveredBy: 'Ancient civilizations',
        discoveredYear: -5000
    },
    {
        number: 79,
        symbol: 'Au',
        name: 'Gold',
        atomicMass: 196.967,
        category: 'transition-metal',
        period: 6,
        group: 11,
        electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹',
        description: 'A precious metal that doesn\'t tarnish or corrode. Excellent conductor of electricity.',
        uses: ['Jewelry', 'Electronics', 'Currency', 'Medical devices'],
        discoveredBy: 'Ancient civilizations',
        discoveredYear: -2600
    },
    {
        number: 92,
        symbol: 'U',
        name: 'Uranium',
        atomicMass: 238.029,
        category: 'actinide',
        period: 7,
        group: 3,
        electronConfig: '[Rn] 5f³ 6d¹ 7s²',
        description: 'A radioactive element used in nuclear power and weapons. Naturally occurring but rare.',
        uses: ['Nuclear fuel', 'Nuclear weapons', 'Dating rocks', 'Medical isotopes'],
        discoveredBy: 'Martin Heinrich Klaproth',
        discoveredYear: 1789
    }
];

const categoryColors = {
    'nonmetal': 'bg-green-600',
    'noble-gas': 'bg-purple-600',
    'alkali-metal': 'bg-red-600',
    'alkaline-earth-metal': 'bg-orange-600',
    'transition-metal': 'bg-blue-600',
    'post-transition-metal': 'bg-indigo-600',
    'metalloid': 'bg-yellow-600',
    'halogen': 'bg-teal-600',
    'lanthanide': 'bg-pink-600',
    'actinide': 'bg-gray-600'
};

export default function PeriodicTablePage() {
    const [selectedElement, setSelectedElement] = useState<Element | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredElements = elements.filter(element => {
        const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            element.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            element.number.toString().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || element.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = Array.from(new Set(elements.map(e => e.category)));

    if (selectedElement) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                    <button
                        onClick={() => setSelectedElement(null)}
                        className="text-2xl p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        ←
                    </button>
                    <h1 className="text-xl font-semibold">Element Details</h1>
                    <div className="w-8"></div>
                </div>

                {/* Element Detail */}
                <div className="p-6">
                    {/* Element Card */}
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-6 text-center">
                        <div className={`w-32 h-32 mx-auto rounded-2xl ${categoryColors[selectedElement.category as keyof typeof categoryColors]} flex flex-col items-center justify-center mb-6`}>
                            <div className="text-sm text-gray-200">{selectedElement.number}</div>
                            <div className="text-4xl font-bold">{selectedElement.symbol}</div>
                            <div className="text-xs text-gray-200">{selectedElement.atomicMass}</div>
                        </div>
                        <h2 className="text-4xl font-bold mb-2">{selectedElement.name}</h2>
                        <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-4 capitalize">
                            {selectedElement.category.replace('-', ' ')}
                        </div>
                    </div>

                    {/* Properties */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="font-semibold text-gray-300 mb-2">Atomic Number</h3>
                            <p className="text-2xl font-bold">{selectedElement.number}</p>
                        </div>
                        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="font-semibold text-gray-300 mb-2">Atomic Mass</h3>
                            <p className="text-2xl font-bold">{selectedElement.atomicMass}</p>
                        </div>
                        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="font-semibold text-gray-300 mb-2">Period</h3>
                            <p className="text-2xl font-bold">{selectedElement.period}</p>
                        </div>
                        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="font-semibold text-gray-300 mb-2">Group</h3>
                            <p className="text-2xl font-bold">{selectedElement.group}</p>
                        </div>
                    </div>

                    {/* Electron Configuration */}
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-gray-300 mb-2">Electron Configuration</h3>
                        <p className="text-xl font-mono">{selectedElement.electronConfig}</p>
                    </div>

                    {/* Description */}
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-gray-300 mb-2">Description</h3>
                        <p className="text-gray-200 leading-relaxed">{selectedElement.description}</p>
                    </div>

                    {/* Uses */}
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-gray-300 mb-3">Common Uses</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {selectedElement.uses.map((use, index) => (
                                <div key={index} className="bg-white/10 px-3 py-2 rounded-lg text-sm">
                                    {use}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Discovery */}
                    {selectedElement.discoveredBy && (
                        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
                            <h3 className="font-semibold text-gray-300 mb-2">Discovery</h3>
                            <p className="text-gray-200">
                                Discovered by <strong>{selectedElement.discoveredBy}</strong> in{' '}
                                <strong>
                                    {selectedElement.discoveredYear && selectedElement.discoveredYear < 0
                                        ? `${Math.abs(selectedElement.discoveredYear)} BCE`
                                        : selectedElement.discoveredYear
                                    }
                                </strong>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/home" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">Periodic Table</h1>
                <div className="w-8"></div>
            </div>

            {/* Search and Filter */}
            <div className="p-4 space-y-4">
                <input
                    type="text"
                    placeholder="Search elements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400"
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl text-white"
                >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                        <option key={category} value={category} className="bg-gray-800">
                            {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                    ))}
                </select>
            </div>

            {/* Elements Grid */}
            <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredElements.map((element) => (
                        <button
                            key={element.number}
                            onClick={() => setSelectedElement(element)}
                            className={`${categoryColors[element.category as keyof typeof categoryColors]} p-4 rounded-2xl hover:scale-105 transition-transform duration-200 text-center`}
                        >
                            <div className="text-xs text-gray-200 mb-1">{element.number}</div>
                            <div className="text-3xl font-bold mb-1">{element.symbol}</div>
                            <div className="text-sm font-medium">{element.name}</div>
                            <div className="text-xs text-gray-200 mt-1">{element.atomicMass}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="p-4">
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="font-semibold mb-3">Element Categories</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(categoryColors).map(([category, color]) => (
                            <div key={category} className="flex items-center space-x-2">
                                <div className={`w-4 h-4 rounded ${color}`}></div>
                                <span className="capitalize">{category.replace('-', ' ')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Educational Note */}
            <div className="p-4 m-4 bg-blue-900/30 rounded-xl border border-blue-600/30">
                <p className="text-sm text-blue-200">
                    <strong>🧪 STEM Learning:</strong> The periodic table organizes all known chemical elements
                    by their atomic number and properties. Each element has unique characteristics that determine
                    how it behaves in chemical reactions!
                </p>
            </div>
        </div>
    );
}
