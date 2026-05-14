import React, { useState } from 'react';
import {
  Video,
  Camera,
  Send,
  Zap,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Info,
  Share2,
  Webhook
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Publish() {
  const [loading, setLoading] = useState({});
  const [published, setPublished] = useState({});
  const [automationEnabled, setAutomationEnabled] = useState(false);

  const handlePublish = (platform) => {
    setLoading({ ...loading, [platform]: true });
    // Simulate publishing
    setTimeout(() => {
      setLoading({ ...loading, [platform]: false });
      setPublished({ ...published, [platform]: true });
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white">Publish & Automate</h1>
        <p className="text-slate-400 mt-2">Upload your video directly to platforms or trigger custom workflows.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-700/30">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Send size={20} className="text-blue-400" />
                Manual Publishing
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center text-red-500">
                    <Video size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">YouTube</p>
                    <p className="text-xs text-slate-500">Upload as Private Draft</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePublish('youtube')}
                  disabled={loading.youtube || published.youtube}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                    published.youtube
                      ? "bg-green-600/20 text-green-500 border border-green-500/50"
                      : "bg-red-600 hover:bg-red-700 text-white shadow-lg disabled:opacity-50"
                  )}
                >
                  {loading.youtube ? <Loader2 size={16} className="animate-spin" /> : published.youtube ? <CheckCircle2 size={16} /> : null}
                  {published.youtube ? 'Uploaded' : 'Upload Draft'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-900/20 rounded-full flex items-center justify-center text-pink-500">
                    <Camera size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Camera</p>
                    <p className="text-xs text-slate-500">Publish as Reel Draft</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePublish('instagram')}
                  disabled={loading.instagram || published.instagram}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                    published.instagram
                      ? "bg-green-600/20 text-green-500 border border-green-500/50"
                      : "bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500 text-white shadow-lg disabled:opacity-50"
                  )}
                >
                  {loading.instagram ? <Loader2 size={16} className="animate-spin" /> : published.instagram ? <CheckCircle2 size={16} /> : null}
                  {published.instagram ? 'Uploaded' : 'Upload Draft'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-900/20 rounded-full flex items-center justify-center text-blue-500">
                    <Share2 size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Share2</p>
                    <p className="text-xs text-slate-500">Upload to Page Drafts</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePublish('facebook')}
                  disabled={loading.facebook || published.facebook}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                    published.facebook
                      ? "bg-green-600/20 text-green-500 border border-green-500/50"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg disabled:opacity-50"
                  )}
                >
                  {loading.facebook ? <Loader2 size={16} className="animate-spin" /> : published.facebook ? <CheckCircle2 size={16} /> : null}
                  {published.facebook ? 'Uploaded' : 'Upload Draft'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-700 bg-slate-700/30 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Zap size={20} className="text-yellow-400" />
                Automation Workflow
              </h3>
              <div
                className={cn(
                  "w-12 h-6 rounded-full relative cursor-pointer transition-colors",
                  automationEnabled ? "bg-blue-600" : "bg-slate-600"
                )}
                onClick={() => setAutomationEnabled(!automationEnabled)}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                  automationEnabled ? "left-7" : "left-1"
                )} />
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4 p-4 bg-blue-900/10 rounded-xl border border-blue-500/20">
                <Info size={20} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  Trigger a Make.com scenario with the full project data (script, audio, video) to automate distribution across custom platforms.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Webhook URL</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-400 font-mono overflow-hidden whitespace-nowrap">
                    https://hook.make.com/xyz123...
                  </div>
                </div>
              </div>

              <button
                disabled={!automationEnabled}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-30"
              >
                <Webhook size={18} />
                Trigger Webhook
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h4 className="font-semibold text-white text-sm mb-4">Automation Guide</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-700 text-xs flex items-center justify-center shrink-0">1</div>
                <p className="text-xs text-slate-400">Create a new scenario in Make.com with a "Custom Webhook" trigger.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-700 text-xs flex items-center justify-center shrink-0">2</div>
                <p className="text-xs text-slate-400">Connect the webhook to YouTube, Meta, or Slack modules.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-700 text-xs flex items-center justify-center shrink-0">3</div>
                <p className="text-xs text-slate-400">Click "Trigger Webhook" above to test the connection.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
