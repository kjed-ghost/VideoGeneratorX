import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  Loader2,
  ChevronRight,
  Image as ImageIcon,
  Clapperboard,
  Presentation,
  MonitorPlay,
  UserSquare2
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function VideoStep({ onNext }) {
  const [loading, setLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('explainer');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);

  const styles = [
    { id: 'explainer', name: 'Explainer', icon: Presentation, description: 'Flat 2D animation style' },
    { id: 'kinetic', name: 'Kinetic', icon: MonitorPlay, description: 'Static visuals + Typography' },
    { id: 'cartoon', name: 'Cartoon', icon: UserSquare2, description: 'Clean vector animation' },
    { id: 'avatar', name: 'AI Avatar', icon: Clapperboard, description: 'Talking head style' },
    { id: 'broll', name: 'Documentary', icon: ImageIcon, description: 'Real footage b-roll' },
  ];

  const generatePrompt = () => {
    setLoading(true);
    // Simulate prompt generation
    setTimeout(() => {
      setVideoPrompt(`A cinematic ${selectedStyle} style video about AI automation, featuring clean lines, futuristic interface elements, and high-quality 4k textures.`);
      setLoading(false);
    }, 1500);
  };

  const generateVideo = () => {
    setLoading(true);
    // Simulate video generation
    setTimeout(() => {
      setVideoUrl('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4');
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white">Video Generation</h1>
        <p className="text-slate-400 mt-2">Choose a visual style and generate your video using AI.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">Visual Style</h3>
          <div className="space-y-2">
            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left",
                  selectedStyle === style.id
                    ? "bg-blue-900/20 border-blue-500/50 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  selectedStyle === style.id ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-500"
                )}>
                  <style.icon size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{style.name}</p>
                  <p className="text-[10px] opacity-70 leading-tight">{style.description}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={generatePrompt}
            disabled={loading}
            className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} className="text-yellow-400" />}
            Generate Prompt
          </button>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <label className="text-sm font-medium text-slate-300">Video Generation Prompt</label>
              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="Style-specific prompt will appear here..."
                className="w-full mt-3 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 h-24 resize-none"
              />
            </div>

            <div className="p-8 min-h-[400px] flex items-center justify-center bg-slate-900/50">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  className="max-w-full h-auto rounded-xl shadow-2xl border border-slate-700"
                />
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600 border border-slate-700">
                    <Video size={32} />
                  </div>
                  <p className="text-slate-500 text-sm max-w-xs">Your generated video preview will appear here.</p>
                  <button
                    onClick={generateVideo}
                    disabled={loading || !videoPrompt}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Clapperboard size={20} />}
                    Generate Video
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onNext}
              disabled={!videoUrl}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
            >
              Approve & Open Editor
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
