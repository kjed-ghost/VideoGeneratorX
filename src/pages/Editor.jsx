import React, { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Save,
  ChevronRight,
  ShieldCheck,
  ClipboardCheck,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Editor({ project, onNext }) {
  const [loading, setLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [notes, setNotes] = useState('');

  const script = project?.data?.script || '';
  const videoPrompt = project?.data?.video?.prompt || '';

  const runAIReview = () => {
    setLoading(true);
    // In a real app, this would call an API to compare script vs prompt
    setTimeout(() => {
      const issues = [];
      if (videoPrompt.length < 50) issues.push({ label: 'Prompt Depth', status: 'warning', detail: 'Video prompt seems a bit short for the script length.' });
      else issues.push({ label: 'Prompt Depth', status: 'pass', detail: 'Prompt is sufficiently detailed.' });

      if (script.includes('AI') && !videoPrompt.toLowerCase().includes('ai')) {
         issues.push({ label: 'Theme Match', status: 'warning', detail: 'Script mentions AI but prompt doesn\'t specify AI visuals.' });
      } else {
         issues.push({ label: 'Theme Match', status: 'pass', detail: 'Visual themes align with script content.' });
      }

      issues.push({ label: 'Tone Consistency', status: 'pass', detail: 'Matching selected visual style.' });

      setReviewResult(issues);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4">
      <header>
        <h1 className="text-3xl font-bold text-white">Consistency Review</h1>
        <p className="text-slate-400 mt-2">AI-driven analysis to ensure your visuals and script are perfectly synced.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase mb-4">Script vs. Visual Prompt</h3>
            <div className="grid grid-cols-2 gap-4 h-64">
               <div className="bg-slate-950 p-4 rounded-xl overflow-y-auto text-xs text-slate-400 border border-slate-800">
                  <p className="font-bold text-blue-400 mb-2 uppercase tracking-tighter">Script Source</p>
                  {script}
               </div>
               <div className="bg-slate-950 p-4 rounded-xl overflow-y-auto text-xs text-slate-400 border border-slate-800">
                  <p className="font-bold text-indigo-400 mb-2 uppercase tracking-tighter">Video Prompt</p>
                  {videoPrompt}
               </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MessageSquare size={16} />
              Refinement Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes for the final publish step..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 text-sm h-32 outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-700/30">
              <h3 className="font-bold text-white flex items-center gap-2">
                <ShieldCheck size={20} className="text-green-400" />
                Consistency Report
              </h3>
            </div>

            <div className="p-6">
              {reviewResult ? (
                <div className="space-y-4">
                  {reviewResult.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2">
                        {item.status === 'pass' ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <AlertTriangle size={16} className="text-yellow-500" />
                        )}
                        <span className="text-sm font-medium text-slate-200">{item.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 pl-6 leading-tight">{item.detail}</p>
                    </div>
                  ))}
                  <button onClick={() => setReviewResult(null)} className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-xs text-slate-400 hover:text-white transition-colors border border-dashed border-slate-700 rounded-lg">
                    <RefreshCw size={12} />
                    Re-run Scan
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <p className="text-sm text-slate-500">Scan for potential mismatches between your script and AI visuals.</p>
                  <button onClick={runAIReview} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 flex items-center gap-2 mx-auto">
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Start Review
                  </button>
                </div>
              )}
            </div>
          </div>

          <button onClick={() => onNext({ notes })} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-xl flex items-center justify-center gap-2">
             Approve & Continue <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
