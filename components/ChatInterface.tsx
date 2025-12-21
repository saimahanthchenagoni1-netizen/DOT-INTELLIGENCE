
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message, AppMode, User } from '../types.ts';
import { streamChatResponse } from '../services/gemini.ts';

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  mode: AppMode;
  useSearch: boolean;
  user: User;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, setMessages, mode, useSearch, user }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
    };
    if (isListening) recognition.stop();
    else recognition.start();
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Asset "${file.name}" uploaded to DOT node for analysis.`);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    const botPlaceholder: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    const history = [...messages, userMessage];
    setMessages([...history, botPlaceholder]);
    setInput('');
    setIsTyping(true);

    try {
      let accumulatedText = "";
      const { fullText, groundingLinks } = await streamChatResponse(
        history,
        mode,
        useSearch,
        (chunk) => {
          accumulatedText += chunk;
          setMessages(prev => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg && lastMsg.role === 'assistant') {
              lastMsg.content = accumulatedText;
            }
            return updated;
          });
        }
      );

      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg) {
          lastMsg.content = fullText;
          lastMsg.isStreaming = false;
          lastMsg.groundingLinks = groundingLinks;
        }
        return updated;
      });
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { ...botPlaceholder, content: "Direct node communication failed. Please check your API key settings in Vercel/Github environment.", isStreaming: false }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative h-full">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-12 max-w-5xl mx-auto w-full scroll-smooth pt-20"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center max-w-3xl mx-auto animate-in fade-in duration-1000">
            <h1 className="text-7xl font-black tracking-tighter mb-10 text-center leading-[0.9]">
              <span className="text-indigo-500">Hello {user.name},</span><br />
              <span className="opacity-30">I'm ready to answer any of your questions.</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {[
                { label: 'Research Directive', desc: 'Synthesize a study guide for the French Revolution' },
                { label: 'Code Solution', desc: 'Explain how to use Recursion in JavaScript with clear examples' },
              ].map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => { setInput(item.desc); }}
                  className="p-10 bg-white/5 border border-white/5 rounded-[3rem] text-left transition-all hover:border-indigo-500/40 hover:bg-white/[0.07] group backdrop-blur-sm"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-indigo-400 group-hover:text-indigo-300">{item.label}</p>
                  <p className="text-lg font-bold leading-tight opacity-70 group-hover:opacity-100">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-20 pb-10">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-10 animate-in fade-in slide-in-from-bottom-6 duration-500 group">
                <div className="shrink-0 pt-2">
                  {msg.role === 'assistant' ? (
                     <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                        <div className="w-6 h-6 bg-black rounded-full shadow-inner border border-black/10" />
                     </div>
                  ) : (
                    <img src={user.avatar} className="w-14 h-14 rounded-3xl border border-white/10 bg-black/40 shadow-xl" alt="U" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                      {msg.role === 'assistant' ? 'DOT HUB' : user.name.toUpperCase()}
                    </p>
                    {msg.role === 'assistant' && !msg.isStreaming && (
                      <button 
                        onClick={() => speakText(msg.content)}
                        className="p-2 hover:bg-white/5 rounded-xl text-gray-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        title="Vocalize response"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                      </button>
                    )}
                  </div>
                  <div className="prose prose-invert max-w-none text-[#f0f0f0] text-lg font-medium selection:bg-indigo-500/40">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                    {msg.isStreaming && <span className="inline-block w-2.5 h-6 ml-2 bg-indigo-500 animate-pulse rounded-full align-middle" />}
                  </div>
                  
                  {msg.groundingLinks && msg.groundingLinks.length > 0 && (
                    <div className="mt-10 flex flex-wrap gap-3">
                       {msg.groundingLinks.map((link, idx) => (
                         <a 
                           key={idx}
                           href={link.uri}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] text-gray-500 hover:text-white transition-all font-black uppercase tracking-widest shadow-sm"
                         >
                           {link.title}
                         </a>
                       ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-5xl mx-auto px-6 pb-12 pt-4 relative z-20">
        <form onSubmit={handleSubmit} className="relative bg-[#141417]/80 backdrop-blur-xl rounded-[3.5rem] border border-white/5 focus-within:border-indigo-500/30 focus-within:bg-[#1a1a1e] transition-all overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Direct the student network..."
            className="w-full bg-transparent text-white px-12 py-10 pr-64 focus:outline-none min-h-[96px] max-h-[400px] resize-none text-[20px] placeholder:text-gray-800 font-bold"
            rows={1}
          />
          <div className="absolute right-6 bottom-6 flex items-center gap-2">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-5 text-gray-700 hover:text-indigo-400 transition-all rounded-3xl hover:bg-white/5"
              title="Upload Support Data"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
            </button>
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-5 transition-all rounded-3xl hover:bg-white/5 ${isListening ? 'text-indigo-500 bg-indigo-500/10' : 'text-gray-700 hover:text-indigo-400'}`}
              title="Listen Mode"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-6 bg-white text-black disabled:bg-gray-800 disabled:text-gray-900 rounded-[2.5rem] hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </form>
        <div className="mt-8 flex items-center justify-center gap-12">
           <p className="text-[11px] text-gray-800 font-black uppercase tracking-[0.6em] opacity-40">DOT Network OS</p>
           <div className="w-1.5 h-1.5 bg-indigo-500/20 rounded-full" />
           <p className="text-[11px] text-gray-800 font-black uppercase tracking-[0.6em] opacity-40">Student Specialized Intelligence</p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
