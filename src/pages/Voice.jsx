import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Play,
  Square,
  Volume2,
  Loader2,
  ChevronRight,
  Headphones,
  Music,
  Activity
} from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import { cn } from '../lib/utils';

export default function Voice({ onNext }) {
  const [loading, setLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('kokoro');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  const voices = [
    { id: 'kokoro', name: 'Kokoro v0.1 (Free)', provider: 'HuggingFace' },
    { id: 'eleven-adam', name: 'Adam', provider: 'ElevenLabs' },
    { id: 'eleven-bella', name: 'Bella', provider: 'ElevenLabs' },
    { id: 'playht-james', name: 'James', provider: 'Play.ht' },
  ];

  useEffect(() => {
    if (waveformRef.current && audioUrl) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#475569',
        progressColor: '#3b82f6',
        cursorColor: '#3b82f6',
        barWidth: 2,
        barRadius: 3,
        responsive: true,
        height: 80,
      });

      wavesurfer.current.load(audioUrl);
      wavesurfer.current.on('finish', () => setIsPlaying(false));

      return () => wavesurfer.current.destroy();
    }
  }, [audioUrl]);

  const generatePreview = () => {
    setLoading(true);
    // Simulate generation
    setTimeout(() => {
      setAudioUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      setLoading(false);
    }, 2000);
  };

  const togglePlay = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white">Voice & Audio</h1>
        <p className="text-slate-400 mt-2">Select a voice and generate the voiceover for your script.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Mic size={20} className="text-blue-400" />
              Available Voices
            </h3>
            <div className="space-y-2">
              {voices.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                    selectedVoice === voice.id
                      ? "bg-blue-900/20 border-blue-500/50 text-white"
                      : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      selectedVoice === voice.id ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-500"
                    )}>
                      <Volume2 size={16} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">{voice.name}</p>
                      <p className="text-[10px] opacity-70">{voice.provider}</p>
                    </div>
                  </div>
                  {selectedVoice === voice.id && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-slate-500">Speed (1.0x)</label>
                <input type="range" className="w-full accent-blue-500" min="0.5" max="2.0" step="0.1" defaultValue="1.0" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500">Stability</label>
                <input type="range" className="w-full accent-blue-500" min="0" max="100" defaultValue="50" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 flex flex-col items-center justify-center min-h-[300px]">
            {audioUrl ? (
              <div className="w-full space-y-8">
                <div className="flex items-center justify-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse">
                    <Music size={40} className="text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div ref={waveformRef} className="w-full" />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0:00</span>
                    <span>1:24</span>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Square size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto text-slate-500">
                  <Headphones size={32} />
                </div>
                <div className="max-w-xs mx-auto">
                  <h4 className="text-white font-semibold">Generate Voiceover</h4>
                  <p className="text-sm text-slate-500 mt-2">Generate a preview of the first paragraph using the selected voice.</p>
                </div>
                <button
                  onClick={generatePreview}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Activity size={20} />}
                  Generate Preview
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onNext}
              disabled={!audioUrl}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
            >
              Generate Full Audio & Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
