import React, { useState, useRef } from 'react';
import { Upload, X, Printer, Layout, Type as TypeIcon } from 'lucide-react';
import { Flashcard } from '../types';
import ImageCropperModal from './ImageCropperModal';

const FONTS = [
    { name: 'Sans Serif', value: 'font-sans' },
    { name: 'Comic', value: 'font-comic' },
    { name: 'Serif', value: 'font-serif' },
    { name: 'Courier', value: 'font-courier' },
    { name: 'Roboto', value: 'font-roboto' },
];

const FlashcardTool: React.FC = () => {
    const [cards, setCards] = useState<Flashcard[]>(Array.from({ length: 8 }, (_, i) => ({ id: i, text: '', image: null })));
    const [selectedFont, setSelectedFont] = useState(FONTS[0].value);
    const [printLayout, setPrintLayout] = useState<'1-per-page' | '4-per-page'>('4-per-page');
    const [croppingId, setCroppingId] = useState<number | null>(null);
    const [tempImage, setTempImage] = useState<string | null>(null);

    // Quick Fill
    const [quickFillText, setQuickFillText] = useState('');

    const handleQuickFill = () => {
        const words = quickFillText.split(/[\n,]+/).map(w => w.trim()).filter(w => w);
        const newCards = [...cards];
        words.forEach((word, idx) => {
            if (idx < 8) newCards[idx].text = word;
        });
        setCards(newCards);
        setQuickFillText('');
    };

    const handleImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setTempImage(event.target?.result as string);
                setCroppingId(id);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleCropComplete = (croppedImage: string) => {
        if (croppingId !== null) {
            const newCards = [...cards];
            newCards[croppingId].image = croppedImage;
            setCards(newCards);
            setCroppingId(null);
            setTempImage(null);
        }
    };

    const clearCard = (id: number) => {
        const newCards = [...cards];
        newCards[id] = { ...newCards[id], text: '', image: null };
        setCards(newCards);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen pb-20">
            {/* Header / Controls - No Print */}
            <div className="no-print space-y-6 mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Flashcard Creator</h2>
                        <p className="text-slate-500">Create up to 8 cards. Upload images and add text.</p>
                    </div>
                    <button onClick={() => window.print()} className="btn-primary flex items-center gap-2">
                        <Printer size={20} /> Print Cards
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Settings */}
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                            <TypeIcon size={16} /> Font Style
                        </label>
                        <select 
                            value={selectedFont} 
                            onChange={(e) => setSelectedFont(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        >
                            {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                        </select>

                        <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                            <Layout size={16} /> Print Layout
                        </label>
                        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                            <button 
                                className={`flex-1 py-1 px-2 rounded text-sm ${printLayout === '1-per-page' ? 'bg-white shadow text-bh-navy font-bold' : 'text-slate-500'}`}
                                onClick={() => setPrintLayout('1-per-page')}
                            >
                                1 Large / Page
                            </button>
                            <button 
                                className={`flex-1 py-1 px-2 rounded text-sm ${printLayout === '4-per-page' ? 'bg-white shadow text-bh-navy font-bold' : 'text-slate-500'}`}
                                onClick={() => setPrintLayout('4-per-page')}
                            >
                                4 / Page
                            </button>
                        </div>
                    </div>

                    {/* Quick Fill */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Quick Fill (Comma or Newline separated)</label>
                        <div className="flex gap-2">
                            <textarea 
                                value={quickFillText}
                                onChange={(e) => setQuickFillText(e.target.value)}
                                className="flex-1 p-2 border rounded-lg h-24 resize-none"
                                placeholder="Apple, Banana, Orange..."
                            />
                            <button onClick={handleQuickFill} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 rounded-lg font-semibold transition-colors">
                                Fill
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Grid - No Print */}
            <div className="no-print grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {cards.map((card) => (
                    <div key={card.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3">
                        <div className="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden relative group">
                            {card.image ? (
                                <>
                                    <img src={card.image} alt="Card" className="w-full h-full object-cover" />
                                    <button 
                                        onClick={() => clearCard(card.id)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </>
                            ) : (
                                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
                                    <Upload size={24} />
                                    <span className="text-xs mt-1">Upload Image</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(card.id, e)} />
                                </label>
                            )}
                        </div>
                        <input 
                            type="text" 
                            value={card.text}
                            onChange={(e) => {
                                const newCards = [...cards];
                                newCards[card.id].text = e.target.value;
                                setCards(newCards);
                            }}
                            className="w-full p-2 border rounded text-center font-bold"
                            placeholder={`Card ${card.id + 1}`}
                        />
                    </div>
                ))}
            </div>

            {/* Hidden Print View */}
            <div className={`print-only w-full h-full ${selectedFont}`}>
                {/* Print Layout Logic */}
                <div className={`grid ${printLayout === '1-per-page' ? 'grid-cols-1' : 'grid-cols-2'} gap-0 w-full`}>
                    {cards.filter(c => c.text || c.image).map((card, idx) => (
                        <div 
                            key={card.id} 
                            className={`
                                relative border-2 border-slate-300 flex flex-col items-center justify-between p-8
                                ${printLayout === '1-per-page' ? 'h-[95vh] page-break' : 'h-[48vh]'}
                                ${printLayout === '4-per-page' && (idx + 1) % 4 === 0 ? 'page-break' : ''}
                                bg-white
                            `}
                        >
                            <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                                {card.image ? (
                                    <img src={card.image} className="max-w-full max-h-full object-contain" alt="card" />
                                ) : (
                                    <div className="text-slate-200 italic">No Image</div>
                                )}
                            </div>
                            {card.text && (
                                <div className="mt-6 text-center w-full">
                                    <h2 className={`font-bold ${printLayout === '1-per-page' ? 'text-8xl' : 'text-5xl'}`}>
                                        {card.text}
                                    </h2>
                                </div>
                            )}
                            
                            {/* Branding Logo in Corner */}
                             <div className="absolute bottom-4 right-4 opacity-50">
                                <img src="logo.png" onError={(e) => e.currentTarget.style.display = 'none'} alt="BH Logo" className="h-8" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cropper Modal */}
            {tempImage && (
                <ImageCropperModal 
                    imageSrc={tempImage} 
                    onCancel={() => {
                        setTempImage(null);
                        setCroppingId(null);
                    }} 
                    onComplete={handleCropComplete} 
                />
            )}
        </div>
    );
};

export default FlashcardTool;
