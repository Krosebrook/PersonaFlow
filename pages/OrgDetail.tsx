import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_ORGS, MOCK_PERSONAS } from '../constants';
import { generatePersonaExport } from '../services/adapterService';
import { Button } from '../components/ui/Button';
import { Copy, Check, Download, AlertTriangle, ShieldCheck, History, RotateCcw, ArrowLeft, GitCompare, ArrowRight, Eye, X, FileJson, FileText, DownloadCloud } from 'lucide-react';
import { cn, downloadFile } from '../lib/utils';
import { Organization, OrganizationVersion, Persona } from '../types';

export const OrgDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Local state to allow modification/restoration in this session
  const [org, setOrg] = useState<Organization | undefined>(undefined);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<OrganizationVersion[]>([]);
  const [viewingVersion, setViewingVersion] = useState<OrganizationVersion | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportPlatform, setExportPlatform] = useState<string>('Claude');

  // Initialize data
  useEffect(() => {
    const foundOrg = MOCK_ORGS.find(o => o.id === id);
    if (foundOrg) {
      setOrg(foundOrg);
      const orgPersonas = MOCK_PERSONAS.filter(p => p.organization_id === id);
      setPersonas(orgPersonas);
      if (orgPersonas.length > 0) setSelectedPersonaId(orgPersonas[0].id);

      // Generate Mock History based on the found org
      setHistory([
        { 
          id: 'v2', 
          organization_id: foundOrg.id, 
          version_number: 2, 
          data: { ...foundOrg }, // Current state
          created_by: 'You', 
          created_at: 'Just now', 
          change_summary: 'Current Version' 
        },
        { 
          id: 'v1', 
          organization_id: foundOrg.id, 
          version_number: 1, 
          data: { 
            ...foundOrg, 
            name: foundOrg.name + ' (Old)',
            services: foundOrg.services.slice(0, 1), // Fewer services in old version
            compliance: [], // No compliance in old version
            voice_profile: { ...foundOrg.voice_profile, tone: 'Friendly' } // Different tone
          }, 
          created_by: 'System', 
          created_at: '2 days ago', 
          change_summary: 'Initial Setup' 
        }
      ]);
    }
  }, [id]);

  const selectedPersona = personas.find(p => p.id === selectedPersonaId);

  useEffect(() => {
    if (selectedPersona) {
      setExportPlatform(selectedPersona.platform);
    }
  }, [selectedPersona]);

  if (!org) return <div className="p-8 text-center text-slate-500">Organization not found.</div>;

  const exportContent = selectedPersona ? generatePersonaExport(org, { ...selectedPersona, platform: exportPlatform }) : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(exportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPrompt = (format: 'md' | 'txt') => {
    if (!selectedPersona || !org) return;
    const content = generatePersonaExport(org, { ...selectedPersona, platform: exportPlatform });
    const filename = `${org.name}-${selectedPersona.name}-${exportPlatform}-prompt.${format}`.replace(/\s+/g, '-').toLowerCase();
    downloadFile(filename, content, format === 'md' ? 'text/markdown' : 'text/plain');
    setIsExportOpen(false);
  };

  const handleExportOrg = () => {
    if (!org) return;
    const content = JSON.stringify(org, null, 2);
    const filename = `${org.name}-profile.json`.replace(/\s+/g, '-').toLowerCase();
    downloadFile(filename, content, 'application/json');
    setIsExportOpen(false);
  };

  const handleExportPersonas = () => {
    if (!personas.length || !org) return;
    const content = JSON.stringify(personas, null, 2);
    const filename = `${org.name}-personas.json`.replace(/\s+/g, '-').toLowerCase();
    downloadFile(filename, content, 'application/json');
    setIsExportOpen(false);
  };

  const handleRestore = (version: OrganizationVersion) => {
    if (confirm(`Restore version from ${version.created_at}? Current unsaved changes will be lost.`)) {
      setOrg({ ...org, ...version.data } as Organization);
      setViewingVersion(null);
      setShowHistory(false);
    }
  };

  const renderComparisonValue = (val: any) => {
      if (Array.isArray(val)) return <span className="font-mono text-xs">{val.length} items</span>;
      if (typeof val === 'object' && val !== null) return <span className="font-mono text-xs">{JSON.stringify(val).substring(0, 30)}...</span>;
      return <span className="font-medium break-all">{String(val)}</span>;
  };

  const ComparisonView = ({ version }: { version: OrganizationVersion }) => {
    const changes: { key: string, current: any, past: any }[] = [];
    
    // Compare top level keys that exist in the version data
    Object.keys(version.data).forEach(key => {
        const k = key as keyof Organization;
        const currentVal = org[k];
        const pastVal = version.data[k];
        
        // Simple equality check (shallow for objects/arrays for now or specific field logic)
        if (JSON.stringify(currentVal) !== JSON.stringify(pastVal)) {
            changes.push({ key: k, current: currentVal, past: pastVal });
        }
    });

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
                        <GitCompare size={20} className="text-brand-600 shrink-0"/> 
                        Comparing v{version.version_number}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Saved {version.created_at} by {version.created_by}
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="ghost" size="sm" onClick={() => setViewingVersion(null)} className="flex-1 sm:flex-none">Cancel</Button>
                    <Button size="sm" onClick={() => handleRestore(version)} className="gap-2 flex-1 sm:flex-none">
                        <RotateCcw size={16} /> Restore
                    </Button>
                </div>
            </div>

            <div className="p-4 md:p-8 overflow-y-auto bg-slate-50/50 flex-1">
                {changes.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Check size={48} className="mx-auto mb-4 text-green-500" />
                        <h3 className="text-lg font-medium">No Differences</h3>
                        <p>This version is identical to current.</p>
                    </div>
                ) : (
                    <div className="space-y-6 max-w-4xl mx-auto">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Changed Fields ({changes.length})</h3>
                        {changes.map((change) => (
                            <div key={change.key} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 font-mono text-[10px] font-semibold text-slate-500 uppercase tracking-tight">
                                    {change.key.replace(/_/g, ' ')}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                    <div className="p-4 bg-red-50/5">
                                        <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1"><History size={10}/> Historic (v{version.version_number})</div>
                                        <div className="text-sm text-slate-700">{renderComparisonValue(change.past)}</div>
                                        {change.key === 'services' && Array.isArray(change.past) && (
                                            <div className="mt-2 text-[10px] text-slate-500 space-y-1">
                                                {change.past.map((s: any) => <div key={s.id}>• {s.name}</div>)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-green-50/5">
                                        <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1"><ShieldCheck size={10}/> Current Live</div>
                                        <div className="text-sm text-slate-900">{renderComparisonValue(change.current)}</div>
                                        {change.key === 'services' && Array.isArray(change.current) && (
                                            <div className="mt-2 text-[10px] text-slate-500 space-y-1">
                                                {change.current.map((s: any) => <div key={s.id}>• {s.name}</div>)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
      {/* Sidebar List */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-sm h-[400px] lg:h-[calc(100vh-140px)] shrink-0">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center h-14 shrink-0">
           {showHistory ? (
             <div className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900" onClick={() => setShowHistory(false)}>
               <ArrowLeft size={16} /> <span className="font-semibold text-xs">Back</span>
             </div>
           ) : (
             <div>
              <h3 className="font-semibold text-slate-900 text-sm">Personas</h3>
             </div>
           )}
           <button 
             onClick={() => setShowHistory(!showHistory)} 
             className={cn(
               "p-2 rounded transition-colors", 
               showHistory ? "bg-brand-100 text-brand-700" : "hover:bg-slate-200 text-slate-500"
             )}
             title="Version History"
           >
             <History size={18} />
           </button>
        </div>
        
        {showHistory ? (
          <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50/50">
             {history.map((v, idx) => {
               const isCurrent = idx === 0;
               const isSelected = viewingVersion?.id === v.id;
               
               return (
               <button 
                 key={v.id} 
                 onClick={() => setViewingVersion(v)}
                 className={cn(
                    "w-full text-left p-3 border rounded-lg shadow-sm transition-all group relative",
                    isSelected 
                        ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500" 
                        : "border-slate-200 bg-white hover:border-brand-300"
                 )}
               >
                  <div className="flex justify-between items-center mb-1">
                    <span className={cn("font-semibold text-xs", isSelected ? "text-brand-700" : "text-slate-700")}>
                        Version {v.version_number}
                    </span>
                    <span className="text-[10px] text-slate-400">{v.created_at}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mb-2 truncate">{v.change_summary}</div>
                  
                  {isCurrent ? (
                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium rounded-full">Live</span>
                  ) : (
                    <div className="flex items-center gap-1 text-[10px] font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Eye size={12} /> Compare
                    </div>
                  )}
               </button>
             )})}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {personas.map(p => (
              <button
                key={p.id}
                onClick={() => { setSelectedPersonaId(p.id); setViewingVersion(null); }}
                className={cn(
                  "w-full text-left p-3 rounded-lg text-sm transition-all border border-transparent group relative",
                  selectedPersonaId === p.id 
                    ? "bg-brand-50 border-brand-200 text-brand-700 font-medium shadow-sm" 
                    : "hover:bg-slate-50 text-slate-600 hover:border-slate-200"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="truncate pr-2 font-medium">{p.name}</span>
                  <span className={cn(
                    "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0",
                    selectedPersonaId === p.id ? "bg-white border-brand-100 text-brand-600" : "bg-slate-50 border-slate-200 text-slate-400"
                  )}>
                    {p.platform}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <div className={cn("w-1.5 h-1.5 rounded-full", p.type === 'Internal' ? 'bg-purple-400' : 'bg-green-400')}></div>
                  {p.role_archetype}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Preview Area */}
      <div className="lg:col-span-9 flex flex-col gap-6 min-h-0">
        {viewingVersion ? (
            <div className="flex-1 min-h-[500px] lg:h-[calc(100vh-140px)]">
              <ComparisonView version={viewingVersion} />
            </div>
        ) : selectedPersona ? (
          <div className="flex flex-col gap-6 flex-1 min-h-0">
            <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6 shadow-sm transition-all duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                <div className="w-full">
                   <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight break-words">{selectedPersona.name}</h1>
                   <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2 text-xs text-slate-500">
                     <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-slate-700 font-medium">
                       <ShieldCheck size={14}/> {selectedPersona.mode}
                     </span>
                     <span className="text-slate-300 hidden sm:inline">•</span>
                     <span>{selectedPersona.role_archetype}</span>
                     <span className="text-slate-300 hidden sm:inline">•</span>
                     <span className={cn(
                       "px-2 py-0.5 rounded-full font-medium border",
                       selectedPersona.type === 'Internal' 
                         ? "bg-purple-50 text-purple-700 border-purple-100" 
                         : "bg-green-50 text-green-700 border-green-100"
                     )}>
                       {selectedPersona.type}
                     </span>
                   </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1 sm:flex-none">
                    {copied ? <Check size={16} className="mr-1 text-green-600"/> : <Copy size={16} className="mr-1"/>}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1 sm:flex-none" onClick={() => setIsExportOpen(true)}>
                    <Download size={16} className="mr-1"/> Export
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                 <div className="p-4 bg-rose-50 rounded-lg border border-rose-100">
                   <h4 className="text-[10px] font-bold text-rose-700 uppercase mb-3 flex items-center gap-2 tracking-widest">
                     <AlertTriangle size={14}/> Critical Constraints
                   </h4>
                   <ul className="text-xs text-rose-900 space-y-2 list-disc list-outside ml-4">
                     {selectedPersona.constraints.map((c, i) => <li key={i}>{c}</li>)}
                   </ul>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 md:col-span-2">
                   <h4 className="text-[10px] font-bold text-slate-600 uppercase mb-3 tracking-widest">Capabilities</h4>
                   <div className="flex flex-wrap gap-2">
                     {selectedPersona.capabilities.map((c, i) => (
                       <span key={i} className="text-xs bg-white border border-slate-200 px-2.5 py-1.5 rounded-md text-slate-700 shadow-sm">
                         {c}
                       </span>
                     ))}
                   </div>
                 </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col flex-1 min-h-[400px] overflow-hidden shadow-2xl ring-1 ring-slate-900/5 lg:h-[calc(100vh-480px)]">
              <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Prompt Preview</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600 font-mono">
                      {selectedPersona.platform}
                    </span>
                 </div>
                 <div className="flex gap-1.5 opacity-60">
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div>
                 </div>
              </div>
              <div className="p-4 md:p-6 overflow-auto custom-scrollbar bg-[#0f172a] flex-1">
                <pre className="font-mono text-xs md:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed selection:bg-brand-500/30">
                  {exportContent}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-xl border-2 border-slate-200 border-dashed p-12 text-center min-h-[400px]">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
               <ShieldCheck size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No Persona Selected</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm">Select a persona from the sidebar to view its configuration, constraints, and generated prompt.</p>
          </div>
        )}
      </div>

      {isExportOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <DownloadCloud size={18} className="text-brand-600" />
                Export Data
              </h3>
              <button onClick={() => setIsExportOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Prompt Export */}
              {selectedPersona && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <FileText size={16} className="text-slate-500" />
                    Persona Prompt
                  </h4>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1.5 block">Target Platform</label>
                      <select 
                        className="w-full p-2 text-sm border border-slate-200 rounded-md outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 bg-white"
                        value={exportPlatform}
                        onChange={e => setExportPlatform(e.target.value)}
                      >
                        <option value="Claude">Claude</option>
                        <option value="Google">Google (Gemini)</option>
                        <option value="Microsoft">Microsoft (OpenAI)</option>
                        <option value="Generic">Generic</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleExportPrompt('md')} className="flex-1 bg-white">
                        .MD
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportPrompt('txt')} className="flex-1 bg-white">
                        .TXT
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Export */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileJson size={16} className="text-slate-500" />
                  Raw Data (JSON)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={handleExportOrg} className="w-full justify-start text-xs">
                    Organization Profile
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportPersonas} className="w-full justify-start text-xs" disabled={personas.length === 0}>
                    All Personas
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};