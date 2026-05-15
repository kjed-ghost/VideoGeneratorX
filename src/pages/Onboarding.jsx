import React, { useState } from 'react';
import {
  ArrowRight,
  Key,
  User,
  Shield,
  Rocket,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Video,
  Mic
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { encrypt } from '../lib/crypto';
import { cn } from '../lib/utils';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState({});

  const steps = [
    { id: 1, title: 'Profile Setup', icon: User, description: 'Basic account information' },
    { id: 2, title: 'AI Brain', icon: Sparkles, description: 'Connect Gemini or Groq' },
    { id: 3, title: 'Voice & Media', icon: Mic, description: 'Connect ElevenLabs or HuggingFace' },
    { id: 4, title: 'Video Engine', icon: Video, description: 'Connect Luma AI or Pika' },
  ];

  const updateKey = (k, v) => setKeys({...keys, [k]: v});

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      const encryptedKeys = {};
      Object.keys(keys).forEach(k => {
        encryptedKeys[k] = encrypt(keys[k]);
      });

      await supabase
        .from('profiles')
        .update({ api_keys: encryptedKeys })
        .eq('id', user.id);

      setLoading(false);
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar Progress */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 p-10 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-10">Welcome to ContentFlow</h2>
          <div className="space-y-8">
            {steps.map((s) => (
              <div key={s.id} className="flex gap-4 items-start">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all",
                  step === s.id ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" :
                  step > s.id ? "bg-green-600/20 border-green-500/50 text-green-500" :
                  "bg-slate-800 border-slate-700 text-slate-500"
                )}>
                  {step > s.id ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
                </div>
                <div>
                  <p className={cn("font-bold text-sm", step === s.id ? "text-white" : "text-slate-500")}>{s.title}</p>
                  <p className="text-xs text-slate-600">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800">
          <Shield size={24} className="text-blue-400 mb-3" />
          <p className="text-xs text-slate-400 leading-relaxed">
            Your API keys are encrypted locally and never stored in plain text. We only use them to perform actions on your behalf.
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-20">
        <div className="max-w-xl w-full">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-4xl font-bold text-white">Let's set up your profile</h1>
              <p className="text-slate-400 text-lg">We need a few details to customize your automation experience.</p>
              <div className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Display Name</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Content Niche</label>
                  <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>Tech & AI</option>
                    <option>Productivity</option>
                    <option>Education</option>
                    <option>Entertainment</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-4xl font-bold text-white">The AI Brain</h1>
              <p className="text-slate-400 text-lg">ContentFlow uses Google Gemini or Groq to write scripts. Both have excellent free tiers.</p>

              <div className="space-y-6 pt-6">
                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white flex items-center gap-2">Google Gemini</span>
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-400 text-xs flex items-center gap-1">Get free key <ExternalLink size={12}/></a>
                    </div>
                    <input
                      type="password"
                      onChange={(e) => updateKey('gemini_api_key', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white"
                      placeholder="Enter Gemini API Key"
                    />
                 </div>

                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white flex items-center gap-2">Groq Cloud</span>
                      <a href="https://console.groq.com" target="_blank" className="text-blue-400 text-xs flex items-center gap-1">Get key <ExternalLink size={12}/></a>
                    </div>
                    <input
                      type="password"
                      onChange={(e) => updateKey('groq_api_key', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white"
                      placeholder="Enter Groq API Key (Optional)"
                    />
                 </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-4xl font-bold text-white">Voice & Media</h1>
              <p className="text-slate-400 text-lg">HuggingFace is required for the free Kokoro TTS voice engine.</p>

              <div className="space-y-6 pt-6">
                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white flex items-center gap-2">HuggingFace Token</span>
                      <a href="https://huggingface.co/settings/tokens" target="_blank" className="text-blue-400 text-xs flex items-center gap-1">Create token <ExternalLink size={12}/></a>
                    </div>
                    <input
                      type="password"
                      onChange={(e) => updateKey('huggingface_token', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white"
                      placeholder="Enter HF Access Token"
                    />
                 </div>

                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white flex items-center gap-2">ElevenLabs</span>
                      <a href="https://elevenlabs.io" target="_blank" className="text-blue-400 text-xs flex items-center gap-1">Get key <ExternalLink size={12}/></a>
                    </div>
                    <input
                      type="password"
                      onChange={(e) => updateKey('elevenlabs_api_key', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white"
                      placeholder="ElevenLabs API Key (Optional)"
                    />
                 </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                <Rocket size={40} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">Ready for Launch!</h1>
              <p className="text-slate-400 text-lg">Your profile is configured. You can start creating automated video content now.</p>

              <div className="pt-10 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-left">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Luma AI (Video)</span>
                    <a href="https://lumalabs.ai/dream-machine/api" target="_blank" className="text-blue-400 text-xs flex items-center gap-1">Get key <ExternalLink size={12}/></a>
                  </div>
                  <input
                    type="password"
                    onChange={(e) => updateKey('luma_api_key', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white"
                    placeholder="Enter Luma AI Key"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-between items-center">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="text-slate-500 hover:text-white disabled:opacity-0"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-blue-900/20"
            >
              {loading ? 'Finalizing...' : step === 4 ? 'Complete Setup' : 'Continue'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
