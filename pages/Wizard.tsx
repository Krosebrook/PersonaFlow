import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { MagicButton } from '../components/ui/MagicButton';
import { Organization, ServiceItem, TeamMember, ComplianceItem } from '../types';
import { generateServices, generateCompliance, generateTeamStructure } from '../services/aiService';
import { generateId } from '../lib/utils';
import { Check, ChevronRight, ChevronLeft, Building, Palette, Briefcase, Users, Shield, MessageSquare, Trash2, Plus, Sparkles } from 'lucide-react';

const steps = [
  { id: 'identity', label: 'Identity', icon: Building },
  { id: 'brand', label: 'Brand', icon: Palette },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'compliance', label: 'Trust', icon: Shield },
  { id: 'voice', label: 'Voice', icon: MessageSquare },
];

export const Wizard: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Organization>>({
    name: '',
    industry: 'SaaS',
    brand: { colors: { primary: '#0ea5e9', secondary: '#ffffff', accent: '#3b82f6' }, font_vibe: 'Modern' },
    voice_profile: { tone: 'Professional', reading_level: 'High School', banned_phrases: [] },
    services: [],
    team: [],
    compliance: []
  });

  const [suggestedServices, setSuggestedServices] = useState<ServiceItem[]>([]);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // TODO: persist organization to Supabase or local state
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAiServices = async () => {
    if (!formData.industry) return;
    const items = await generateServices(formData.industry, formData.name || 'Company');
    setSuggestedServices(items);
  };

  const handleAiCompliance = async () => {
    if (!formData.industry) return;
    const items = await generateCompliance(formData.industry);
    setFormData(prev => ({ ...prev, compliance: items }));
  };

  const handleAiTeam = async () => {
    if (!formData.industry) return;
    const items = await generateTeamStructure(formData.industry);
    setFormData(prev => ({ ...prev, team: items }));
  };

  const StepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">Company Identity</h2>
            <p className="text-sm text-slate-500">Let's start with the basics of your organization.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Company Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="e.g. Acme Corp"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Industry</label>
                <select 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white text-sm"
                  value={formData.industry}
                  onChange={e => setFormData({...formData, industry: e.target.value})}
                >
                  <option value="">Select Industry</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Logistics">Logistics</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Company Domain</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                  placeholder="acme.com"
                  value={formData.domain}
                  onChange={e => setFormData({...formData, domain: e.target.value})}
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">Brand Kit</h2>
            <p className="text-sm text-slate-500">Define the visual feeling of your brand.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Primary Color</label>
                 <div className="flex gap-2">
                   <input type="color" className="h-10 w-20 rounded cursor-pointer shrink-0" 
                    value={formData.brand?.colors.primary}
                    onChange={e => setFormData({
                      ...formData, 
                      brand: { ...formData.brand!, colors: { ...formData.brand!.colors, primary: e.target.value } }
                    })}
                   />
                   <input type="text" className="flex-1 p-2 border border-slate-300 rounded-lg text-sm font-mono" value={formData.brand?.colors.primary} readOnly />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-700">Typography Vibe</label>
                 <div className="grid grid-cols-2 gap-2">
                   {['Modern', 'Classic', 'Tech', 'Playful'].map(vibe => (
                     <button 
                       key={vibe}
                       onClick={() => setFormData({ ...formData, brand: { ...formData.brand!, font_vibe: vibe } })}
                       className={`p-2.5 border rounded-lg text-xs font-medium transition-all ${
                         formData.brand?.font_vibe === vibe 
                         ? 'border-brand-500 bg-brand-50 text-brand-700' 
                         : 'border-slate-200 hover:border-slate-300 text-slate-600'
                       }`}
                     >
                       {vibe}
                     </button>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">Services & Outcomes</h2>
                <p className="text-sm text-slate-500">What problems do you solve?</p>
              </div>
              <MagicButton label="Suggest Content" onClick={handleAiServices} disabled={!formData.industry} className="w-full sm:w-auto" />
            </div>

            <div className="space-y-4">
              {formData.services?.map((service, idx) => (
                <div key={service.id} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm group relative">
                  <div className="flex justify-between items-start mb-2 pr-8">
                    <input 
                      className="font-semibold text-slate-900 bg-transparent border-none focus:ring-0 p-0 w-full text-sm"
                      value={service.name}
                      onChange={(e) => {
                        const newServices = [...(formData.services || [])];
                        newServices[idx].name = e.target.value;
                        setFormData({...formData, services: newServices});
                      }}
                    />
                  </div>
                  <button 
                    onClick={() => setFormData({...formData, services: formData.services?.filter(s => s.id !== service.id)})}
                    className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                  <textarea 
                    className="w-full text-xs md:text-sm text-slate-600 bg-slate-50 border border-transparent focus:bg-white focus:border-slate-300 rounded p-2 resize-none"
                    value={service.description}
                    rows={2}
                    onChange={(e) => {
                      const newServices = [...(formData.services || [])];
                      newServices[idx].description = e.target.value;
                      setFormData({...formData, services: newServices});
                    }}
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {service.outcomes.map((outcome, oIdx) => (
                      <span key={oIdx} className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                        {outcome}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm"
                className="w-full border-dashed"
                onClick={() => setFormData({
                  ...formData, 
                  services: [...(formData.services || []), { id: generateId(), name: 'New Service', description: '', outcomes: [] }]
                })}
              >
                <Plus size={14} className="mr-2" /> Add Service
              </Button>

              {suggestedServices.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Sparkles size={16} className="text-brand-500" />
                    AI Suggestions
                  </h3>
                  <div className="space-y-3">
                    {suggestedServices.map(suggestion => (
                      <div key={suggestion.id} className="p-3 bg-brand-50 border border-brand-100 rounded-lg flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-brand-900 text-sm">{suggestion.name}</h4>
                          <p className="text-xs text-brand-700 mt-1 line-clamp-2">{suggestion.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {suggestion.outcomes.map((outcome, oIdx) => (
                              <span key={oIdx} className="text-[10px] bg-white text-brand-600 px-2 py-0.5 rounded border border-brand-200">
                                {outcome}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="shrink-0 bg-white border-brand-200 text-brand-600 hover:bg-brand-100"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              services: [...(formData.services || []), { ...suggestion, id: generateId() }]
                            });
                            setSuggestedServices(prev => prev.filter(s => s.id !== suggestion.id));
                          }}
                        >
                          <Plus size={14} className="mr-1" /> Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
         return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">Team Structure</h2>
                <p className="text-sm text-slate-500">Key roles that define your operations.</p>
              </div>
              <MagicButton label="Suggest Content" onClick={handleAiTeam} disabled={!formData.industry} className="w-full sm:w-auto" />
            </div>
             <div className="space-y-3">
              {formData.team?.map((member, idx) => (
                <div key={member.id} className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden">
                   <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 shrink-0 text-sm">
                     {member.count}
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="font-medium text-slate-900 text-sm truncate">{member.role}</div>
                     <div className="text-xs text-slate-500 truncate">{member.description}</div>
                   </div>
                </div>
              ))}
             </div>
          </div>
         );
      case 4:
         return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">Compliance</h2>
                <p className="text-sm text-slate-500">Trust frameworks you adhere to.</p>
              </div>
              <MagicButton label="Suggest Content" onClick={handleAiCompliance} disabled={!formData.industry} className="w-full sm:w-auto" />
            </div>
            <div className="space-y-3">
              {formData.compliance?.map((comp, idx) => (
                <div key={comp.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden">
                   <div className="p-2 bg-brand-50 text-brand-600 rounded shrink-0">
                     <Shield size={18} />
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-start gap-2">
                       <div className="font-medium text-slate-900 text-sm truncate">{comp.framework}</div>
                       <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-800 uppercase shrink-0 tracking-tighter">{comp.status}</span>
                     </div>
                     <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{comp.details}</div>
                   </div>
                </div>
              ))}
             </div>
          </div>
         );
      default:
        return (
           <div className="space-y-6 animate-fade-in text-center py-12 px-4">
             <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
               {React.createElement(steps[activeStep].icon, { size: 28 })}
             </div>
             <h2 className="text-xl md:text-2xl font-bold text-slate-900">{steps[activeStep].label}</h2>
             <p className="text-sm text-slate-500 max-w-xs mx-auto">
               This step involves configuring specific attributes for your organization's {steps[activeStep].label.toLowerCase()}.
             </p>
           </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6 md:mb-8 px-2 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Create Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Define your organization's truth for AI consistency.</p>
      </div>

      <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 md:p-6">
          <div className="flex justify-between items-center relative max-w-2xl mx-auto">
             {/* Line */}
             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-0"></div>
             
             {steps.map((step, idx) => {
               const isActive = idx === activeStep;
               const isCompleted = idx < activeStep;
               return (
                 <div key={step.id} className="relative z-10 flex flex-col items-center gap-1.5">
                   <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                     isActive ? 'bg-brand-600 border-brand-600 text-white shadow-lg scale-110 md:scale-125' :
                     isCompleted ? 'bg-green-500 border-green-500 text-white' :
                     'bg-white border-slate-300 text-slate-400'
                   }`}>
                     {isCompleted ? <Check size={14} /> : React.createElement(step.icon, { size: 14 })}
                   </div>
                   <span className={`text-[9px] font-bold uppercase tracking-tighter md:hidden ${isActive ? 'text-brand-700' : 'text-slate-400'}`}>
                     {isActive ? step.label.substring(0,3) : ''}
                   </span>
                   <span className={`text-[10px] font-medium hidden md:block ${isActive ? 'text-brand-700' : 'text-slate-500'}`}>
                     {step.label}
                   </span>
                 </div>
               );
             })}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 md:p-10 min-h-[350px]">
          <StepContent />
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 md:p-6 flex flex-col sm:flex-row gap-4 sm:justify-between items-center">
          <Button variant="ghost" size="sm" onClick={handleBack} disabled={activeStep === 0} className="gap-2 w-full sm:w-auto">
            <ChevronLeft size={16} /> Back
          </Button>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="flex-1 sm:flex-none">Draft</Button>
            <Button onClick={handleNext} size="sm" className="gap-2 flex-1 sm:flex-none">
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};