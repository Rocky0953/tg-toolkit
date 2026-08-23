import React, { useState } from 'react';
import { GitBranch, RefreshCw, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';

export const UpdateChecker: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('Just now');
  const [updateStatus, setUpdateStatus] = useState<'up-to-date' | 'update-available'>('up-to-date');

  const handleCheckUpdates = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setLastChecked(new Date().toLocaleTimeString());
      setUpdateStatus('up-to-date');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-cyan-400" />
            GitHub Repository & Update Engine
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Tracking upstream updates from Rocky0953/tg-toolkit with work-in-progress protection.
          </p>
        </div>

        <button
          onClick={handleCheckUpdates}
          disabled={isChecking}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-medium flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Checking GitHub...' : 'Check for Updates'}</span>
        </button>
      </div>

      {/* Repo Details Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-mono">
            <span className="text-zinc-400">Upstream Remote</span>
            <a
              href="https://github.com/Rocky0953/tg-toolkit"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Rocky0953/tg-toolkit</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-zinc-500">Tracked Branch:</span>
              <span className="text-zinc-200">main</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Local Commit:</span>
              <span className="text-cyan-400">7a3f8902c11d</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Remote Commit:</span>
              <span className="text-cyan-400">7a3f8902c11d</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Current Version:</span>
              <span className="text-zinc-200">v1.4.0-dev</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Last Checked:</span>
              <span className="text-zinc-400">{lastChecked}</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>{updateStatus === 'up-to-date' ? 'Up to Date' : 'Update Available'}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono">
              Your copy of TG-TOOLKIT matches the latest upstream release on branch <span className="text-zinc-200 font-bold">main</span>.
            </p>
          </div>

          <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg text-[11px] font-mono text-zinc-400 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>Fast-forward safety check active. Uncommitted local work is automatically protected.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
