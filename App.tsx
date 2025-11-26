import React, { useState } from 'react';
import { Layers, Grid, Type, Menu, Printer } from 'lucide-react';
import { ToolType } from './types';
import FlashcardTool from './components/FlashcardTool';
import BoardGameTool from './components/BoardGameTool';
import WordSearchTool from './components/WordSearchTool';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('flashcards');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderTool = () => {
    switch (activeTool) {
      case 'flashcards': return <FlashcardTool />;
      case 'boardgame': return <BoardGameTool />;
      case 'wordsearch': return <WordSearchTool />;
      default: return <FlashcardTool />;
    }
  };

  return (
    <div className="flex h-full w-full">
      {/* Sidebar Navigation */}
      <aside className={`no-print bg-bh-navy text-white transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-16'} h-full shadow-xl z-20`}>
        <div className="p-4 flex items-center justify-between border-b border-white/20">
            {isSidebarOpen && (
                <div className="flex items-center gap-2 font-bold text-lg">
                    <div className="w-8 h-8 bg-bh-gold rounded-full flex items-center justify-center text-bh-navy font-serif">BH</div>
                    <span>Material Maker</span>
                </div>
            )}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-white/10 rounded">
                <Menu size={20} />
            </button>
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-2">
            <NavButton 
                active={activeTool === 'flashcards'} 
                onClick={() => setActiveTool('flashcards')} 
                icon={<Layers size={20} />} 
                label="Flashcards" 
                isOpen={isSidebarOpen} 
            />
            <NavButton 
                active={activeTool === 'boardgame'} 
                onClick={() => setActiveTool('boardgame')} 
                icon={<Grid size={20} />} 
                label="Board Game" 
                isOpen={isSidebarOpen} 
            />
            <NavButton 
                active={activeTool === 'wordsearch'} 
                onClick={() => setActiveTool('wordsearch')} 
                icon={<Type size={20} />} 
                label="Word Search" 
                isOpen={isSidebarOpen} 
            />
        </nav>

        <div className="p-4 border-t border-white/20 text-xs text-center text-white/50">
            {isSidebarOpen && <p>&copy; British Hills 2024</p>}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto bg-slate-100 relative">
        {renderTool()}
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label, isOpen }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, isOpen: boolean }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${active ? 'bg-bh-gold text-bh-navy font-bold' : 'text-white hover:bg-white/10'}`}
        title={label}
    >
        {icon}
        {isOpen && <span>{label}</span>}
    </button>
);

export default App;
