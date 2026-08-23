import React, { useState } from 'react';
import {
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Search,
  CheckCheck,
  Shield,
} from 'lucide-react';
import { DoctorReport, TelegramConfig, TelegramSession } from '../types';
import { runDoctorChecks } from '../data/mockData';

interface SystemDoctorProps {
  config: TelegramConfig;
  session: TelegramSession;
  onRefreshDoctor: () => void;
}

export const SystemDoctor: React.FC<SystemDoctorProps> = ({ config, session }) => {
  const [report, setReport] = useState<DoctorReport>(() => runDoctorChecks(config, session));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleRunDoctor = () => {
    setIsScanning(true);
    setTimeout(() => {
      setReport(runDoctorChecks(config, session));
      setIsScanning(false);
    }, 600);
  };

  const categories = ['all', 'Environment', 'Dependencies', 'Structure', 'Git & Version', 'Network'];

  const filteredChecks = report.checks.filter((check) => {
    const matchesCategory = selectedCategory === 'all' || check.category === selectedCategory;
    const matchesSearch =
      check.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.detail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-cyan-400" />
            TG-TOOLKIT System Doctor v1.1
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Automated environment, structure, security, and connectivity diagnostic engine.
          </p>
        </div>

        <button
          onClick={handleRunDoctor}
          disabled={isScanning}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-medium flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Running Doctor...' : 'Re-run Diagnostics'}</span>
        </button>
      </div>

      {/* Summary Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-zinc-400">System Status</div>
            <div
              className={`text-sm font-bold font-mono mt-1 ${
                report.status === 'READY'
                  ? 'text-emerald-400'
                  : report.status === 'READY WITH WARNINGS'
                  ? 'text-amber-400'
                  : 'text-red-400'
              }`}
            >
              {report.status}
            </div>
          </div>
          <div
            className={`h-10 w-10 rounded-lg flex items-center justify-center ${
              report.status === 'READY'
                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                : 'bg-amber-950/80 border border-amber-800 text-amber-400'
            }`}
          >
            {report.status === 'READY' ? <CheckCheck className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-zinc-400">Passed Checks</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">{report.pass}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-zinc-400">Warnings</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-0.5">{report.warning}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-zinc-400">Critical Errors</div>
            <div className="text-2xl font-bold font-mono text-red-400 mt-0.5">{report.error}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search diagnostics..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-500 outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Diagnostics List */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
        {filteredChecks.map((item) => (
          <div
            key={item.id}
            className="p-4 flex items-start justify-between gap-4 hover:bg-zinc-900/80 transition-colors"
          >
            <div className="flex items-start gap-3">
              {item.status === 'pass' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : item.status === 'warning' ? (
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-zinc-200">{item.label}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 font-mono">{item.detail}</p>
              </div>
            </div>

            <span
              className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded uppercase shrink-0 ${
                item.status === 'pass'
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                  : item.status === 'warning'
                  ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                  : 'bg-red-950/80 text-red-400 border border-red-800'
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>

      {/* Security Footer Notice */}
      <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-center gap-3 text-xs text-zinc-400 font-mono">
        <Shield className="h-4 w-4 text-cyan-400 shrink-0" />
        <span>Doctor Privacy Guarantee: Secrets, API hashes, and Telegram session keys are never logged or exposed.</span>
      </div>
    </div>
  );
};
