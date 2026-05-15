import React, { useState, useEffect } from 'react';
import {
  Wand2,
  FileEdit,
  Loader2,
  ChevronRight,
  Type,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export default function Script({ context, onNext }) {
  const [videoType, setVideoType] = useState('reel');
  const [mode, setMode] = useState('generate');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (context && !script && mode === 'generate') {
      // Auto-populate if research was done
    }
  }, [context]);

  const generateScript = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          context: context?.map(s => s.title).join('\n') || 'General AI trends',
          video_type: videoType
        })
      });
      const data = await response.json();
      if (data.script) setScript(data.script);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Create Your Script</h1>
          <p className="text-slate-400 mt-2">The script is the foundation of your video consistency.</p>
        </div>

        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button onClick={() => setVideoType('reel')} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", videoType === 'reel' ? "bg-blue-600 text-white" : "text-slate-400")}>Reel</button>
          <button onClick={() => setVideoType('long')} className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", videoType === 'long' ? "bg-blue-600 text-white" : "text-slate-400")}>Long Form</button>
        </div>
      </header>

      {context && (
        <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
          <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400">Research context found! AI will use {context.length} selected sources to maintain factual consistency.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <button onClick={() => setMode('generate')} className={cn("w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left", mode === 'generate' ? "bg-blue-900/20 border-blue-500/50 text-white" : "bg-slate-800 border-slate-700 text-slate-400")}>
            <Wand2 size={20} />
            <div><p className="font-semibold text-sm">AI Generator</p><p className="text-xs opacity-70">Consistent with research</p></div>
          </button>
          <button onClick={() => setMode('paste')} className={cn("w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left", mode === 'paste' ? "bg-blue-900/20 border-blue-500/50 text-white" : "bg-slate-800 border-slate-700 text-slate-400")}>
            <FileEdit size={20} />
            <div><p className="font-semibold text-sm">Manual Paste</p><p className="text-xs opacity-70">Custom writing</p></div>
          </button>
          {mode === 'generate' && (
            <button onClick={generateScript} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
              Generate Script
            </button>
          )}
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
             <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Script content..."
              className="w-full h-[500px] bg-transparent p-8 text-slate-200 text-lg leading-relaxed focus:outline-none resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button onClick={() => onNext(script)} disabled={!script} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all">
              Finalize & Next <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
