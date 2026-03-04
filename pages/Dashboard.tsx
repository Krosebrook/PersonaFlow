import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_ORGS, MOCK_PERSONAS } from '../constants';
import { Button } from '../components/ui/Button';
import { Building2, Users, ArrowRight, Activity, ShieldCheck } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-1">Manage your company profiles and AI personas.</p>
        </div>
        <Link to="/wizard">
          <Button size="lg" className="gap-2">
            Create New Profile <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Companies</p>
              <h3 className="text-2xl font-bold text-slate-900">{MOCK_ORGS.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Personas</p>
              <h3 className="text-2xl font-bold text-slate-900">{MOCK_PERSONAS.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Exports Generated</p>
              <h3 className="text-2xl font-bold text-slate-900">142</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Recent Companies</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="divide-y divide-slate-100">
          {MOCK_ORGS.map((org) => (
            <div key={org.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-lg">
                  {org.name.substring(0,2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">{org.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{org.industry}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1"><ShieldCheck size={12}/> {org.compliance.length} Compliance Frameworks</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link to={`/org/${org.id}`}>
                  <Button variant="outline" size="sm">View Details</Button>
                </Link>
                <Link to={`/org/${org.id}/personas`}>
                  <Button variant="secondary" size="sm">Manage Personas</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
