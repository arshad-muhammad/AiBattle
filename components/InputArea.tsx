import React, { useState, useRef, useEffect } from 'react';
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
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      <div className="relative bg-input rounded-[20px] p-3 shadow-sm border border-[#333] focus-within:border-gray-600 transition-colors">
        
        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="w-full bg-transparent text-textPrimary placeholder-gray-500 resize-none outline-none text-base px-2 py-1 min-h-[44px] max-h-[200px]"
          rows={1}
          disabled={disabled}
        />

        {/* Action Bar */}
        <div className="flex items-center justify-between mt-2 px-1">
          {/* Left Actions */}
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-hoverGray rounded-full transition-colors">
              <Plus size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-hoverGray rounded-full transition-colors">
              <Globe size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-hoverGray rounded-full transition-colors">
              <ImageIcon size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-hoverGray rounded-full transition-colors">
              <Code size={18} />
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
             <button className="p-2 text-gray-500 hover:text-white hover:bg-hoverGray rounded-full transition-colors" title="Donate">
              <HandHeart size={18} />
            </button>
            <button 
              onClick={handleSend}
              disabled={!text.trim() || disabled}
              className={`p-2 rounded-lg transition-all ${
                text.trim() && !disabled
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-[#333] text-gray-500 cursor-not-allowed'
              }`}
            >
              <ArrowUp size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
