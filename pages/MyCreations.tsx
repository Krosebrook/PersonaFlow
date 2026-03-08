import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle, Edit, Trash2, Eye, FileText, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Comp {
  id: string;
  title: string;
  type: 'company' | 'persona';
  created_at: string;
  description: string;
}

export const MyCreations: React.FC = () => {
  const { user } = useAuth();
  const [comps, setComps] = useState<Comp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchComps();
    }
  }, [user]);

  const fetchComps = async () => {
    try {
      setLoading(true);
      // We assume a 'creations' table exists in Supabase
      const { data, error } = await supabase
        .from('creations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComps(data || []);
    } catch (error) {
      console.error('Error fetching creations:', error);
      // Fallback for demo purposes if table doesn't exist or credentials missing
      setComps([
        { id: '1', title: 'Acme Corp Profile', type: 'company', created_at: new Date().toISOString(), description: 'Enterprise software solutions' },
        { id: '2', title: 'Sarah - Marketing Director', type: 'persona', created_at: new Date(Date.now() - 86400000).toISOString(), description: 'B2B SaaS decision maker' },
        { id: '3', title: 'TechFlow Startup', type: 'company', created_at: new Date(Date.now() - 172800000).toISOString(), description: 'AI-driven workflow automation' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this creation?')) return;
    
    try {
      const { error } = await supabase
        .from('creations')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      setComps(comps.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting creation:', error);
      // Fallback for demo
      setComps(comps.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Creations</h1>
          <p className="text-slate-500 mt-1">Manage your generated companies and personas.</p>
        </div>
        <Link 
          to="/wizard" 
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <PlusCircle size={18} />
          New Creation
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 h-48 animate-pulse">
              <div className="h-6 bg-slate-200 rounded w-2/3 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-4/5 mb-6"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-slate-200 rounded w-16"></div>
                <div className="h-8 bg-slate-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : comps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No creations yet</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            You haven't created any companies or personas yet. Get started by creating your first profile.
          </p>
          <Link 
            to="/wizard" 
            className="inline-flex bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-lg font-medium items-center gap-2 transition-colors"
          >
            <PlusCircle size={18} />
            Create Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comps.map((comp) => (
            <div key={comp.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${comp.type === 'company' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                    {comp.type === 'company' ? <Briefcase size={20} /> : <FileText size={20} />}
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full capitalize">
                    {comp.type}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{comp.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{comp.description}</p>
                
                <div className="text-xs text-slate-400 mb-6">
                  Created {new Date(comp.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 border-t border-slate-100 bg-slate-50/50">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors">
                  <Eye size={16} /> View
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors">
                  <Edit size={16} /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(comp.id)}
                  className="flex items-center justify-center p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete"
                  aria-label="Delete creation"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
