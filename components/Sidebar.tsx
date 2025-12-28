import React from 'react';
import { SquarePen, Trophy, ChevronDown, PanelLeftClose } from 'lucide-react';

interface SidebarProps {
  onNewChat: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewChat, isOpen, toggleSidebar }) => {
  return (
    <div 
      className={`bg-sidebar flex flex-col h-full shrink-0 transition-[width,opacity,border-color] duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
        isOpen ? 'w-64 border-r border-[#222] opacity-100' : 'w-0 border-r-0 opacity-0'
      }`}
    >
      <div className="w-64 flex flex-col h-full">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-transparent hover:border-[#222]">
          <button className="flex items-center gap-2 hover:bg-hoverGray p-2 rounded-md text-sm font-semibold transition-colors flex-1 text-left">
            <span>LMArena</span>
            <ChevronDown size={14} className="text-gray-500 ml-auto" />
          </button>
          <button onClick={toggleSidebar} className="p-2 text-gray-400 hover:text-white hover:bg-hoverGray rounded-md ml-2">
             <PanelLeftClose size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          <button 
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-textPrimary hover:bg-hoverGray rounded-md transition-colors mb-1"
          >
            <SquarePen size={16} />
            <span>New Chat</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-textPrimary hover:bg-hoverGray rounded-md transition-colors">
            <Trophy size={16} />
            <span>Leaderboard</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 flex gap-4 text-xs text-textSecondary border-t border-[#222]">
          <a href="#" className="hover:underline">Terms of Use</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookies</a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;