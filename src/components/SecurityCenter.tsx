import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Terminal } from 'lucide-react';
import { runSecurityAudits } from '../data/mockData';
import { TelegramConfig, TelegramSession } from '../types';

interface SecurityCenterProps {
  config: TelegramConfig;
  session: TelegramSession;
}

export const SecurityCenter: React.FC<SecurityCenterProps> = ({ config, session }) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [lastAuditTime, setLastAuditTime] = useState<string>('Just now');
  const audits = runSecurityAudits(config, session);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setLastAuditTime(new Date().toLocaleTimeString());
    }, 600);
  };

  const passCount = audits.filter((a) => a.passed).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span>Security & Permissions Center</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Audit file permissions (chmod 600), .gitignore coverage, session isolation, and credential leak protection.
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={isAuditing}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isAuditing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Re-scan Environment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-500">Security Score</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {passCount}/{audits.length} PASS
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Last audit: {lastAuditTime}</div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-500">Config Mode</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">chmod 600</div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Owner Read/Write Only</div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
          <div className="text-xs text-zinc-500">Session Isolation</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">data/</div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Excluded by .gitignore</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-200">Security Checkpoints</h3>

        <div className="space-y-2.5">
          {audits.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex items-start gap-3.5 transition-colors ${
                item.passed
                  ? 'bg-zinc-900/40 border-zinc-800/80 text-zinc-300'
                  : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
              }`}
            >
              {item.passed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              )}

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold font-mono text-zinc-100">{item.title}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      item.passed
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {item.passed ? 'PASSED' : 'WARNING'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-mono">{item.description}</p>
                {!item.passed && (
                  <div className="text-xs text-amber-400 font-mono flex items-center gap-1.5 mt-2 bg-amber-950/40 p-2 rounded border border-amber-900/50">
                    <Terminal className="h-3.5 w-3.5" />
                    <span>Recommended: {item.recommendation}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
