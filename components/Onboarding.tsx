
import React, { useState } from 'react';
import { User } from '../types';

interface OnboardingProps {
  onComplete: (user: User) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [useCase, setUseCase] = useState('');
  const [source, setSource] = useState('');
  const [otherUseCase, setOtherUseCase] = useState('');
  const [otherSource, setOtherSource] = useState('');

  const nextStep = () => setStep(step + 1);

  const handleFinish = (pro: boolean) => {
    onComplete({
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'Student',
      onboarded: true,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name || 'Student'}&backgroundColor=000000`
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Welcome to DOT</h2>
              <p className="text-gray-500 font-medium">What is your username?</p>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type username here..."
              className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-xl text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-700 font-bold text-center"
              onKeyDown={(e) => e.key === 'Enter' && name && nextStep()}
              autoFocus
            />
            <button
              onClick={nextStep}
              disabled={!name}
              className="w-full py-6 bg-white text-black rounded-3xl font-black tracking-widest text-sm hover:bg-gray-200 transition-all disabled:opacity-30"
            >
              INITIALIZE
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Usage Intent</h2>
              <p className="text-gray-500 font-medium">How will DOT help you today?</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {['Homework Help', 'Complex Research', 'Exam Preparation', 'Creative Project', 'Other'].map((item) => (
                <button
                  key={item}
                  onClick={() => { setUseCase(item); if (item !== 'Other') nextStep(); }}
                  className={`w-full text-left px-8 py-5 rounded-3xl font-bold transition-all border ${useCase === item ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20'}`}
                >
                  {item}
                </button>
              ))}
            </div>
            {useCase === 'Other' && (
              <div className="space-y-4 pt-2">
                <input
                  type="text"
                  value={otherUseCase}
                  onChange={(e) => setOtherUseCase(e.target.value)}
                  placeholder="Tell us what you'd like to do..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all"
                  autoFocus
                />
                <button onClick={nextStep} disabled={!otherUseCase} className="w-full py-4 bg-white/10 text-white rounded-2xl font-bold text-xs tracking-widest">CONTINUE</button>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Discovery Hub</h2>
              <p className="text-gray-500 font-medium">Where did you find DOT AI?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['YouTube', 'Twitter / X', 'Instagram', 'Google Ads', 'Facebook Ads', 'By a Friend', 'Other'].map((item) => (
                <button
                  key={item}
                  onClick={() => { setSource(item); if (item !== 'Other') nextStep(); }}
                  className={`text-center px-4 py-5 rounded-3xl font-bold transition-all border text-sm ${source === item ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20'}`}
                >
                  {item}
                </button>
              ))}
            </div>
            {source === 'Other' && (
              <div className="space-y-4 pt-2">
                <input
                  type="text"
                  value={otherSource}
                  onChange={(e) => setOtherSource(e.target.value)}
                  placeholder="Specify random source..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/30 transition-all"
                  autoFocus
                />
                <button onClick={nextStep} disabled={!otherSource} className="w-full py-4 bg-white/10 text-white rounded-2xl font-bold text-xs tracking-widest">CONTINUE</button>
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#dfff3d] rounded-2xl mx-auto mb-6 flex items-center justify-center">
                 <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Elevate Learning</h2>
              <p className="text-gray-500 font-medium px-4">Join DOT Pro for priority academic reasoning models.</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleFinish(true)}
                className="w-full py-6 bg-[#dfff3d] text-black rounded-3xl font-black tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(223,255,61,0.2)]"
              >
                JOIN PRO NETWORK
              </button>
              <button
                onClick={() => handleFinish(false)}
                className="w-full py-6 bg-white/5 text-gray-400 rounded-3xl font-black tracking-widest text-sm hover:text-white transition-all"
              >
                NAH, I'LL USE FREE VERSION
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#0b0b0c] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#141417] border border-white/[0.03] rounded-[3rem] p-10 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <div 
            className="h-full bg-white transition-all duration-500 ease-out" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
