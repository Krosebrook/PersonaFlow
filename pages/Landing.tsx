import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight, CheckCircle2, Bot, Layers, Shield } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <nav className="max-w-7xl mx-auto p-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-brand-500"></div> PersonaFlow
        </div>
        <Link to="/auth">
          <Button variant="primary">Login / Demo</Button>
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-brand-300 text-sm font-medium">
          New: Export to Microsoft Copilot Studio
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          The Source of Truth for<br />
          Enterprise AI Agents
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Create stunning company profiles and generate compliance-aware AI personas for Claude, Google Gemini, and Microsoft Copilot.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-20">
          <Link to="/auth">
            <Button size="lg" className="w-full md:w-auto gap-2 text-lg h-14 px-8">
              Start Building Free <ArrowRight size={20} />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full md:w-auto text-lg h-14 px-8 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800">
            View Sample Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-brand-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-6">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Unified Brand Truth</h3>
            <p className="text-slate-400 leading-relaxed">
              Define your voice, services, and compliance once. We maintain the canonical model for all your agents.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-brand-500/50 transition-colors">
            <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mb-6">
              <Bot size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Multi-Platform Export</h3>
            <p className="text-slate-400 leading-relaxed">
              One click transforms your persona into optimized prompts for Claude, Google, and Microsoft ecosystems.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-brand-500/50 transition-colors">
            <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Compliance Guardrails</h3>
            <p className="text-slate-400 leading-relaxed">
              SOC2, HIPAA, GDPR awareness built-in. Generated prompts include strict boundary instructions by default.
            </p>
          </div>
        </div>

        <div className="mt-32 border-t border-slate-800 pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {['Anthropic', 'Google Cloud', 'Microsoft Azure', 'Supabase'].map(logo => (
             <div key={logo} className="h-12 flex items-center justify-center font-bold text-xl text-slate-500">
               {logo}
             </div>
          ))}
        </div>
      </main>
    </div>
  );
};
