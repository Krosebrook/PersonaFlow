import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText,
  LayoutDashboard, 
  Settings, 
  Menu, 
  X,
  PlusCircle,
  LogOut,
  Bell
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Creations', icon: FileText, path: '/creations' },
    { label: 'Create Profile', icon: PlusCircle, path: '/wizard' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Mock Active Users
  const activeUsers = [
    { id: '1', initials: 'JD', color: 'bg-blue-500' },
    { id: '2', initials: 'AK', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-x-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center z-50 sticky top-0">
        <span className="font-bold text-lg tracking-tight">PersonaFlow</span>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-slate-800 rounded-md transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col shadow-2xl md:shadow-none",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-slate-800 hidden md:block">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
             <div className="w-8 h-8 rounded bg-brand-500 flex items-center justify-center text-white text-lg">P</div>
             PersonaFlow
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive(item.path) 
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-900/50" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 mt-auto">
          <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
             <LogOut size={20} />
             <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 w-full">
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 md:px-8 py-3 flex justify-between items-center shadow-sm shrink-0">
           <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 overflow-hidden">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
             <span className="truncate">Real-time sync active</span>
           </div>
           
           <div className="flex items-center gap-2 md:gap-4">
              <div className="flex -space-x-2 mr-1">
                {activeUsers.map(user => (
                  <div key={user.id} className={`${user.color} w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] md:text-xs font-bold text-white shadow-sm cursor-help shrink-0`} title="Viewing now">
                    {user.initials}
                  </div>
                ))}
              </div>
              <div className="h-6 w-px bg-slate-200 mx-1 md:mx-2 hidden sm:block"></div>
              <button className="text-slate-400 hover:text-slate-600 relative p-1" aria-label="Notifications">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
           </div>
        </div>

        {/* Content Wrapper */}
        <div className="p-4 md:p-8 flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};