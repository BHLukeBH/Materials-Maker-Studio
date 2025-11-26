import React, { useState, useEffect } from 'react';
import { BoardTile, BoardGameTemplate } from '../types';
import { Printer, Edit2, Type, Palette, ArrowRight, ArrowLeft, ArrowDown } from 'lucide-react';

const COLORS = [
    { name: 'White', value: '#ffffff' },
    { name: 'Red', value: '#fee2e2' },
    { name: 'Green', value: '#dcfce7' },
    { name: 'Blue', value: '#dbeafe' },
    { name: 'Yellow', value: '#fef9c3' },
    { name: 'Gold', value: '#fde68a' }, // British Hills Gold-ish
];

const BACKGROUND_OPTIONS = [
    { name: 'None (White)', value: 'white' },
    { name: 'Mist', value: '#f1f5f9' },
    { name: 'Cream', value: '#fffbeb' },
    { name: 'Pale Blue', value: '#ecfeff' },
    { name: 'Pale Green', value: '#f0fdf4' },
    { name: 'Sunset (Gradient)', value: 'linear-gradient(to bottom, #fff7ed, #fdba74)' },
    { name: 'Ocean (Gradient)', value: 'linear-gradient(to bottom, #ecfeff, #67e8f9)' },
    { name: 'Meadow (Gradient)', value: 'linear-gradient(to bottom, #f0fdf4, #86efac)' },
    { name: 'Lavender (Gradient)', value: 'linear-gradient(to bottom, #faf5ff, #d8b4fe)' },
];

const TEMPLATES: Record<BoardGameTemplate, { tiles: number; name: string; defaultTitle: string }> = {
    snake: { tiles: 24, name: 'Snake (Winding)', defaultTitle: 'Adventure Path' },
    race: { tiles: 20, name: 'Race Track (Loop)', defaultTitle: 'Race Track' },
    bingo: { tiles: 16, name: 'Bingo / Grid (4x4)', defaultTitle: 'Bingo' },
};

const BoardGameTool: React.FC = () => {
    const [template, setTemplate] = useState<BoardGameTemplate>('snake');
    const [tiles, setTiles] = useState<BoardTile[]>([]);
    const [editTileId, setEditTileId] = useState<number | null>(null);
    const [quickFillText, setQuickFillText] = useState('');
    const [gameTitle, setGameTitle] = useState('');
    const [bgStyle, setBgStyle] = useState('white');

    // Initialize tiles and title on template change
    useEffect(() => {
        const config = TEMPLATES[template];
        const count = config.tiles;
        
        // Set Default Title
        setGameTitle(config.defaultTitle);

        const newTiles: BoardTile[] = Array.from({ length: count }, (_, i) => ({
            id: i,
            text: '',
            color: '#ffffff',
            isSpecial: false
        }));

        // Set Start/Finish defaults
        if (template === 'snake') {
            newTiles[0] = { ...newTiles[0], text: 'START', color: '#dcfce7', isSpecial: true };
            newTiles[count - 1] = { ...newTiles[count - 1], text: 'FINISH', color: '#fee2e2', isSpecial: true };
        } else if (template === 'race') {
             // For Loop, Tile 0 is Start. Tile 19 is Finish (end of loop).
             newTiles[0] = { ...newTiles[0], text: 'START', color: '#dcfce7', isSpecial: true };
             newTiles[count - 1] = { ...newTiles[count - 1], text: 'FINISH', color: '#fee2e2', isSpecial: true };
        }

        setTiles(newTiles);
    }, [template]);

    const handleQuickFill = () => {
        const words = quickFillText.split(/[\n,]+/).map(w => w.trim()).filter(w => w);
        const newTiles = [...tiles];
        let wordIdx = 0;

        for (let i = 0; i < newTiles.length; i++) {
            // Skip special tiles (Start/Finish) unless it's Bingo (no special tiles usually)
            if (template !== 'bingo' && newTiles[i].isSpecial) continue;
            
            if (wordIdx < words.length) {
                newTiles[i].text = words[wordIdx];
                wordIdx++;
            }
        }
        setTiles(newTiles);
        setQuickFillText('');
    };

    const updateTile = (id: number, updates: Partial<BoardTile>) => {
        setTiles(tiles.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen pb-20">
            {/* Controls */}
            <div className="no-print bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Board Game Creator</h2>
                        <p className="text-slate-500">Design custom board games for the classroom.</p>
                    </div>
                    <button onClick={() => window.print()} className="btn-primary flex items-center gap-2">
                        <Printer size={20} /> Print Game
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Template Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Game Style</label>
                        <div className="flex gap-2 mb-4">
                            {(Object.keys(TEMPLATES) as BoardGameTemplate[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTemplate(t)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-colors ${template === t ? 'bg-bh-navy text-white border-bh-navy' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                                >
                                    {TEMPLATES[t].name}
                                </button>
                            ))}
                        </div>

                        {/* Title Editor */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <Type size={16} /> Game Title (Print Header)
                            </label>
                            <input 
                                type="text" 
                                value={gameTitle}
                                onChange={(e) => setGameTitle(e.target.value)}
                                className="w-full border border-slate-300 p-2 rounded-lg"
                                placeholder="e.g. Past Tense Race"
                            />
                        </div>
                    </div>

                     {/* Background Selection */}
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Palette size={16} /> Background Style
                        </label>
                        <select 
                            value={BACKGROUND_OPTIONS.some(o => o.value === bgStyle) ? bgStyle : 'custom'} 
                            onChange={(e) => {
                                if(e.target.value !== 'custom') setBgStyle(e.target.value);
                            }}
                            className="w-full p-2 border border-slate-300 rounded-lg mb-2"
                        >
                            {BACKGROUND_OPTIONS.map(opt => (
                                <option key={opt.name} value={opt.value}>{opt.name}</option>
                            ))}
                            <option value="custom">Custom Color...</option>
                        </select>
                        
                        {/* Custom Color Picker if not a gradient */}
                        {!bgStyle.includes('gradient') && (
                            <div className="flex items-center gap-2">
                                <input 
                                    type="color" 
                                    value={bgStyle} 
                                    onChange={(e) => setBgStyle(e.target.value)}
                                    className="h-8 w-12 p-0 border rounded cursor-pointer"
                                />
                                <span className="text-xs text-slate-500">Pick custom solid color</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                     <label className="block text-sm font-semibold text-slate-700 mb-2">Quick Fill Words</label>
                     <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 border p-2 rounded-lg" 
                            placeholder="Type words separated by commas to fill empty tiles..." 
                            value={quickFillText}
                            onChange={(e) => setQuickFillText(e.target.value)}
                        />
                        <button onClick={handleQuickFill} className="bg-slate-200 px-4 py-2 rounded-lg font-semibold hover:bg-slate-300 transition-colors">Fill</button>
                     </div>
                </div>
            </div>

            {/* Editor Preview */}
            <div className="no-print mb-8">
                <h3 className="text-lg font-bold mb-4 text-slate-700 flex items-center gap-2"><Edit2 size={18}/> Click a tile to edit</h3>
                <div className="bg-slate-200 p-8 rounded-xl overflow-x-auto min-h-[500px] flex items-center justify-center">
                    {/* Render the Game Board Wrapper */}
                    <div className="scale-75 origin-top">
                        <GameBoard tiles={tiles} template={template} bgStyle={bgStyle} onTileClick={setEditTileId} />
                    </div>
                </div>
            </div>

            {/* Tile Edit Modal */}
            {editTileId !== null && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
                        <h3 className="font-bold text-lg">Edit Tile {editTileId + 1}</h3>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Text</label>
                            <input 
                                type="text" 
                                value={tiles.find(t => t.id === editTileId)?.text || ''} 
                                onChange={(e) => updateTile(editTileId, { text: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Background Color</label>
                            <div className="flex gap-2 flex-wrap">
                                {COLORS.map(c => (
                                    <button 
                                        key={c.name}
                                        onClick={() => updateTile(editTileId, { color: c.value })}
                                        className="w-8 h-8 rounded-full border shadow-sm"
                                        style={{ backgroundColor: c.value }}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button onClick={() => setEditTileId(null)} className="px-4 py-2 bg-bh-navy text-white rounded-lg">Done</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print View */}
            <div className="print-only w-full h-full p-4 flex flex-col items-center justify-center bg-white">
                <h1 className="text-5xl font-bold text-center mb-8 font-serif text-bh-navy uppercase tracking-wider">
                    {gameTitle}
                </h1>
                <GameBoard tiles={tiles} template={template} bgStyle={bgStyle} printMode />
                <div className="absolute bottom-4 right-4 opacity-50">
                    <img src="logo.png" onError={(e) => e.currentTarget.style.display = 'none'} alt="BH Logo" className="h-12" />
                </div>
            </div>
        </div>
    );
};

// Reusable Board Renderer
interface GameBoardProps {
    tiles: BoardTile[]; 
    template: BoardGameTemplate; 
    bgStyle: string;
    onTileClick?: (id: number) => void; 
    printMode?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ tiles, template, bgStyle, onTileClick, printMode }) => {
    
    const tileClass = (_t: BoardTile) => `
        border-2 border-slate-800 flex items-center justify-center text-center p-2 relative
        ${printMode ? 'shadow-none' : 'shadow-md cursor-pointer hover:scale-105 transition-transform'}
        text-sm font-bold
    `;
    
    const tileStyle = (t: BoardTile) => ({
        backgroundColor: t.color,
    });

    // Container style ensures background prints and looks correct
    const containerStyle = {
        background: bgStyle,
    };

    if (template === 'bingo') {
        return (
            <div 
                className="grid grid-cols-4 gap-4 w-[600px] aspect-square p-8 rounded-xl print-exact border-4 border-slate-800"
                style={containerStyle}
            >
                {tiles.map(t => (
                    <div 
                        key={t.id} 
                        className={`${tileClass(t)} rounded-lg text-xl`} 
                        style={tileStyle(t)}
                        onClick={() => onTileClick && onTileClick(t.id)}
                    >
                        {t.text}
                    </div>
                ))}
            </div>
        );
    }

    if (template === 'snake') {
        // Snake Layout
        const displayOrder: number[] = [];
        // Row 0
        for(let i=0; i<6; i++) displayOrder.push(i);
        // Row 1 (Reversed)
        for(let i=11; i>=6; i--) displayOrder.push(i);
        // Row 2
        for(let i=12; i<18; i++) displayOrder.push(i);
        // Row 3 (Reversed)
        for(let i=23; i>=18; i--) displayOrder.push(i);

        // Arrow Logic
        const getArrow = (id: number) => {
            const arrowClass = "absolute text-slate-800 opacity-20 pointer-events-none";
            // Row 0 (0-5)
            if ([0,1,2,3,4].includes(id)) return <ArrowRight size={24} className={`${arrowClass} right-1 top-1/2 -translate-y-1/2`} />;
            if (id === 5) return <ArrowDown size={24} className={`${arrowClass} bottom-1 left-1/2 -translate-x-1/2`} />;
            
            // Row 1 (6-11) - Moving Left
            if ([6,7,8,9,10].includes(id)) return <ArrowLeft size={24} className={`${arrowClass} left-1 top-1/2 -translate-y-1/2`} />;
            if (id === 11) return <ArrowDown size={24} className={`${arrowClass} bottom-1 left-1/2 -translate-x-1/2`} />;

            // Row 2 (12-17) - Moving Right
            if ([12,13,14,15,16].includes(id)) return <ArrowRight size={24} className={`${arrowClass} right-1 top-1/2 -translate-y-1/2`} />;
            if (id === 17) return <ArrowDown size={24} className={`${arrowClass} bottom-1 left-1/2 -translate-x-1/2`} />;

            // Row 3 (18-23) - Moving Left
            if ([18,19,20,21,22].includes(id)) return <ArrowLeft size={24} className={`${arrowClass} left-1 top-1/2 -translate-y-1/2`} />;
            // 23 is Finish

            return null;
        };

        return (
            <div 
                className="grid grid-cols-6 gap-2 w-[800px] p-8 rounded-xl print-exact border-4 border-slate-800"
                style={containerStyle}
            >
                {displayOrder.map((tileIndex, _) => {
                    const t = tiles[tileIndex];
                    if (!t) return null;
                    
                    return (
                        <div 
                            key={t.id} 
                            className={`${tileClass(t)} h-32 rounded-xl`} 
                            style={tileStyle(t)}
                            onClick={() => onTileClick && onTileClick(t.id)}
                        >
                            <span className="absolute top-1 left-2 text-xs opacity-50">{t.id + 1}</span>
                            {getArrow(t.id)}
                            {t.text}
                        </div>
                    );
                })}
            </div>
        );
    }

    if (template === 'race') {
        // Race Track Loop: 6x6 Grid.
        return (
            <div 
                className="relative w-[800px] aspect-square border-4 border-slate-300 rounded-3xl p-6 grid grid-cols-6 grid-rows-6 gap-2 print-exact"
                style={containerStyle}
            >
                 {/* Center Decoration */}
                 <div className="col-start-2 col-end-6 row-start-2 row-end-6 border-4 border-dashed border-slate-400/50 rounded-2xl flex items-center justify-center pointer-events-none">
                    <span className="text-6xl font-black text-slate-800/20 rotate-[-15deg]">RACE!</span>
                 </div>

                 {tiles.map((t, i) => {
                     let gridArea = {};
                     if (i < 6) { // Top: Row 1, Cols 1-6
                         gridArea = { gridRow: 1, gridColumn: i + 1 };
                     } else if (i < 10) { // Right: Cols 6, Rows 2-5
                         gridArea = { gridRow: i - 4, gridColumn: 6 };
                     } else if (i < 16) { // Bottom: Row 6, Cols 6-1
                         gridArea = { gridRow: 6, gridColumn: 16 - i };
                     } else { // Left: Col 1, Rows 5-2
                         gridArea = { gridRow: 21 - i, gridColumn: 1 };
                     }

                     return (
                        <div 
                            key={t.id}
                            className={`${tileClass(t)} rounded-lg z-10`}
                            style={{ ...tileStyle(t), ...gridArea }}
                            onClick={() => onTileClick && onTileClick(t.id)}
                        >
                             <span className="absolute top-1 left-1 text-[10px] bg-white/50 px-1 rounded-full pointer-events-none">{t.id + 1}</span>
                             {t.text}
                        </div>
                     )
                 })}
            </div>
        )
    }

    return <div>Select a template</div>;
};

export default BoardGameTool;
