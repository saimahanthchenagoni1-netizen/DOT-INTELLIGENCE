
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getGeminiClient, encode, decode, decodeAudioData } from '../services/gemini.ts';
import { LiveServerMessage, Modality } from '@google/genai';

const VoiceInterface: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState('Tap to start conversation');
  const [transcription, setTranscription] = useState('');

  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const startSession = async () => {
    setIsConnecting(true);
    setStatus('Initializing session...');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ai = getGeminiClient();

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('Listening...');
            setIsConnecting(false);
            setIsActive(true);

            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live Error:', e);
            setStatus('Connection Error');
            stopSession();
          },
          onclose: () => {
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          systemInstruction: 'You are a helpful and conversational AI. Keep your answers brief for a natural voice flow.',
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
      setStatus('Access Denied');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
    }
    audioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    setIsActive(false);
    setStatus('Tap to start conversation');
    setTranscription('');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0d0d0d] to-[#050505]">
      <div className="relative mb-12">
        {isActive && (
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl animate-pulse scale-150" />
        )}
        <button
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl border ${
            isActive 
              ? 'bg-indigo-600 border-indigo-400 scale-105' 
              : isConnecting 
                ? 'bg-[#1a1a1a] border-[#333] cursor-wait' 
                : 'bg-[#151515] border-[#262626] hover:bg-[#1f1f1f] hover:border-[#444]'
          }`}
        >
          {isConnecting ? (
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          ) : isActive ? (
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM7 12a1 1 0 0 0-2 0 7.008 7.008 0 0 0 6 6.917V21a1 1 0 0 0 2 0v-2.083A7.008 7.008 0 0 0 19 12a1 1 0 0 0-2 0 5 5 0 0 1-10 0z"/></svg>
          ) : (
            <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          )}
        </button>
      </div>

      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          {status}
        </h2>
        {isActive && (
          <div className="min-h-[60px] p-4 bg-[#111] border border-[#222] rounded-2xl">
            <p className="text-sm text-gray-400 line-clamp-3 italic">
              {transcription || "Listening for your voice..."}
            </p>
          </div>
        )}
        <p className="text-xs text-gray-500 font-medium uppercase tracking-[0.2em]">
          Powered by Gemini 2.5 Native Audio
        </p>
      </div>
    </div>
  );
};

export default VoiceInterface;
