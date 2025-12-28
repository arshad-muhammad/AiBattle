import React from 'react';
import { SquarePen, Trophy, ChevronDown, PanelLeftClose, MessageSquare } from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  onNewChat: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onNewChat, 
  isOpen, 
  toggleSidebar, 
  sessions, 
  currentSessionId, 
  onSelectSession 
}) => {
  return (
    <>
      {/* Mobile Overlay Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      <div 
        className={`
          fixed md:relative z-50 h-full flex flex-col shrink-0 bg-sidebar border-r border-[#222]
          transition-[transform,width,opacity] duration-300 ease-in-out overflow-hidden whitespace-nowrap
          ${isOpen ? 'translate-x-0 w-[260px] opacity-100' : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 w-[260px]'}
        `}
      >
        <div className="w-[260px] flex flex-col h-full">
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-3">
            <button className="flex items-center gap-2 hover:bg-hoverGray p-2 rounded-lg text-sm font-semibold transition-colors flex-1 text-left text-gray-200">
              <span>LMArena</span>
              <ChevronDown size={14} className="text-gray-500 ml-auto" />
            </button>
            <button onClick={toggleSidebar} className="p-2 text-gray-400 hover:text-white hover:bg-hoverGray rounded-lg ml-1">
               <PanelLeftClose size={18} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-800">
            <button 
              onClick={() => { onNewChat(); if (window.innerWidth < 768) toggleSidebar(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-hoverGray hover:text-white rounded-lg transition-colors"
            >
              <SquarePen size={18} />
              <span>New Chat</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-hoverGray hover:text-white rounded-lg transition-colors">
              <Trophy size={18} />
              <span>Leaderboard</span>
            </button>

            {/* Chat History Section */}
            {sessions.length > 0 && (
              <div className="pt-4 pb-2">
                <div className="px-3 text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Recents
                </div>
                <div className="space-y-0.5">
                  {sessions.map(session => (
                    <button
                      key={session.id}
                      onClick={() => { onSelectSession(session.id); if (window.innerWidth < 768) toggleSidebar(); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors truncate ${
                        currentSessionId === session.id 
                          ? 'bg-[#2a2a2a] text-white' 
                          : 'text-gray-400 hover:bg-hoverGray hover:text-gray-200'
                      }`}
                    >
                      <MessageSquare size={16} className="shrink-0" />
                      <span className="truncate">{session.title || 'New Chat'}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 mt-auto">
               <div className="flex gap-4 text-[11px] text-[#666] border-t border-[#222] pt-4 flex-wrap">
                  <a href="#" className="hover:text-gray-400 transition-colors">Terms of Use</a>
                  <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-gray-400 transition-colors">Cookies</a>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
