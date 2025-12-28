import React, { useState, useRef } from 'react';
import { Plus, Globe, Image as ImageIcon, Code, ArrowUp, HandHeart } from 'lucide-react';

interface InputAreaProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustHeight();
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2 md:px-4 pb-4 md:pb-8">
      <div className="relative bg-input rounded-[26px] p-3 md:p-4 shadow-sm border border-[#333] transition-colors focus-within:border-gray-500">
        
        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="w-full bg-transparent text-textPrimary placeholder-gray-400 resize-none outline-none text-base md:text-lg px-1 py-1 min-h-[48px] md:min-h-[56px] max-h-[200px]"
          rows={1}
          disabled={disabled}
        />

        {/* Action Bar */}
        <div className="flex items-center justify-between mt-2">
          {/* Left Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <button className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-hoverGray rounded-full transition-colors border border-dashed border-gray-600 hover:border-gray-400">
              <Plus size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
            <button className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-hoverGray rounded-full transition-colors hidden sm:flex">
              <Globe size={18} />
            </button>
            <button className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-hoverGray rounded-full transition-colors">
              <ImageIcon size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
            <button className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-hoverGray rounded-full transition-colors hidden sm:flex">
              <Code size={18} />
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
             <button className="text-gray-400 hover:text-white transition-colors hidden sm:block" title="Donate">
              <HandHeart size={20} />
            </button>
            <button 
              onClick={handleSend}
              disabled={!text.trim() || disabled}
              className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg transition-all ${
                text.trim() && !disabled
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-[#333] text-gray-500 cursor-not-allowed'
              }`}
            >
              <ArrowUp size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
