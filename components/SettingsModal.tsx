
import React from 'react';
import { AppSettings } from '../types.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
  onClearHistory: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings, onClearHistory }) => {
  if (!isOpen) return null;

  const Toggle = ({ active, onClick, label, sub }: { active: boolean, onClick: () => void, label: string, sub: string }) => (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold transition-colors">{label}</p>
        <p className="text-[11px] text-gray-500 font-medium">{sub}</p>
      </div>
      <button 
        onClick={onClick}
        className={`w-12 h-7 rounded-full relative transition-all duration-300 ${active ? 'bg-indigo-500' : 'bg-gray-700/50'}`}
      >
        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${active ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#141417] border border-white/5 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-8 border-b border-white/5">
          <div>
            <h2 className="text-2xl font-black tracking-tighter">System Settings</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Environment Control</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
          <section className="space-y-6">
            <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Experience</h3>
            
            <Toggle 
              label="Theme" 
              sub={settings.theme === 'dark' ? "Dark (Optimized)" : "Light (Bright)"} 
              active={settings.theme === 'light'} 
              onClick={() => onUpdateSettings({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' })} 
            />

            <Toggle 
              label="Snow Effect" 
              sub="Gentle atmospheric snowfall" 
              active={settings.snowEnabled} 
              onClick={() => onUpdateSettings({ ...settings, snowEnabled: !settings.snowEnabled })} 
            />

            <Toggle 
              label="Custom Cursor" 
              sub="Premium dot following mouse" 
              active={settings.customCursorEnabled} 
              onClick={() => onUpdateSettings({ ...settings, customCursorEnabled: !settings.customCursorEnabled })} 
            />
          </section>

          <section className="space-y-6">
            <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Intelligence</h3>
            
            <Toggle 
              label="Priority Reasoning" 
              sub="Use advanced models for complex tasks" 
              active={settings.modelQuality === 'high'} 
              onClick={() => onUpdateSettings({ ...settings, modelQuality: settings.modelQuality === 'high' ? 'fast' : 'high' })} 
            />

            <Toggle 
              label="Grounding" 
              sub="Show live search citations" 
              active={settings.showGrounding} 
              onClick={() => onUpdateSettings({ ...settings, showGrounding: !settings.showGrounding })} 
            />
          </section>

          <section className="space-y-4 pt-4">
            <h3 className="text-[10px] font-black text-red-900 uppercase tracking-[0.3em]">Maintenance</h3>
            <button 
              onClick={() => { if(confirm('Wipe cognitive history?')) onClearHistory(); }}
              className="w-full flex items-center justify-between p-5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-3xl transition-all group"
            >
              <span className="text-sm font-black text-red-500">Purge History</span>
              <svg className="w-4 h-4 text-red-500 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </section>
        </div>

        <div className="p-8 bg-black/20 flex justify-end">
          <button onClick={onClose} className="px-10 py-4 bg-white text-black rounded-full text-xs font-black tracking-widest hover:scale-105 transition-all shadow-xl">
            SAVE CONFIG
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
