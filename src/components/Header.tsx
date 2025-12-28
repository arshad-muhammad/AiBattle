import React, { useState, useRef, useEffect } from 'react';
import { Swords, ChevronDown, MoreHorizontal, PanelLeftOpen, MessageSquare, Check } from 'lucide-react';
import { BATTLE_MODELS } from '../services/groq';

interface HeaderProps {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    chatMode: 'battle' | 'direct';
    setChatMode: (mode: 'battle' | 'direct') => void;
    selectedModelId: string | null;
    setSelectedModelId: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    sidebarOpen, 
    toggleSidebar, 
    chatMode, 
    setChatMode,
    selectedModelId,
    setSelectedModelId
}) => {
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target as Node)) {
            setIsModeDropdownOpen(false);
        }
        if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
            setIsModelDropdownOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedModelName = BATTLE_MODELS.find(m => m.id === selectedModelId)?.displayName || 'Select Model';

  return (
    <header className="h-14 flex items-center justify-between px-4 w-full bg-transparent shrink-0 relative z-30">
      <div className="flex items-center gap-2">
        <div className={`transition-[width,opacity,margin] duration-300 ease-in-out overflow-hidden flex items-center ${
            !sidebarOpen ? 'w-10 opacity-100 mr-2' : 'w-0 opacity-0 mr-0'
        }`}>
            <button onClick={toggleSidebar} className="p-2 text-gray-400 hover:text-white hover:bg-hoverGray rounded-md whitespace-nowrap">
                <PanelLeftOpen size={18} />
            </button>
        </div>
        
        {/* Mode Selector */}
        <div className="relative" ref={modeDropdownRef}>
            <button 
                onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                className="flex items-center gap-2 text-sm text-gray-300 hover:bg-hoverGray hover:text-white px-3 py-2 rounded-lg transition-colors font-medium"
            >
                {chatMode === 'battle' ? <Swords size={16} /> : <MessageSquare size={16} />}
                <span>{chatMode === 'battle' ? 'Battle Mode' : 'Direct Chat'}</span>
                <ChevronDown size={14} className="text-gray-500" />
            </button>

            {isModeDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-xl overflow-hidden py-1">
                    <button 
                        onClick={() => { setChatMode('battle'); setIsModeDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-hoverGray hover:text-white flex items-center gap-2"
                    >
                        <Swords size={16} />
                        Battle Mode
                        {chatMode === 'battle' && <Check size={14} className="ml-auto text-blue-400" />}
                    </button>
                    <button 
                        onClick={() => { setChatMode('direct'); setIsModeDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-hoverGray hover:text-white flex items-center gap-2"
                    >
                        <MessageSquare size={16} />
                        Direct Chat
                        {chatMode === 'direct' && <Check size={14} className="ml-auto text-blue-400" />}
                    </button>
                </div>
            )}
        </div>

        {/* Model Selector (Only in Direct Chat) */}
        {chatMode === 'direct' && (
            <>
                <span className="text-gray-600 text-sm">/</span>
                <div className="relative" ref={modelDropdownRef}>
                    <button 
                        onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                        className="flex items-center gap-2 text-sm text-gray-300 hover:bg-hoverGray hover:text-white px-3 py-2 rounded-lg transition-colors font-medium"
                    >
                        <span>{selectedModelName}</span>
                        <ChevronDown size={14} className="text-gray-500" />
                    </button>

                    {isModelDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-xl overflow-hidden py-1 max-h-[300px] overflow-y-auto">
                            {BATTLE_MODELS.map(model => (
                                <button 
                                    key={model.id}
                                    onClick={() => { setSelectedModelId(model.id); setIsModelDropdownOpen(false); }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-hoverGray hover:text-white flex items-center gap-2"
                                >
                                    {model.displayName}
                                    {selectedModelId === model.id && <Check size={14} className="ml-auto text-blue-400" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <button className="text-gray-400 hover:text-white p-2 hover:bg-hoverGray rounded-lg transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
