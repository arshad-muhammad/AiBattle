import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Hero from './components/Hero';
import InputArea from './components/InputArea';
import MessageList from './components/MessageList';
import { Message, MessageRole } from './types';
import { streamGeminiResponse } from './services/gemini';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleNewChat = () => {
    setMessages([]);
    setIsTyping(false);
  };

  const handleSend = useCallback(async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const modelMsgId = (Date.now() + 1).toString();
    let currentModelText = '';

    // Optimistic update for model message placeholder
    // We don't add the model message to state immediately to show a loading spinner first,
    // or we can add empty string. Let's wait for first chunk to add it.
    
    // Prepare history for Gemini
    const history = messages.map(m => ({
      role: m.role === MessageRole.USER ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    let isFirstChunk = true;

    await streamGeminiResponse(
      text,
      history,
      (chunk) => {
        currentModelText += chunk;
        
        setMessages(prev => {
            // Check if model message already exists
            const existing = prev.find(m => m.id === modelMsgId);
            if (existing) {
                return prev.map(m => m.id === modelMsgId ? { ...m, text: currentModelText } : m);
            } else {
                return [...prev, {
                    id: modelMsgId,
                    role: MessageRole.MODEL,
                    text: currentModelText,
                    timestamp: Date.now()
                }];
            }
        });
        
        if (isFirstChunk) {
            setIsTyping(false);
            isFirstChunk = false;
        }
      }
    );

    setIsTyping(false);

  }, [messages]);

  return (
    <div className="flex h-screen bg-main text-textPrimary overflow-hidden font-sans">
      <Sidebar 
        onNewChat={handleNewChat} 
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      <div className="flex flex-col flex-1 h-full min-w-0 relative">
        <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
               <Hero />
            </div>
          ) : (
            <MessageList messages={messages} isLoading={isTyping} />
          )}
          
          {/* Footer Input Area */}
          <div className="w-full bg-main shrink-0 z-10">
            <InputArea onSend={handleSend} disabled={isTyping} />
            <div className="text-center text-[10px] text-[#555] pb-2">
                Gemini may display inaccurate info, including about people, so double-check its responses.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
