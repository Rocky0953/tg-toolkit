import React from 'react';
import {
  LayoutDashboard,
  Terminal,
  Settings,
  KeyRound,
  Stethoscope,
  Phone,
  ShieldCheck,
  Users,
  BarChart3,
  Link2,
  FileSpreadsheet,
  Lock,
  GitBranch,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  doctorStatus: 'READY' | 'READY WITH WARNINGS' | 'ERROR';
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, doctorStatus }) => {
  const menuItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'terminal', label: 'CLI Terminal (tg-tool)', icon: Terminal, badge: 'Interactive' },
    { id: 'config', label: 'API Configuration', icon: Settings },
    { id: 'connection', label: 'Telegram Session', icon: KeyRound },
    {
      id: 'doctor',
      label: 'System Doctor',
      icon: Stethoscope,
      badge: doctorStatus === 'READY' ? 'Pass' : doctorStatus === 'READY WITH WARNINGS' ? 'Warn' : 'Error',
    },
    {
      id: 'usernames',
      label: 'Username to Number',
      icon: Phone,
      badge: 'Phone Finder',
    },
    { id: 'privacy', label: 'Contact & Privacy', icon: ShieldCheck },
    { id: 'groups', label: 'Group Manager', icon: Users },
    { id: 'analytics', label: 'Metadata Analytics', icon: BarChart3 },
    { id: 'invites', label: 'Invite Manager', icon: Link2 },
    { id: 'csv', label: 'CSV Utilities', icon: FileSpreadsheet },
    { id: 'security', label: 'Security Center', icon: Lock },
    { id: 'updates', label: 'Check Updates', icon: GitBranch },
  ];

  return (
    <aside className="w-full md:w-64 bg-zinc-900/50 border-r border-zinc-800/80 p-3.5 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0">
      <div className="hidden md:block px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
        Management Modules
      </div>

      <nav className="flex md:flex-col gap-1 w-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all w-full text-left whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`hidden lg:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    item.badge === 'Pass'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : item.badge === 'Warn'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : item.badge === 'Error'
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="hidden md:block mt-auto pt-4 border-t border-zinc-800/80 px-3 py-2">
        <div className="text-[11px] font-mono text-zinc-500 flex items-center justify-between">
          <span>TG-TOOLKIT Core</span>
          <span className="text-zinc-400 font-semibold">v1.5.0-dev</span>
        </div>
        <p className="text-[10px] text-zinc-600 mt-1 leading-relaxed">
          Termux & Linux compatibility layer running on Web.
        </p>
      </div>
    </aside>
  );
};
