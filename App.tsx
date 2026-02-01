
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Settings from './components/Settings';
import Flashcards from './components/Flashcards';
import BackgroundEffects from './components/BackgroundEffects';
import { generateFlashcards } from './services/geminiService';
import { User, QuizQuestion, AppSettings, SavedQuiz, SavedFlashcardSet, SavedStudyGuide, Flashcard } from './types';

const GRADES = [
  "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade",
  "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade",
  "11th Grade", "12th Grade", "College Level"
];

const SOURCES = [
  "TikTok", "Instagram", "YouTube", "Twitter / X", "Facebook", "A Friend", "Other"
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('home');
  const [currentContext, setCurrentContext] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string> | null>(null);
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [activeCards, setActiveCards] = useState<Flashcard[]>([]);

  const [savedQuizzes, setSavedQuizzes] = useState<SavedQuiz[]>([]);
  const [savedGuides, setSavedGuides] = useState<SavedStudyGuide[]>([]);

  const [settings, setSettings] = useState<AppSettings>({
    snowEffect: false,
    mouseInteraction: false, 
    themeColor: 'purple' 
  });

  const [onboardingForm, setOnboardingForm] = useState({ 
    name: '', 
    grade: '', 
    source: '' 
  });
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dot_ai_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch (e) { localStorage.removeItem('dot_ai_user'); }
    }
    const sQuizzes = localStorage.getItem('dot_saved_quizzes');
    if (sQuizzes) setSavedQuizzes(JSON.parse(sQuizzes));
    
    const sGuides = localStorage.getItem('dot_saved_guides');
    if (sGuides) setSavedGuides(JSON.parse(sGuides));
  }, []);

  const handleActionRequest = async (type: 'quiz' | 'flashcards', context: string) => {
    setCurrentContext(context);
    if (type === 'quiz') {
      setIsQuizMode(true);
    } else {
      try {
        const cards = await generateFlashcards(context);
        setActiveCards(cards);
        setIsFlashcardMode(true);
      } catch (e) {
        alert("Could not generate flashcards.");
      }
    }
  };

  const handleQuizComplete = (questions: QuizQuestion[], answers: Record<number, string>) => {
    setQuizQuestions(questions);
    setQuizAnswers(answers);
    
    const newQuiz: SavedQuiz = {
      id: Date.now().toString(),
      title: questions[0]?.question.slice(0, 30) + "...",
      date: new Date().toLocaleDateString(),
      score: 0, 
      total: questions.length,
      questions,
      answers
    };
    const updated = [newQuiz, ...savedQuizzes];
    setSavedQuizzes(updated);
    localStorage.setItem('dot_saved_quizzes', JSON.stringify(updated));
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardingForm.grade || !onboardingForm.source) {
      alert("Please select your level and source.");
      return;
    }
    setIsStarting(true);
    setTimeout(() => {
      const newUser = { 
        username: onboardingForm.name, 
        email: onboardingForm.grade 
      };
      setUser(newUser);
      localStorage.setItem('dot_ai_user', JSON.stringify(newUser));
      localStorage.setItem('dot_ai_onboarding', JSON.stringify(onboardingForm));
      setIsStarting(false);
    }, 1200);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-6 font-sans">
        <div className="max-w-lg w-full animate-in fade-in zoom-in duration-1000">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#111] border border-white/5 rounded-[1.5rem] flex items-center justify-center shadow-2xl mx-auto mb-6">
              <div className="dot-logo-circle"></div>
            </div>
            <h1 className="text-6xl font-black text-white mb-2 tracking-tighter">DOT AI</h1>
            <p className="text-gray-500 text-lg uppercase tracking-[0.2em] font-bold">Dream Big</p>
          </div>
          
          <div className="glass-card border border-white/5 p-10 rounded-[3rem] shadow-2xl space-y-8">
            <h2 className="text-2xl font-black text-center text-white">Let's get started</h2>
            
            <form onSubmit={handleOnboardingSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-white/30 transition-all font-bold text-lg" 
                  value={onboardingForm.name} 
                  onChange={e => setOnboardingForm({...onboardingForm, name: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Grade Level</label>
                <select 
                  required
                  className="w-full bg-[#111] border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-white/30 transition-all cursor-pointer font-semibold appearance-none"
                  value={onboardingForm.grade}
                  onChange={e => setOnboardingForm({...onboardingForm, grade: e.target.value})}
                >
                  <option value="" disabled>Choose your level</option>
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Found us via</label>
                <select 
                  required
                  className="w-full bg-[#111] border border-white/10 rounded-2xl p-5 text-white outline-none focus:border-white/30 transition-all cursor-pointer font-semibold appearance-none"
                  value={onboardingForm.source}
                  onChange={e => setOnboardingForm({...onboardingForm, source: e.target.value})}
                >
                  <option value="" disabled>Choose an option</option>
                  {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <button 
                type="submit" 
                disabled={isStarting}
                className="w-full py-6 bg-white text-black font-black rounded-3xl transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 text-lg hover:bg-neutral-200"
              >
                {isStarting ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : 'START JOURNEY'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (activeView === 'settings') return <Settings settings={settings} setSettings={setSettings} />;
    if (activeView === 'quizzes') return (
      <div className="max-w-5xl mx-auto py-20 px-8">
        <h2 className="text-5xl font-black mb-12 text-white">My Quizzes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {savedQuizzes.map(q => (
            <div key={q.id} className="glass-card p-10 rounded-[2.5rem] border-white/5 shadow-xl hover:scale-[1.02] transition-all">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{q.date}</span>
              <h3 className="text-2xl font-bold text-white mt-3">{q.title}</h3>
              <div className="mt-10 flex gap-4">
                <button className="px-8 py-3 bg-white text-black rounded-2xl text-xs font-black">RETAKE</button>
                <button className="px-8 py-3 bg-white/5 text-white rounded-2xl text-xs font-black">RESULTS</button>
              </div>
            </div>
          ))}
          {savedQuizzes.length === 0 && <p className="text-gray-500 py-10">No quizzes taken yet.</p>}
        </div>
      </div>
    );
    if (activeView === 'flashcards' && !isFlashcardMode) return (
       <div className="max-w-5xl mx-auto py-20 px-8">
        <h2 className="text-5xl font-black mb-12 text-white">Flashcards</h2>
        <div className="glass-card rounded-[3rem] p-16 text-center text-gray-500">
          <p className="text-xl mb-8">Ready to test your memory?</p>
          <button onClick={() => setActiveView('home')} className="px-12 py-4 bg-white text-black rounded-2xl font-black">START CHATTING</button>
        </div>
      </div>
    );
    if (isFlashcardMode) return <Flashcards cards={activeCards} onExit={() => setIsFlashcardMode(false)} />;
    if (quizQuestions && quizAnswers) return <Results questions={quizQuestions} answers={quizAnswers} onBackToHome={() => { setQuizQuestions(null); setQuizAnswers(null); setIsQuizMode(false); setActiveView('home'); }} />;
    if (isQuizMode) return <Quiz context={currentContext} onQuizComplete={handleQuizComplete} onExit={() => setIsQuizMode(false)} />;

    return <Home userName={user.username} onContentProcessed={(c, e) => setCurrentContext(c + "\n" + e)} onActionRequest={handleActionRequest} />;
  };

  return (
    <div className="flex bg-black min-h-screen text-white overflow-hidden">
      <BackgroundEffects settings={settings} />
      <Sidebar 
        onNavigate={(v) => { setActiveView(v); setIsQuizMode(false); setIsFlashcardMode(false); setQuizQuestions(null); }} 
        activeView={activeView} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      {/* Adjusted margin to match smaller sidebar */}
      <main className="flex-1 transition-all duration-500 min-h-screen overflow-y-auto relative z-10 ml-20 md:ml-24">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
