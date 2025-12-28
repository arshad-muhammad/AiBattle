import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Hero from './components/Hero';
import InputArea from './components/InputArea';
import MessageList from './components/MessageList';
import { Message, MessageRole, ModelResponse, ChatSession } from './types';
import { BATTLE_MODELS, runGroqModel } from './services/groq';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // New states for Direct Chat
  const [chatMode, setChatMode] = useState<'battle' | 'direct'>('battle');
  const [selectedModelId, setSelectedModelId] = useState<string>(BATTLE_MODELS[0].id);

  useEffect(() => {
      const handleResize = () => {
          if (window.innerWidth < 768) {
              setSidebarOpen(false);
          }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedSessions = localStorage.getItem('chat_sessions');
    if (savedSessions) {
        try {
            const parsedSessions = JSON.parse(savedSessions);
            setSessions(parsedSessions);
            if (parsedSessions.length > 0) {
                setCurrentSessionId(parsedSessions[0].id);
            }
        } catch (e) {
            console.error("Failed to load sessions", e);
        }
    }
  }, []);

  useEffect(() => {
      if (sessions.length > 0) {
        localStorage.setItem('chat_sessions', JSON.stringify(sessions));
      }
  }, [sessions]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getCurrentMessages = () => {
      const session = sessions.find(s => s.id === currentSessionId);
      return session ? session.messages : [];
  };

  const handleNewChat = () => {
    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
        id: newSessionId,
        title: 'New Chat',
        messages: []
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setIsTyping(false);
  };

  const handleSelectSession = (id: string) => {
      setCurrentSessionId(id);
      setIsTyping(false); 
  };

  const handleSend = useCallback(async (text: string) => {
    let activeSessionId = currentSessionId;

    if (!activeSessionId) {
        const newSessionId = Date.now().toString();
        const newSession: ChatSession = {
            id: newSessionId,
            title: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
            messages: []
        };
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSessionId);
        activeSessionId = newSessionId;
    }

    const timestamp = Date.now();
    const userMsgId = timestamp.toString();
    const modelMsgId = (timestamp + 1).toString();

    // 1. Add User Message
    const userMsg: Message = {
      id: userMsgId,
      role: MessageRole.USER,
      text: text,
      timestamp: timestamp,
    };

    // 2. Prepare Initial Model Message
    let initialModelResponses: ModelResponse[] = [];

    if (chatMode === 'battle') {
        initialModelResponses = BATTLE_MODELS.map(model => ({
            modelId: model.id,
            displayName: model.displayName,
            text: '',
            isLoading: true,
        }));
    } else {
        // Direct Mode
        const selectedModel = BATTLE_MODELS.find(m => m.id === selectedModelId) || BATTLE_MODELS[0];
        initialModelResponses = [{
            modelId: selectedModel.id,
            displayName: selectedModel.displayName,
            text: '',
            isLoading: true,
        }];
    }

    const modelMsg: Message = {
        id: modelMsgId,
        role: MessageRole.MODEL,
        text: '', 
        timestamp: timestamp + 1,
        modelResponses: initialModelResponses
    };

    setSessions(prev => prev.map(session => {
        if (session.id === activeSessionId) {
            return {
                ...session,
                messages: [...session.messages, userMsg, modelMsg]
            };
        }
        return session;
    }));

    setIsTyping(true);

    // 3. Fire requests
    if (chatMode === 'battle') {
        // Parallel requests for all models
        const promises = BATTLE_MODELS.map(async (model) => {
            const result = await runGroqModel(model.id, text);
            updateModelResponse(activeSessionId!, modelMsgId, model.id, result);
        });
        await Promise.allSettled(promises);
    } else {
        // Single request for selected model
        // We still use runGroqModel which simulates the specific model persona
        const result = await runGroqModel(selectedModelId, text);
        updateModelResponse(activeSessionId!, modelMsgId, selectedModelId, result);
    }

    setIsTyping(false);

  }, [currentSessionId, chatMode, selectedModelId]);

  // Helper to update state deep in the session structure
  const updateModelResponse = (sessionId: string, msgId: string, modelId: string, result: { text?: string, error?: string }) => {
      setSessions(prev => prev.map(session => {
        if (session.id === sessionId) {
            return {
                ...session,
                messages: session.messages.map(msg => {
                    if (msg.id === msgId && msg.modelResponses) {
                        return {
                            ...msg,
                            modelResponses: msg.modelResponses.map(resp => {
                                if (resp.modelId === modelId) {
                                    return {
                                        ...resp,
                                        isLoading: false,
                                        text: result.text || '',
                                        error: result.error
                                    };
                                }
                                return resp;
                            })
                        };
                    }
                    return msg;
                })
            };
        }
        return session;
    }));
  };

  const currentMessages = getCurrentMessages();

  return (
    <div className="flex h-screen bg-main text-textPrimary overflow-hidden font-sans">
      <Sidebar 
        onNewChat={handleNewChat} 
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
      />
      
      <div className="flex flex-col flex-1 h-full min-w-0 relative">
        <Header 
            sidebarOpen={sidebarOpen} 
            toggleSidebar={toggleSidebar} 
            chatMode={chatMode}
            setChatMode={setChatMode}
            selectedModelId={selectedModelId}
            setSelectedModelId={setSelectedModelId}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {currentMessages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
               <Hero />
            </div>
          ) : (
            <MessageList messages={currentMessages} isLoading={isTyping} />
          )}
          
          {/* Footer Input Area */}
          <div className="w-full bg-main shrink-0 z-10 pb-2 md:pb-0">
            <InputArea onSend={handleSend} disabled={isTyping} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;