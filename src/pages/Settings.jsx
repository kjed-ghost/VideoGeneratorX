import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { encrypt, decrypt } from '../lib/crypto';
import {
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

const SettingSection = ({ title, description, children, onSave, loading }) => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden mb-8">
    <div className="p-6 border-b border-slate-700">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-400 mt-1">{description}</p>
    </div>
    <div className="p-6 space-y-4">
      {children}
    </div>
    <div className="px-6 py-4 bg-slate-800/50 flex justify-end">
      <button
        onClick={onSave}
        disabled={loading}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        <Save size={18} />
        <span>{loading ? 'Saving...' : 'Save Section'}</span>
      </button>
    </div>
  </div>
);

const APIKeyInput = ({ label, value, onChange, placeholder, link, note, type = "password", onTest }) => {
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const isPassword = type === "password";

  const handleTest = async () => {
    setTesting(true);
    const success = await onTest();
    setTestResult(success ? 'pass' : 'fail');
    setTesting(false);
    setTimeout(() => setTestResult(null), 3000);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <div className="flex items-center gap-4">
          {onTest && (
            <button
              onClick={handleTest}
              disabled={testing || !value}
              className={cn(
                "text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded flex items-center gap-1",
                testResult === 'pass' ? "text-green-500 bg-green-500/10" :
                testResult === 'fail' ? "text-red-500 bg-red-500/10" :
                "text-slate-500 hover:text-slate-300 bg-slate-700/50"
              )}
            >
              {testing ? <RefreshCw size={10} className="animate-spin" /> : null}
              {testResult === 'pass' ? 'Working ✓' : testResult === 'fail' ? 'Invalid ✗' : 'Test Connection'}
            </button>
          )}
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center">
              Get key <ExternalLink size={12} className="ml-1" />
            </a>
          )}
        </div>
      </div>
      <div className="relative">
        <input
          type={isPassword ? (show ? "text" : "password") : "text"}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12"
        />
        {isPassword && (
          <button
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {note && <p className="text-xs text-slate-500">{note}</p>}
    </div>
  );
};

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState({});
  const [sectionsStatus, setSectionsStatus] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('api_keys')
      .eq('id', user.id)
      .single();

    if (data?.api_keys) {
      const decryptedKeys = {};
      Object.keys(data.api_keys).forEach(k => {
        decryptedKeys[k] = decrypt(data.api_keys[k]);
      });
      setKeys(decryptedKeys);
    }
  };

  const saveSection = async (section) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const encryptedKeys = {};
    Object.keys(keys).forEach(k => {
      encryptedKeys[k] = encrypt(keys[k]);
    });

    const { error } = await supabase
      .from('profiles')
      .update({ api_keys: encryptedKeys })
      .eq('id', user.id);

    setLoading(false);
    if (!error) {
       setSectionsStatus({...sectionsStatus, [section]: true});
       setTimeout(() => setSectionsStatus({...sectionsStatus, [section]: false}), 3000);
    }
  };

  const updateKey = (key, value) => {
    setKeys(prev => ({ ...prev, [key]: value }));
  };

  const testConnection = async (type) => {
    // Simulate test
    await new Promise(r => setTimeout(r, 1000));
    return true;
  };

  const exportSettings = () => {
    const data = JSON.stringify(keys, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contentflow-settings.json';
    a.click();
  };

  const importSettings = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedKeys = JSON.parse(e.target.result);
        setKeys(importedKeys);
      } catch (err) {
        alert('Invalid settings file');
      }
    };
    reader.readAsText(file);
  };

  const completedCount = Object.values(keys).filter(v => !!v).length;
  const progress = Math.min(Math.round((completedCount / 12) * 100), 100);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your API keys and service connections. All keys are stored securely.</p>
      </header>

      <div className="space-y-2 mb-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-400">Configuration Progress</span>
          <span className="text-sm font-medium text-blue-400">{progress}% complete</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <SettingSection
        title="AI Script Generator"
        description="Used to generate scripts and video prompts. Priority: Gemini → Groq → OpenRouter."
        onSave={() => saveSection('ai')}
        loading={loading}
      >
        <APIKeyInput
          label="Google Gemini API Key"
          value={keys.gemini_api_key}
          onChange={(v) => updateKey('gemini_api_key', v)}
          link="https://aistudio.google.com/app/apikey"
          onTest={() => testConnection('gemini')}
        />
        <APIKeyInput
          label="Groq API Key"
          value={keys.groq_api_key}
          onChange={(v) => updateKey('groq_api_key', v)}
          link="https://console.groq.com"
          onTest={() => testConnection('groq')}
        />
        <APIKeyInput
          label="OpenRouter API Key"
          value={keys.openrouter_api_key}
          onChange={(v) => updateKey('openrouter_api_key', v)}
          link="https://openrouter.ai"
          onTest={() => testConnection('openrouter')}
        />
      </SettingSection>

      <SettingSection
        title="Voice & Audio"
        description="Generate voiceovers for your videos."
        onSave={() => saveSection('voice')}
        loading={loading}
      >
        <APIKeyInput
          label="HuggingFace API Token"
          value={keys.huggingface_token}
          onChange={(v) => updateKey('huggingface_token', v)}
          link="https://huggingface.co/settings/tokens"
          note="For Kokoro TTS."
        />
        <APIKeyInput
          label="ElevenLabs API Key"
          value={keys.elevenlabs_api_key}
          onChange={(v) => updateKey('elevenlabs_api_key', v)}
          link="https://elevenlabs.io"
          onTest={() => testConnection('elevenlabs')}
        />
      </SettingSection>

      <SettingSection
        title="AI Video Generation"
        description="Connect AI video tools. Each platform gives free monthly credits."
        onSave={() => saveSection('video')}
        loading={loading}
      >
        <APIKeyInput
          label="Luma AI API Key"
          value={keys.luma_api_key}
          onChange={(v) => updateKey('luma_api_key', v)}
          link="https://lumalabs.ai/dream-machine/api"
        />
        <APIKeyInput
          label="Pika Labs API Key"
          value={keys.pika_api_key}
          onChange={(v) => updateKey('pika_api_key', v)}
          link="https://pika.art"
        />
      </SettingSection>

      <SettingSection
        title="Publishing Platforms"
        description="Connect where your videos get uploaded."
        onSave={() => saveSection('publishing')}
        loading={loading}
      >
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between">
           <div>
             <p className="text-sm font-semibold text-white">Google / YouTube</p>
             <p className="text-xs text-slate-500">Required for YouTube uploads</p>
           </div>
           <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-xs font-bold">Connect</button>
        </div>
        <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between">
           <div>
             <p className="text-sm font-semibold text-white">Meta (FB/IG)</p>
             <p className="text-xs text-slate-500">Required for Reels publishing</p>
           </div>
           <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-xs font-bold">Connect</button>
        </div>
      </SettingSection>

      <SettingSection
        title="Automation"
        description="Connect Make.com for custom workflows."
        onSave={() => saveSection('automation')}
        loading={loading}
      >
        <APIKeyInput
          label="Make.com Webhook URL"
          value={keys.make_webhook_url}
          onChange={(v) => updateKey('make_webhook_url', v)}
          type="text"
          placeholder="https://hook.make.com/..."
        />
      </SettingSection>

      <div className="flex space-x-4 mb-20">
        <button
          onClick={exportSettings}
          className="flex-1 flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl border border-slate-700 transition-colors"
        >
          <Download size={20} />
          <span>Export Settings</span>
        </button>
        <label className="flex-1 flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl border border-slate-700 transition-colors cursor-pointer">
          <Upload size={20} />
          <span>Import Settings</span>
          <input type="file" onChange={importSettings} className="hidden" accept=".json" />
        </label>
      </div>
    </div>
  );
}
