'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type CalculatorMode = 'basic' | 'scientific' | 'converter';

interface ConversionUnit {
    name: string;
    symbol: string;
    factor: number; // conversion factor to base unit
}

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

export default function CalculatorPage() {
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [operation, setOperation] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [mode, setMode] = useState<CalculatorMode>('basic');
    const [memory, setMemory] = useState(0);
    const [history, setHistory] = useState<string[]>([]);

    // Unit converter state
    const [conversionType, setConversionType] = useState<keyof typeof conversions>('length');
    const [fromUnit, setFromUnit] = useState(0);
    const [toUnit, setToUnit] = useState(1);
    const [conversionValue, setConversionValue] = useState('1');

    const inputNumber = (num: string) => {
        if (waitingForOperand) {
            setDisplay(num);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? num : display + num);
        }
    };

    const inputDecimal = () => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
        } else if (display.indexOf('.') === -1) {
            setDisplay(display + '.');
        }
    };

    const clear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(false);
    };

    const performOperation = (nextOperation: string) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operation) {
            const currentValue = previousValue || 0;
            const newValue = calculate(currentValue, inputValue, operation);

            setDisplay(String(newValue));
            setPreviousValue(newValue);

            // Add to history
            const historyEntry = `${currentValue} ${operation} ${inputValue} = ${newValue}`;
            setHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
        }

        setWaitingForOperand(true);
        setOperation(nextOperation);
    };

    const calculate = (firstValue: number, secondValue: number, operation: string): number => {
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

    const performScientificOperation = (func: string) => {
        const inputValue = parseFloat(display);
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

        setDisplay(String(result));
        setWaitingForOperand(true);

        const historyEntry = `${func}(${inputValue}) = ${result}`;
        setHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
    };

    const memoryStore = () => {
        setMemory(parseFloat(display));
    };

    const memoryRecall = () => {
        setDisplay(String(memory));
        setWaitingForOperand(true);
    };

    const memoryClear = () => {
        setMemory(0);
    };

    const memoryAdd = () => {
        setMemory(memory + parseFloat(display));
    };

    // Unit conversion functions
    const convertUnits = (value: number, fromIdx: number, toIdx: number, type: keyof typeof conversions): number => {
        if (type === 'temperature') {
            // Special handling for temperature
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
            // Standard unit conversion
            const fromFactor = conversions[type].units[fromIdx].factor;
            const toFactor = conversions[type].units[toIdx].factor;
            return (value * fromFactor) / toFactor;
        }
    };

    const handleConversionValueChange = (value: string) => {
        setConversionValue(value);
    };

    const convertedValue = conversionValue ?
        convertUnits(parseFloat(conversionValue) || 0, fromUnit, toUnit, conversionType) : 0;

    const renderBasicCalculator = () => (
        <div className="grid grid-cols-4 gap-3 p-4">
            {/* Row 1 */}
            <button onClick={clear} className="col-span-2 bg-red-600 hover:bg-red-700 p-4 rounded-xl text-lg font-semibold transition-colors">
                Clear
            </button>
            <button onClick={memoryClear} className="bg-purple-600 hover:bg-purple-700 p-4 rounded-xl text-sm font-semibold transition-colors">
                MC
            </button>
            <button onClick={() => performOperation('÷')} className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl text-xl font-semibold transition-colors">
                ÷
            </button>

            {/* Row 2 */}
            <button onClick={() => inputNumber('7')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors">
                7
            </button>
            <button onClick={() => inputNumber('8')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors">
                8
            </button>
            <button onClick={() => inputNumber('9')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors">
                9
            </button>
            <button onClick={() => performOperation('×')} className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl text-xl font-semibold transition-colors">
                ×
            </button>

            {/* Row 3 */}
            <button onClick={() => inputNumber('4')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors">
                4
            </button>
            <button onClick={() => inputNumber('5')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors">
                5
            </button>
            <button onClick={() => inputNumber('6')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors">
                6
            </button>
            <button onClick={() => performOperation('-')} className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl text-xl font-semibold transition-colors">
                -
            </button>

            {/* Row 4 */}
            <button onClick={() => inputNumber('1')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors">
                1
            </button>
            <button onClick={() => inputNumber('2')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors">
                2
            </button>
            <button onClick={() => inputNumber('3')} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors">
                3
            </button>
            <button onClick={() => performOperation('+')} className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl text-xl font-semibold transition-colors">
                +
            </button>

            {/* Row 5 */}
            <button onClick={() => inputNumber('0')} className="col-span-2 bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors">
                0
            </button>
            <button onClick={inputDecimal} className="bg-gray-700 hover:bg-gray-600 p-4 rounded-xl text-xl font-semibold transition-colors">
                .
            </button>
            <button onClick={() => performOperation('=')} className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl text-xl font-semibold transition-colors">
                =
            </button>
        </div>
    );

    const renderScientificCalculator = () => (
        <div className="p-4 space-y-3">
            {/* Scientific Functions Row 1 */}
            <div className="grid grid-cols-5 gap-2">
                <button onClick={() => performScientificOperation('sin')} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-sm font-semibold transition-colors">
                    sin
                </button>
                <button onClick={() => performScientificOperation('cos')} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-sm font-semibold transition-colors">
                    cos
                </button>
                <button onClick={() => performScientificOperation('tan')} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-sm font-semibold transition-colors">
                    tan
                </button>
                <button onClick={() => performScientificOperation('log')} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-sm font-semibold transition-colors">
                    log
                </button>
                <button onClick={() => performScientificOperation('ln')} className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-sm font-semibold transition-colors">
                    ln
                </button>
            </div>

            {/* Scientific Functions Row 2 */}
            <div className="grid grid-cols-5 gap-2">
                <button onClick={() => performScientificOperation('sqrt')} className="bg-green-600 hover:bg-green-700 p-3 rounded-lg text-sm font-semibold transition-colors">
                    √
                </button>
                <button onClick={() => performScientificOperation('x²')} className="bg-green-600 hover:bg-green-700 p-3 rounded-lg text-sm font-semibold transition-colors">
                    x²
                </button>
                <button onClick={() => performOperation('^')} className="bg-green-600 hover:bg-green-700 p-3 rounded-lg text-sm font-semibold transition-colors">
                    x^y
                </button>
                <button onClick={() => performScientificOperation('1/x')} className="bg-green-600 hover:bg-green-700 p-3 rounded-lg text-sm font-semibold transition-colors">
                    1/x
                </button>
                <button onClick={() => performScientificOperation('π')} className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-sm font-semibold transition-colors">
                    π
                </button>
            </div>

            {/* Memory Functions */}
            <div className="grid grid-cols-4 gap-2">
                <button onClick={memoryStore} className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg text-sm font-semibold transition-colors">
                    MS
                </button>
                <button onClick={memoryRecall} className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg text-sm font-semibold transition-colors">
                    MR
                </button>
                <button onClick={memoryAdd} className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg text-sm font-semibold transition-colors">
                    M+
                </button>
                <button onClick={memoryClear} className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg text-sm font-semibold transition-colors">
                    MC
                </button>
            </div>

            {/* Basic Calculator Grid */}
            {renderBasicCalculator()}
        </div>
    );

    const renderUnitConverter = () => (
        <div className="p-4 space-y-6">
            {/* Conversion Type Selector */}
            <div className="grid grid-cols-3 gap-2">
                {Object.entries(conversions).map(([key, conv]) => (
                    <button
                        key={key}
                        onClick={() => setConversionType(key as keyof typeof conversions)}
                        className={`p-3 rounded-lg font-semibold transition-colors ${conversionType === key
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            }`}
                    >
                        {conv.name}
                    </button>
                ))}
            </div>

            {/* Input Value */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Value to Convert</label>
                <input
                    type="number"
                    value={conversionValue}
                    onChange={(e) => handleConversionValueChange(e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-lg"
                    placeholder="Enter value"
                />
            </div>

            {/* From Unit */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">From</label>
                <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(parseInt(e.target.value))}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                >
                    {conversions[conversionType].units.map((unit, index) => (
                        <option key={index} value={index}>
                            {unit.name} ({unit.symbol})
                        </option>
                    ))}
                </select>
            </div>

            {/* To Unit */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
                <select
                    value={toUnit}
                    onChange={(e) => setToUnit(parseInt(e.target.value))}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                >
                    {conversions[conversionType].units.map((unit, index) => (
                        <option key={index} value={index}>
                            {unit.name} ({unit.symbol})
                        </option>
                    ))}
                </select>
            </div>

            {/* Result */}
            <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Result</div>
                <div className="text-2xl font-bold text-green-400">
                    {convertedValue.toFixed(6).replace(/\.?0+$/, '')} {conversions[conversionType].units[toUnit].symbol}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
                <Link href="/home" className="text-2xl">←</Link>
                <h1 className="text-xl font-semibold">Calculator</h1>
                <div className="w-8"></div>
            </div>

            {/* Mode Selector */}
            <div className="p-4">
                <div className="grid grid-cols-3 gap-2 bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setMode('basic')}
                        className={`p-2 rounded-md font-semibold transition-colors ${mode === 'basic' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Basic
                    </button>
                    <button
                        onClick={() => setMode('scientific')}
                        className={`p-2 rounded-md font-semibold transition-colors ${mode === 'scientific' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Scientific
                    </button>
                    <button
                        onClick={() => setMode('converter')}
                        className={`p-2 rounded-md font-semibold transition-colors ${mode === 'converter' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Converter
                    </button>
                </div>
            </div>

            {/* Display */}
            {mode !== 'converter' && (
                <div className="p-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 mb-4">
                        <div className="text-right">
                            <div className="text-4xl font-mono font-bold mb-2 break-all">
                                {display}
                            </div>
                            {operation && previousValue !== null && (
                                <div className="text-gray-400 text-lg">
                                    {previousValue} {operation}
                                </div>
                            )}
                            {memory !== 0 && (
                                <div className="text-blue-400 text-sm">
                                    Memory: {memory}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Calculator Interface */}
            <div className="flex-1">
                {mode === 'basic' && renderBasicCalculator()}
                {mode === 'scientific' && renderScientificCalculator()}
                {mode === 'converter' && renderUnitConverter()}
            </div>

            {/* History (for basic and scientific modes) */}
            {mode !== 'converter' && history.length > 0 && (
                <div className="p-4 bg-black/20 backdrop-blur-sm">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">History</h3>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                        {history.slice(0, 3).map((entry, index) => (
                            <div key={index} className="text-xs text-gray-300 font-mono">
                                {entry}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
