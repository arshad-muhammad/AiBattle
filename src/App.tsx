import React, { useState, useCallback, useEffect } from 'react';
import { ref, onValue, set, push, get, child } from 'firebase/database';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Hero from './components/Hero';
import InputArea from './components/InputArea';
import MessageList from './components/MessageList';
import Leaderboard from './components/Leaderboard';
import { Message, MessageRole, ModelResponse, ChatSession } from './types';
import { BATTLE_MODELS, runGroqModel } from './services/groq';
import { useAuth } from './contexts/AuthContext';
import { database } from './services/firebase';

const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

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

  // Load Sessions: From Firebase if logged in, else LocalStorage
  useEffect(() => {
    if (authLoading) return;

    if (user) {
        // Firebase Sync
        const userChatsRef = ref(database, `users/${user.uid}/chats`);
        const unsubscribe = onValue(userChatsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedSessions: ChatSession[] = Object.values(data);
                loadedSessions.sort((a, b) => Number(b.id) - Number(a.id));
                setSessions(loadedSessions);
                
                // Only set current session if not already set, or if it's invalid
                setCurrentSessionId(prev => {
                    const exists = loadedSessions.find(s => s.id === prev);
                    return exists ? prev : (loadedSessions.length > 0 ? loadedSessions[0].id : null);
                });
            } else {
                setSessions([]);
                setCurrentSessionId(null);
            }
        });
        return () => unsubscribe();
    } else {
        // LocalStorage Fallback
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
    }
  }, [user, authLoading]);

  // Save Sessions: To LocalStorage if NOT logged in
  useEffect(() => {
      if (!user && !authLoading && sessions.length > 0) {
        localStorage.setItem('chat_sessions', JSON.stringify(sessions));
      }
  }, [sessions, user, authLoading]);

  // Helper to save specific session to Firebase
  const saveSessionToFirebase = (session: ChatSession) => {
      if (user) {
          const sessionRef = ref(database, `users/${user.uid}/chats/${session.id}`);
          set(sessionRef, session);
      }
  };

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
    setShowLeaderboard(false);
    
    // Save new session immediately
    if (user) saveSessionToFirebase(newSession);
  };

  const handleSelectSession = (id: string) => {
      setCurrentSessionId(id);
      setIsTyping(false); 
      setShowLeaderboard(false);
  };

  const handleWinnerSelection = useCallback((messageId: string, modelId: string) => {
      if (!currentSessionId) return;

      const currentSession = sessions.find(s => s.id === currentSessionId);
      if (!currentSession) return;

      const updatedMessages = currentSession.messages.map(msg => {
          if (msg.id === messageId && msg.modelResponses) {
              return {
                  ...msg,
                  modelResponses: msg.modelResponses.map(resp => ({
                      ...resp,
                      isWinner: resp.modelId === modelId // Toggle logic: only one winner per message
                  }))
              };
          }
          return msg;
      });

      const updatedSession = { ...currentSession, messages: updatedMessages };
      
      setSessions(prev => prev.map(s => s.id === currentSessionId ? updatedSession : s));
      if (user) saveSessionToFirebase(updatedSession);

  }, [sessions, currentSessionId, user]);

  const handleSend = useCallback(async (text: string) => {
    let activeSessionId = currentSessionId;
    let currentSession: ChatSession | undefined;

    // 1. Get or Create Session
    if (!activeSessionId) {
        const newSessionId = Date.now().toString();
        currentSession = {
            id: newSessionId,
            title: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
            messages: []
        };
        setSessions(prev => [currentSession!, ...prev]);
        setCurrentSessionId(newSessionId);
        activeSessionId = newSessionId;
    } else {
        currentSession = sessions.find(s => s.id === activeSessionId);
        if (!currentSession) return; // Should not happen
    }

    const timestamp = Date.now();
    const userMsgId = timestamp.toString();
    const modelMsgId = (timestamp + 1).toString();

    // 2. Add User Message
    const userMsg: Message = {
      id: userMsgId,
      role: MessageRole.USER,
      text: text,
      timestamp: timestamp,
    };

    // 3. Prepare Initial Model Message
    let initialModelResponses: ModelResponse[] = [];

    if (chatMode === 'battle') {
        initialModelResponses = BATTLE_MODELS.map(model => ({
            modelId: model.id,
            displayName: model.displayName,
            text: '',
            isLoading: true,
        }));
    } else {
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

    // Update Local State Optimistically
    const updatedMessages = [...(currentSession?.messages || []), userMsg, modelMsg];
    const updatedSession = { ...currentSession!, messages: updatedMessages };
    
    if (updatedSession.title === 'New Chat') {
        updatedSession.title = text.slice(0, 30) + (text.length > 30 ? '...' : '');
    }

    setSessions(prev => prev.map(s => s.id === activeSessionId ? updatedSession : s));
    
    if (user) saveSessionToFirebase(updatedSession);

    setIsTyping(true);

    // 4. Fire Requests
    const processModelRequest = async (modelId: string) => {
        const startTime = Date.now();
        const result = await runGroqModel(modelId, text);
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        updateModelResponse(activeSessionId!, modelMsgId, modelId, result, latency);
    };

    if (chatMode === 'battle') {
        const promises = BATTLE_MODELS.map(model => processModelRequest(model.id));
        await Promise.allSettled(promises);
    } else {
        await processModelRequest(selectedModelId);
    }

    setIsTyping(false);

  }, [currentSessionId, chatMode, selectedModelId, user, sessions]);

  // Helper to update state and save to Firebase
  const updateModelResponse = (sessionId: string, msgId: string, modelId: string, result: { text?: string, error?: string }, latency: number) => {
      setSessions(prev => {
          const nextSessions = prev.map(session => {
            if (session.id === sessionId) {
                const updatedMessages = session.messages.map(msg => {
                    if (msg.id === msgId && msg.modelResponses) {
                        return {
                            ...msg,
                            modelResponses: msg.modelResponses.map(resp => {
                                if (resp.modelId === modelId) {
                                    return {
                                        ...resp,
                                        isLoading: false,
                                        text: result.text || '',
                                        error: result.error,
                                        latency: latency
                                    };
                                }
                                return resp;
                            })
                        };
                    }
                    return msg;
                });
                const updatedSession = { ...session, messages: updatedMessages };
                
                if (user) {
                     const sessionRef = ref(database, `users/${user.uid}/chats/${session.id}`);
                     set(sessionRef, updatedSession); 
                }
                
                return updatedSession;
            }
            return session;
        });
        return nextSessions;
    });
  };

  const currentMessages = getCurrentMessages();

  if (authLoading) {
      return <div className="h-screen w-full flex items-center justify-center bg-main text-white">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-main text-textPrimary overflow-hidden font-sans">
      <Sidebar 
        onNewChat={handleNewChat} 
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onShowLeaderboard={() => { setShowLeaderboard(true); if (window.innerWidth < 768) setSidebarOpen(false); }}
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
          {showLeaderboard ? (
              <Leaderboard sessions={sessions} onClose={() => setShowLeaderboard(false)} />
          ) : (
            <>
                {currentMessages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <Hero />
                    </div>
                ) : (
                    <MessageList 
                        messages={currentMessages} 
                        isLoading={isTyping} 
                        onVote={handleWinnerSelection}
                    />
                )}
                
                {/* Footer Input Area */}
                <div className="w-full bg-main shrink-0 z-10 pb-2 md:pb-0">
                    <InputArea onSend={handleSend} disabled={isTyping} />
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;