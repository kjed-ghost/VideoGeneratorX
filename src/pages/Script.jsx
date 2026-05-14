import React, { useState } from 'react';
import {
  Wand2,
  FileEdit,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Type
} from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

export default function Script({ onNext }) {
  const [videoType, setVideoType] = useState('reel'); // 'reel' or 'long'
  const [mode, setMode] = useState('generate'); // 'generate' or 'paste'
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);

  const generateScript = async () => {
    setLoading(true);
    // Simulation for now - will be connected to API later
    setTimeout(() => {
      const dummyScript = `# Video Title: The Future of ${videoType === 'reel' ? 'Short-form' : 'Automation'} Content

## [00:00 - 00:05] Hook
Did you know that AI is revolutionizing how we create videos?

## [00:05 - 00:30] Context
Based on our research, the trends are shifting towards hyper-personalized content.

## [00:30 - 00:55] Insight
By using tools like ContentFlow, you can automate your entire workflow.

## [00:55 - 01:00] CTA
Click the link in bio to learn more!`;
      setScript(dummyScript);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Create Your Script</h1>
          <p className="text-slate-400 mt-2">Generate a script with AI using your research or paste your own.</p>
        </div>

        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setVideoType('reel')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              videoType === 'reel' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
            )}
          >
            Reel / Short
          </button>
          <button
            onClick={() => setVideoType('long')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              videoType === 'long' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
            )}
          >
            Long Form
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <button
            onClick={() => setMode('generate')}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
              mode === 'generate' ? "bg-blue-900/20 border-blue-500/50 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
            )}
          >
            <Wand2 size={20} className={mode === 'generate' ? "text-blue-400" : ""} />
            <div>
              <p className="font-semibold text-sm">AI Generator</p>
              <p className="text-xs opacity-70">Based on context</p>
            </div>
          </button>

          <button
            onClick={() => setMode('paste')}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
              mode === 'paste' ? "bg-blue-900/20 border-blue-500/50 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
            )}
          >
            <FileEdit size={20} className={mode === 'paste' ? "text-blue-400" : ""} />
            <div>
              <p className="font-semibold text-sm">Manual Paste</p>
              <p className="text-xs opacity-70">Write your own</p>
            </div>
          </button>

          {mode === 'generate' && (
            <button
              onClick={generateScript}
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
              Generate with AI
            </button>
          )}
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="bg-slate-700/50 px-6 py-3 border-b border-slate-700 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Type size={14} />
                Script Editor
              </span>
              <span className="text-xs text-slate-500">{script.length} characters</span>
            </div>

            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Your script will appear here or you can write it manually..."
              className="w-full h-[500px] bg-transparent p-8 text-slate-200 text-lg leading-relaxed focus:outline-none resize-none scrollbar-thin scrollbar-thumb-slate-700"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                setIsFinalized(true);
                onNext();
              }}
              disabled={!script || loading}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
            >
              Finalize Script & Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
