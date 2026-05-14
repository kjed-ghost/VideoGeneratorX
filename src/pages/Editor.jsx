import React, { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Save,
  ChevronRight,
  ShieldCheck,
  ClipboardCheck,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Editor({ onNext }) {
  const [loading, setLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [notes, setNotes] = useState('');

  const runAIReview = () => {
    setLoading(true);
    setTimeout(() => {
      setReviewResult([
        { id: 1, label: 'Visual Style Consistency', status: 'pass', detail: 'The video maintains the selected explainer style throughout.' },
        { id: 2, label: 'Script Sync', status: 'warning', detail: 'Segment at 0:45 might be slightly longer than the visual.' },
        { id: 3, label: 'Audio Quality', status: 'pass', detail: 'Voiceover is clear and well-balanced.' },
        { id: 4, label: 'Pacing', status: 'pass', detail: 'Good flow between points.' }
      ]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white">AI Editor & Review</h1>
        <p className="text-slate-400 mt-2">Final review of your generated content before publishing.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden aspect-video relative flex items-center justify-center">
             <div className="text-slate-600 text-center">
               <ShieldCheck size={64} className="mx-auto mb-4 opacity-20" />
               <p>Main Video Preview</p>
             </div>
             {/* In a real app, the video element from the previous step would be here */}
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MessageSquare size={16} />
              Manual Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any final instructions or notes for the automation pipeline..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 h-32 resize-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-700/30">
              <h3 className="font-bold text-white flex items-center gap-2">
                <ClipboardCheck size={20} className="text-blue-400" />
                AI Content Review
              </h3>
            </div>

            <div className="p-6">
              {reviewResult ? (
                <div className="space-y-4">
                  {reviewResult.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        {item.status === 'pass' ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <AlertTriangle size={16} className="text-yellow-500" />
                        )}
                        <span className="text-sm font-medium text-slate-200">{item.label}</span>
                      </div>
                      <p className="text-xs text-slate-500 pl-6">{item.detail}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => setReviewResult(null)}
                    className="w-full mt-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Re-run Analysis
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <p className="text-sm text-slate-500">Run AI analysis to check for consistency and issues.</p>
                  <button
                    onClick={runAIReview}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 flex items-center gap-2 mx-auto"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Start AI Review
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 rounded-2xl text-white shadow-xl">
            <h4 className="font-bold mb-2">Final Step</h4>
            <p className="text-sm text-green-100 mb-6">
              Content looks great! Proceed to publish your video or trigger automation.
            </p>
            <button
              onClick={onNext}
              className="w-full bg-white text-emerald-700 font-bold py-3 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Approve & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
