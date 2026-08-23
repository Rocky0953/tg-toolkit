import React from 'react';
import { Send, ShieldCheck, Terminal, AlertTriangle, RefreshCw } from 'lucide-react';
import { TelegramConfig, TelegramSession } from '../types';

interface HeaderProps {
  session: TelegramSession;
  config: TelegramConfig;
  onOpenTerminal: () => void;
  onRefreshDoctor: () => void;
}

export const Header: React.FC<HeaderProps> = ({ session, config, onOpenTerminal, onRefreshDoctor }) => {
  const isConfigured = Boolean(config.api_id && config.api_hash);

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur px-4 lg:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
          <Send className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono font-bold text-lg tracking-tight text-white flex items-center gap-2">
              TG-TOOLKIT
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-400 font-normal">
                v1.4.0-dev
              </span>
            </h1>
          </div>
          <p className="text-xs text-zinc-400 hidden sm:block">Telegram Management & Security Suite</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Connection Status Badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
            session.isConnected
              ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
              : 'bg-zinc-800/80 border-zinc-700 text-zinc-400'
          }`}
        >
          {session.isConnected ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold">{session.username || 'Connected'}</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span>Offline / No Session</span>
            </>
          )}
        </div>

        {/* Security / Config Status */}
        <div
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono ${
            isConfigured
              ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-300'
              : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
          }`}
        >
          {isConfigured ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>API Credentials Ready</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span>API Not Configured</span>
            </>
          )}
        </div>

        {/* Terminal Launch Button */}
        <button
          onClick={onOpenTerminal}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-mono transition-all shadow-sm active:scale-95"
          title="Open interactive tg-tool CLI terminal"
        >
          <Terminal className="h-3.5 w-3.5 text-cyan-400" />
          <span>CLI Console</span>
        </button>

        {/* Quick Diagnostic Refresh */}
        <button
          onClick={onRefreshDoctor}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          title="Run quick system health audit"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
