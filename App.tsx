
import React, { useState, useEffect } from 'react';
import { AppMode, ChatSession, Message, User, AppSettings } from './types.ts';
import ChatInterface from './components/ChatInterface.tsx';
import VoiceInterface from './components/VoiceInterface.tsx';
import SettingsModal from './components/SettingsModal.tsx';
import Onboarding from './components/Onboarding.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isModesOpen, setIsModesOpen] = useState(false);
  
  // Signal that the app is mounted and ready
  useEffect(() => {
    document.body.classList.add('app-ready');
  }, []);

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('dot_app_settings');
    return saved ? JSON.parse(saved) : {
      theme: 'dark',
      modelQuality: 'high',
      showGrounding: true,
      clearHistoryOnLogout: false,
      snowEnabled: false,
      customCursorEnabled: true
    };
  });

  const [mode, setMode] = useState<AppMode>(AppMode.CHAT);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  useEffect(() => {
    const savedUser = localStorage.getItem('dot_user_profile');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedSessions = localStorage.getItem('dot_chat_history');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed);
      if (parsed.length > 0) {
        setCurrentSessionId(parsed[0].id);
      } else {
        handleNewChat();
      }
    } else {
      handleNewChat();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dot_app_settings', JSON.stringify(settings));
    if (settings.theme === 'light') document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');

    if (settings.snowEnabled) document.body.classList.add('snow-active');
    else document.body.classList.remove('snow-active');

    if (settings.customCursorEnabled) document.body.classList.add('custom-cursor-active');
    else document.body.classList.remove('custom-cursor-active');
  }, [settings]);

  const handleOnboardingComplete = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('dot_user_profile', JSON.stringify(newUser));
    handleNewChat();
  };

  const handleClearHistory = () => {
    setSessions([]);
    const newId = Date.now().toString();
    const initialSession = {
      id: newId,
      title: 'Initial session',
      messages: [],
      createdAt: Date.now()
    };
    setSessions([initialSession]);
    setCurrentSessionId(newId);
    localStorage.removeItem('dot_chat_history');
    setIsSettingsOpen(false);
  };

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('dot_chat_history', JSON.stringify(sessions));
    }
  }, [sessions]);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: 'New conversation',
      messages: [],
      createdAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setIsHistoryOpen(false);
  };

  const setMessages = (update: React.SetStateAction<Message[]>) => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        const nextMsgs = typeof update === 'function' ? update(s.messages) : update;
        let newTitle = s.title;
        if (s.messages.length === 0 && nextMsgs.length > 0) {
          const firstContent = nextMsgs[0].content;
          newTitle = firstContent.slice(0, 30) + (firstContent.length > 30 ? '...' : '');
        }
        return { ...s, messages: nextMsgs, title: newTitle };
      }
      return s;
    }));
  };

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const isLight = settings.theme === 'light';

  return (
    <div className={`flex flex-col h-screen overflow-hidden transition-all duration-500 ${isLight ? 'bg-[#f8f9fa] text-[#1a1a1a]' : 'bg-[#0b0b0c] text-[#f0f0f0]'}`}>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-6xl pointer-events-none">
        <div className={`${isLight ? 'bg-white/90 border-gray-200 shadow-xl' : 'bg-[#080808]/95 border-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.8)]'} backdrop-blur-2xl rounded-full px-8 py-3 flex items-center justify-between pointer-events-auto border`}>
          
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => handleNewChat()}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:rotate-6 ${isLight ? 'bg-black shadow-lg shadow-black/10' : 'bg-white shadow-lg shadow-white/5'}`}>
               <div className={`w-3.5 h-3.5 rounded-full ${isLight ? 'bg-white' : 'bg-black'}`} />
            </div>
            <span className={`text-2xl font-black tracking-tighter ${isLight ? 'text-black' : 'text-white'}`}>DOT</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <div className="relative">
              <button 
                onClick={() => setIsModesOpen(!isModesOpen)}
                onBlur={() => setTimeout(() => setIsModesOpen(false), 200)}
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-indigo-500 transition-colors"
              >
                Intelligence Mode
                <svg className={`w-3 h-3 transition-transform duration-300 ${isModesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isModesOpen && (
                <div className={`absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 rounded-3xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-300 border ${isLight ? 'bg-white border-gray-100' : 'bg-[#1a1a1e] border-white/5'}`}>
                  <button onClick={() => setMode(AppMode.CHAT)} className={`w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${mode === AppMode.CHAT ? (isLight ? 'bg-black text-white' : 'bg-white text-black') : 'text-gray-500 hover:bg-gray-500/5'}`}>CORE</button>
                  <button onClick={() => setMode(AppMode.DEEP_THINK)} className={`w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${mode === AppMode.DEEP_THINK ? (isLight ? 'bg-black text-white' : 'bg-white text-black') : 'text-gray-500 hover:bg-gray-500/5'}`}>DEEP</button>
                  <button onClick={() => setMode(AppMode.VOICE)} className={`w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${mode === AppMode.VOICE ? (isLight ? 'bg-black text-white' : 'bg-white text-black') : 'text-gray-500 hover:bg-gray-500/5'}`}>VOICE</button>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                onBlur={() => setTimeout(() => setIsHistoryOpen(false), 200)}
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-indigo-500 transition-colors"
              >
                History
                <svg className={`w-3 h-3 transition-transform duration-300 ${isHistoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isHistoryOpen && (
                <div className={`absolute top-full mt-4 left-1/2 -translate-x-1/2 w-72 rounded-3xl shadow-2xl p-3 animate-in fade-in slide-in-from-top-2 duration-300 border ${isLight ? 'bg-white border-gray-100' : 'bg-[#1a1a1e] border-white/5'}`}>
                  <div className="max-h-80 overflow-y-auto space-y-1 pr-1 scrollbar-hide">
                    {sessions.map(s => (
                      <button 
                        key={s.id}
                        onClick={() => { setCurrentSessionId(s.id); setIsHistoryOpen(false); }}
                        className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold truncate transition-all ${currentSessionId === s.id ? 'bg-indigo-500/10 text-indigo-500' : 'text-gray-500 hover:bg-gray-500/5'}`}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                  <div className={`border-t mt-2 pt-2 ${isLight ? 'border-gray-50' : 'border-white/5'}`}>
                    <button onClick={handleNewChat} className={`w-full flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${isLight ? 'text-black hover:bg-gray-100' : 'text-white hover:bg-white/5'}`}>
                      New directive
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setIsSettingsOpen(true)} className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-indigo-500 transition-colors">Settings</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${isLight ? 'text-gray-400' : 'text-gray-600'}`}>{user.name}</span>
              <img src={user.avatar} className="w-9 h-9 rounded-full border border-white/10 shadow-lg" alt="P" />
            </div>
            <div className={`h-6 w-px ${isLight ? 'bg-gray-200' : 'bg-white/10'}`} />
            <button className="px-5 py-2.5 bg-[#dfff3d] hover:bg-[#cde538] text-black rounded-full text-[10px] font-black tracking-widest transition-all shadow-[0_10px_20px_rgba(223,255,61,0.2)] active:scale-95">
              DOT PRO
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col relative pt-24 overflow-hidden">
        <div className="h-full">
          {mode === AppMode.VOICE ? (
            <VoiceInterface />
          ) : (
            <ChatInterface 
              messages={currentSession?.messages || []}
              setMessages={setMessages}
              mode={mode}
              useSearch={settings.showGrounding}
              user={user}
            />
          )}
        </div>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
};

export default App;
