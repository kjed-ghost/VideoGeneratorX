import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  Loader2,
  ChevronRight,
  Presentation,
  Clapperboard,
  MonitorPlay
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export default function VideoStep({ script, onNext }) {
  const [loading, setLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('explainer');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);

  const generatePrompt = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/generate-script', { // Reusing for prompt gen logic
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({
          context: `Generate a ${selectedStyle} video generation prompt based on this script: ${script.substring(0, 500)}. Output only the prompt.`,
          video_type: 'video_prompt'
        })
      });
      const data = await response.json();
      if (data.script) setVideoPrompt(data.script);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateVideo = async () => {
    setLoading(true);
    // Call video gen API
    setTimeout(() => {
      setVideoUrl('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4');
      setLoading(false);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4">
      <header>
        <h1 className="text-3xl font-bold text-white">Visual Consistency</h1>
        <p className="text-slate-400 mt-2">Generate visuals that strictly match your script's tone and message.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {['explainer', 'kinetic', 'cartoon'].map(s => (
            <button key={s} onClick={() => setSelectedStyle(s)} className={cn("w-full p-4 rounded-xl border text-left capitalize", selectedStyle === s ? "bg-blue-900/20 border-blue-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400")}>
              {s} Style
            </button>
          ))}
          <button onClick={generatePrompt} disabled={loading || !script} className="w-full bg-slate-800 text-white py-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-700 transition-all">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="text-yellow-400" />}
            Generate Prompt
          </button>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <label className="text-sm font-medium text-slate-300">Consistency-Locked Prompt</label>
            <textarea
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              className="w-full mt-3 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-200 text-sm h-24"
            />
          </div>

          <div className="aspect-video bg-slate-900 rounded-2xl border border-slate-700 flex items-center justify-center overflow-hidden">
            {videoUrl ? (
              <video src={videoUrl} controls className="w-full h-full object-cover" />
            ) : (
              <button onClick={generateVideo} disabled={!videoPrompt || loading} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <Clapperboard />}
                Generate Video
              </button>
            )}
          </div>

          <div className="flex justify-end">
             <button onClick={() => onNext({ videoUrl, prompt: videoPrompt })} disabled={!videoUrl} className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">
                Continue to Review <ChevronRight />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
