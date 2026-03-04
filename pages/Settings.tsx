import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Shield, Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    setStatus('saving');
    localStorage.setItem('GEMINI_API_KEY', apiKey);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 3000);
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <SettingsIcon className="text-brand-500" size={32} />
            Settings
          </h1>
          <p className="text-slate-500 mt-1">Manage your application configuration and API keys.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* API Configuration Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Key size={20} className="text-brand-500" />
                Google Gemini API
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Configure your personal API key to power the AI generation features.
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label htmlFor="api-key" className="text-sm font-medium text-slate-700">
                  API Key
                </label>
                <div className="relative">
                  <input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Google GenAI API Key"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all font-mono text-sm"
                  />
                  {apiKey && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Shield size={16} />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 flex items-start gap-1.5 mt-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  Your API key is stored locally in your browser and is never sent to our servers.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Button 
                  onClick={handleSave} 
                  disabled={status === 'saving'}
                  className="flex items-center gap-2"
                >
                  {status === 'saving' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {status === 'saved' ? 'Saved!' : 'Save Configuration'}
                </Button>
                
                {status === 'saved' && (
                  <span className="text-green-600 text-sm font-medium flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2">
                    <CheckCircle2 size={16} />
                    Settings updated successfully
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Usage Info */}
          <div className="bg-brand-50 rounded-2xl p-6 border border-brand-100">
            <h3 className="text-brand-900 font-semibold flex items-center gap-2 mb-2">
              <AlertCircle size={18} />
              How to get an API Key?
            </h3>
            <p className="text-brand-800 text-sm leading-relaxed">
              You can obtain a free or paid API key from the Google AI Studio. 
              Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-brand-600">Google AI Studio</a> to create your key.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">AI Engine</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Storage Mode</span>
                <span className="text-slate-900 font-medium">LocalStorage</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Encryption</span>
                <span className="text-slate-900 font-medium">Browser-level</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
