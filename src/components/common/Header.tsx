import React from 'react';
import { useUniversity, ActivePortal } from '../../context/UniversityContext';
import { 
  GraduationCap, 
  RotateCcw, 
  UserCheck, 
  Database, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activePortal, 
    setActivePortal, 
    activeStudent, 
    activeFaculty, 
    resetAllData,
    applications 
  } = useUniversity();

  const pendingAppsCount = applications.filter((a) => a.status === 'Pending').length;

  const navItems: { id: ActivePortal; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'public', label: 'Public Website', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'student', label: 'Student Portal', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'faculty', label: 'Faculty Portal', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'admin', label: 'Admin Dashboard', icon: <ShieldCheck className="w-3.5 h-3.5" />, badge: pendingAppsCount },
    { id: 'architecture', label: 'Architecture & DB', icon: <Database className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActivePortal('public')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded bg-stone-900 text-stone-100 flex items-center justify-center font-serif font-bold text-sm tracking-wider">
                AU
              </div>
              <div>
                <span className="font-serif font-semibold text-base sm:text-lg tracking-tight text-stone-900 block leading-tight">
                  Apex University
                </span>
                <span className="text-[11px] text-stone-500 tracking-wider uppercase font-mono block">
                  Est. 1980 · Academic Portal
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Portal Tabs */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
            {navItems.map((item) => {
              const isActive = activePortal === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePortal(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Active Context Indicator & Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Portal Switcher for Mobile / Tablet */}
            <div className="lg:hidden flex items-center">
              <select
                value={activePortal}
                onChange={(e) => setActivePortal(e.target.value as ActivePortal)}
                className="text-xs bg-stone-100 border border-stone-200 rounded px-2.5 py-1.5 font-medium text-stone-800"
              >
                <option value="public">Public Site</option>
                <option value="student">Student Portal</option>
                <option value="faculty">Faculty Portal</option>
                <option value="admin">Admin Dashboard</option>
                <option value="architecture">Architecture & DB</option>
              </select>
            </div>

            {/* Role indicator pill alternative: Clean text & badge */}
            <div className="hidden sm:flex items-center gap-2 text-xs border border-stone-200 rounded-md px-2.5 py-1 bg-stone-50 text-stone-700">
              <UserCheck className="w-3.5 h-3.5 text-stone-500" />
              {activePortal === 'student' && (
                <span className="font-mono text-[11px] truncate max-w-[130px]">
                  {activeStudent.full_name} ({activeStudent.reg_no})
                </span>
              )}
              {activePortal === 'faculty' && (
                <span className="font-mono text-[11px] truncate max-w-[130px]">
                  {activeFaculty.full_name}
                </span>
              )}
              {activePortal === 'admin' && (
                <span className="font-mono text-[11px]">System Admin</span>
              )}
              {(activePortal === 'public' || activePortal === 'architecture') && (
                <span className="font-mono text-[11px]">Guest / Explorer</span>
              )}
            </div>

            {/* Reset Seed Button */}
            <button
              onClick={resetAllData}
              title="Reset all database tables to default seed state"
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
