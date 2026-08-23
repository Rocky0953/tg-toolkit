import React from 'react';
import {
  Terminal,
  KeyRound,
  Stethoscope,
  ShieldCheck,
  Users,
  AtSign,
  FileSpreadsheet,
  ArrowRight,
  Send,
  Lock,
} from 'lucide-react';
import { ActiveTab, TelegramConfig, TelegramSession, DoctorReport } from '../types';

interface OverviewProps {
  config: TelegramConfig;
  session: TelegramSession;
  doctorReport: DoctorReport;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  config,
  session,
  doctorReport,
  setActiveTab,
}) => {
  const isConfigured = Boolean(config.api_id && config.api_hash);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-r from-cyan-950/50 via-zinc-900 to-zinc-900 border border-cyan-800/40 rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Send className="h-3.5 w-3.5" />
            <span>TG-TOOLKIT Management Suite v1.4.0-dev</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Telegram Management, Session Security & Diagnostics
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Execute user-authorized Telegram MTProto workflows, inspect environment health with System Doctor, protect API credentials with 600 isolation, and manage groups with strict opt-in compliance.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('terminal')}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-medium flex items-center gap-2 shadow-lg shadow-cyan-600/25 transition-all active:scale-95"
            >
              <Terminal className="h-4 w-4" />
              <span>Launch CLI Terminal</span>
            </button>
            <button
              onClick={() => setActiveTab('doctor')}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-mono font-medium flex items-center gap-2 transition-all active:scale-95"
            >
              <Stethoscope className="h-4 w-4 text-cyan-400" />
              <span>Run System Doctor ({doctorReport.pass} Pass)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Session Card */}
        <div
          onClick={() => setActiveTab('connection')}
          className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-800/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono font-medium">Session Status</span>
            <KeyRound className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-sm font-bold font-mono text-white">
            {session.isConnected ? session.username || 'Connected' : 'Offline / No Session'}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
            {session.isConnected ? (
              <span className="text-emerald-400 font-mono">● {session.sessionSizeKb} KB cached</span>
            ) : (
              <span className="text-amber-400 font-mono">Click to authenticate</span>
            )}
          </div>
        </div>

        {/* API Config Card */}
        <div
          onClick={() => setActiveTab('config')}
          className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-800/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono font-medium">API Credentials</span>
            <Lock className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-sm font-bold font-mono text-white">
            {isConfigured ? `API ID ${config.api_id}` : 'Not Configured'}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
            {isConfigured ? (
              <span className="text-cyan-400 font-mono">● Mode 600 protected</span>
            ) : (
              <span className="text-amber-400 font-mono">Setup API ID & Hash</span>
            )}
          </div>
        </div>

        {/* System Doctor Status */}
        <div
          onClick={() => setActiveTab('doctor')}
          className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-800/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono font-medium">System Doctor</span>
            <Stethoscope className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-sm font-bold font-mono text-emerald-400">
            {doctorReport.status}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1 font-mono">
            <span>{doctorReport.pass} Pass, {doctorReport.warning} Warn</span>
          </div>
        </div>

        {/* Privacy & Compliance */}
        <div
          onClick={() => setActiveTab('privacy')}
          className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-800/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono font-medium">Privacy Guard</span>
            <ShieldCheck className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-sm font-bold font-mono text-cyan-300">
            Opt-In Enforced
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1 font-mono">
            <span>No Phone Harvesting</span>
          </div>
        </div>
      </div>

      {/* Feature Navigation Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('usernames')}
          className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-cyan-500/40 transition-all cursor-pointer group space-y-3"
        >
          <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
            <AtSign className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white flex items-center justify-between">
              <span>Username Tools</span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Verify Telegram handle syntax rules (5-32 characters, regex constraints), check availability, and run batch audits.
            </p>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('groups')}
          className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-cyan-500/40 transition-all cursor-pointer group space-y-3"
        >
          <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white flex items-center justify-between">
              <span>Group Manager</span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Supergroup and channel roster inspector, member counts, and opt-in invite link generator.
            </p>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('csv')}
          className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-cyan-500/40 transition-all cursor-pointer group space-y-3"
        >
          <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white flex items-center justify-between">
              <span>CSV Utilities</span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Export standardized contacts CSV, group rosters, and audit logs with instant client download.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
