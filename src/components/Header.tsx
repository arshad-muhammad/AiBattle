import React, { useState, useRef, useEffect } from 'react';
import { Swords, ChevronDown, MoreHorizontal, PanelLeftOpen, MessageSquare, Check, User, LogOut } from 'lucide-react';
import { BATTLE_MODELS } from '../services/groq';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';
import AuthModal from './AuthModal';

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
  const { user } = useAuth();
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target as Node)) {
            setIsModeDropdownOpen(false);
        }
        if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
            setIsModelDropdownOpen(false);
        }
        if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
            setIsProfileDropdownOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedModelName = BATTLE_MODELS.find(m => m.id === selectedModelId)?.displayName || 'Select Model';

  return (
    <>
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
          {user ? (
            <div className="relative" ref={profileDropdownRef}>
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 bg-[#2a2a2a] pl-3 pr-2 py-1.5 rounded-full hover:bg-[#333] transition-colors"
              >
                <div className="text-xs font-medium text-white max-w-[100px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.email?.[0].toUpperCase()}
                </div>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-xl overflow-hidden py-1">
                    <div className="px-4 py-2 border-b border-[#333]">
                        <p className="text-sm font-medium text-white truncate">{user.displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button 
                        onClick={() => { auth.signOut(); setIsProfileDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-hoverGray hover:text-red-300 flex items-center gap-2"
                    >
                        <LogOut size={14} />
                        Sign Out
                    </button>
                </div>
              )}
            </div>
          ) : (
            <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-white text-black px-4 py-1.5 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
                Login
            </button>
          )}

          <button className="text-gray-400 hover:text-white p-2 hover:bg-hoverGray rounded-lg transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </header>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
