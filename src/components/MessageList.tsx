import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, MessageRole } from '../types';
import { Bot, User, AlertCircle } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Styling for markdown content
  const markdownStyles = {
    p: ({children}: any) => <p className="mb-2 last:mb-0">{children}</p>,
    strong: ({children}: any) => <strong className="font-bold text-white">{children}</strong>,
    em: ({children}: any) => <em className="italic text-gray-200">{children}</em>,
    h1: ({children}: any) => <h1 className="text-xl font-bold mb-2 text-white">{children}</h1>,
    h2: ({children}: any) => <h2 className="text-lg font-bold mb-2 text-white">{children}</h2>,
    h3: ({children}: any) => <h3 className="text-base font-bold mb-2 text-white">{children}</h3>,
    ul: ({children}: any) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
    ol: ({children}: any) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
    li: ({children}: any) => <li className="mb-1">{children}</li>,
    code: ({children}: any) => <code className="bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-blue-300">{children}</code>,
    pre: ({children}: any) => <pre className="bg-gray-900 p-3 rounded-lg overflow-x-auto mb-2 text-sm font-mono border border-gray-800">{children}</pre>,
    blockquote: ({children}: any) => <blockquote className="border-l-4 border-gray-600 pl-3 italic text-gray-400 mb-2">{children}</blockquote>,
  };

  return (
    <div className="flex-1 overflow-y-auto px-2 md:px-4 py-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
      <div className="max-w-[100%] md:max-w-[95%] mx-auto space-y-8">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === MessageRole.USER ? 'items-end' : 'items-start'}`}>
            
            {/* User Message */}
            {msg.role === MessageRole.USER && (
                <div className="flex gap-2 md:gap-4 max-w-[90%] md:max-w-3xl">
                     <div className="flex-1 min-w-0 bg-[#2a2a2a] px-3 md:px-4 py-2 md:py-3 rounded-2xl text-textPrimary break-words text-sm md:text-base">
                        <ReactMarkdown components={markdownStyles}>
                            {msg.text}
                        </ReactMarkdown>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                        <User size={16} />
                    </div>
                </div>
            )}

            {/* Model Responses (Horizontal Scroll) */}
            {msg.role === MessageRole.MODEL && msg.modelResponses && (
                <div className="w-full overflow-x-auto pb-4 pt-2 flex gap-4 snap-x px-1">
                    {msg.modelResponses.map((response) => (
                        <div 
                            key={response.modelId} 
                            className="min-w-[280px] max-w-[280px] md:min-w-[400px] md:max-w-[400px] shrink-0 bg-[#1a1a1a] border border-[#333] rounded-xl p-3 md:p-4 snap-start flex flex-col h-full"
                        >
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#333]">
                                <div className="w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400">
                                    <Bot size={14} />
                                </div>
                                <span className="font-medium text-sm text-gray-200 truncate" title={response.modelId}>
                                    {response.displayName}
                                </span>
                            </div>
                            
                            <div className="flex-1 text-sm text-gray-300 font-light">
                                {response.isLoading ? (
                                    <div className="space-y-2 animate-pulse opacity-50">
                                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                                    </div>
                                ) : response.error ? (
                                    <div className="text-red-400 flex items-start gap-2 text-xs bg-red-900/10 p-2 rounded">
                                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                        <span>{response.error}</span>
                                    </div>
                                ) : (
                                    <ReactMarkdown components={markdownStyles}>
                                        {response.text}
                                    </ReactMarkdown>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Fallback for single text model message if needed */}
            {msg.role === MessageRole.MODEL && !msg.modelResponses && (
                <div className="flex gap-4 max-w-3xl">
                     <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                        <Bot size={16} />
                     </div>
                     <div className="flex-1 min-w-0 pt-1">
                        <div className="font-semibold text-sm mb-1 text-gray-300">Assistant</div>
                        <div className="text-textPrimary break-words">
                            <ReactMarkdown components={markdownStyles}>
                                {msg.text}
                            </ReactMarkdown>
                        </div>
                     </div>
                </div>
            )}

          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default MessageList;
