import React from 'react';
import { Swords, ChevronDown, MoreHorizontal, PanelLeftOpen } from 'lucide-react';

interface HeaderProps {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <header className="h-14 flex items-center justify-between px-4 w-full bg-main shrink-0">
      <div className="flex items-center gap-2">
        <div className={`transition-[width,opacity,margin] duration-300 ease-in-out overflow-hidden flex items-center ${
            !sidebarOpen ? 'w-10 opacity-100 mr-2' : 'w-0 opacity-0 mr-0'
        }`}>
            <button onClick={toggleSidebar} className="p-2 text-gray-400 hover:text-white hover:bg-hoverGray rounded-md whitespace-nowrap">
                <PanelLeftOpen size={18} />
            </button>
        </div>
        
        <button className="flex items-center gap-2 text-sm text-gray-300 hover:bg-hoverGray px-2 py-1.5 rounded-md transition-colors font-medium">
          <Swords size={16} />
          <span>Battle</span>
          <ChevronDown size={14} className="text-gray-500" />
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="bg-white text-black px-3 py-1.5 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">
          Login
        </button>
        <button className="text-gray-400 hover:text-white p-1">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;