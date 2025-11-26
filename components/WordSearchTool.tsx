import React, { useState } from 'react';
import { WordSearchConfig } from '../types';
import { Printer, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { generateWordSearch } from '../utils/wordSearchGen';

const WordSearchTool: React.FC = () => {
    const [config, setConfig] = useState<WordSearchConfig>({ title: 'My Word Search', words: [] });
    const [inputText, setInputText] = useState('');
    const [grid, setGrid] = useState<string[][]>([]);
    const [placedWords, setPlacedWords] = useState<any[]>([]); // Metadata about placed words for highlighting
    const [error, setError] = useState<string | null>(null);
    const [showAnswers, setShowAnswers] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);

    const handleGenerate = () => {
        const wordList = inputText.split(/[\n,]+/).map(w => w.trim().toUpperCase()).filter(w => w.length > 1);
        
        if (wordList.length === 0) {
            setError('Please enter some words.');
            return;
        }

        const result = generateWordSearch(wordList, 15);
        if (result.placed.length < wordList.length) {
            setError(`Could not fit all words. Placed ${result.placed.length} of ${wordList.length}. Try fewer or shorter words.`);
        } else {
            setError(null);
        }

        setGrid(result.grid);
        setPlacedWords(result.placed);
        setConfig({ ...config, words: result.placed.map(p => p.word) });
        setIsGenerated(true);
    };

    const isCellInAnswer = (r: number, c: number) => {
        return placedWords.some(pw => {
            // Check if this cell is part of the word path
            // Very simple check: iterate path
            // Ideally we store the path in generated result
            return pw.path.some((p: {r: number, c: number}) => p.r === r && p.c === c);
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen pb-20">
            {/* Controls */}
            <div className="no-print bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 space-y-6">
                 <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Word Search Generator</h2>
                        <p className="text-slate-500">Auto-generate 15x15 puzzles with answer keys.</p>
                    </div>
                    <button onClick={() => window.print()} disabled={!isGenerated} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                        <Printer size={20} /> Print Puzzle
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Puzzle Title</label>
                            <input 
                                type="text" 
                                className="w-full p-2 border rounded-lg"
                                value={config.title}
                                onChange={(e) => setConfig({...config, title: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Word List (newline or comma separated)</label>
                            <textarea 
                                className="w-full h-40 p-2 border rounded-lg resize-none font-mono uppercase"
                                placeholder="TYPE
WORDS
HERE"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>
                        <button onClick={handleGenerate} className="w-full py-2 bg-bh-green text-white font-bold rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                            <RefreshCw size={20} /> Generate Puzzle
                        </button>
                        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                    </div>

                    {/* Preview */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col items-center">
                        <div className="flex justify-between w-full mb-2">
                            <h3 className="font-bold text-slate-500">Preview</h3>
                            {isGenerated && (
                                <button onClick={() => setShowAnswers(!showAnswers)} className="text-sm text-bh-navy flex items-center gap-1 hover:underline">
                                    {showAnswers ? <EyeOff size={16}/> : <Eye size={16}/>} {showAnswers ? 'Hide' : 'Show'} Answers
                                </button>
                            )}
                        </div>
                        
                        {isGenerated ? (
