import React, { useEffect, useRef } from 'react';
import { Message, MessageRole } from '../types';
import { Bot, User } from 'lucide-react';
// We use a library for markdown in a real app, but for this constraint-based response, we'll just render text or simple formatting.
// Since we can't install react-markdown, we will simply preserve whitespace.

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === MessageRole.USER ? 'bg-gray-700' : 'bg-green-600'
            }`}>
              {msg.role === MessageRole.USER ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="font-semibold text-sm mb-1 text-gray-300">
                {msg.role === MessageRole.USER ? 'You' : 'Gemini'}
              </div>
              <div className="text-textPrimary leading-relaxed whitespace-pre-wrap break-words">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shrink-0 animate-pulse">
                <Bot size={16} />
             </div>
             <div className="pt-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce inline-block mr-1"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce inline-block mr-1 delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce inline-block delay-150"></div>
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default MessageList;
