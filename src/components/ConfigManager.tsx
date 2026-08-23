import React, { useState } from 'react';
import {
  Key,
  Shield,
  Phone,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  FileCode,
  ShieldAlert,
} from 'lucide-react';
import { TelegramConfig, TelegramSession } from '../types';
import { runSecurityAudits } from '../data/mockData';

interface ConfigManagerProps {
  config: TelegramConfig;
  session: TelegramSession;
  onSaveConfig: (newConfig: TelegramConfig) => void;
  onResetConfig: () => void;
}

export const ConfigManager: React.FC<ConfigManagerProps> = ({
  config,
  session,
  onSaveConfig,
  onResetConfig,
}) => {
  const [formData, setFormData] = useState<TelegramConfig>({ ...config });
  const [showHash, setShowHash] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'security' | 'json'>('edit');

  const securityAudits = runSecurityAudits(formData, session);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...formData,
      updated_at: new Date().toISOString(),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('This will remove the local Telegram configuration. Continue?')) {
      onResetConfig();
      setFormData({
        api_id: '',
        api_hash: '',
        phone: '',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Lock className="h-5 w-5 text-cyan-400" />
            Telegram API Configuration & Security
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Local credentials configuration stored in isolated storage with chmod 600 access simulation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTab === 'edit'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTab === 'security'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Security Audits
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTab === 'json'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            JSON Spec
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-lg text-xs font-mono">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>[✓] config/config.json saved locally with permissions 600. Secrets remain protected.</span>
        </div>
      )}

      {activeTab === 'edit' && (
        <form onSubmit={handleSubmit} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-5">
          <div className="space-y-4">
            {/* API ID */}
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-cyan-400" />
                  Telegram API ID (Numeric)
                </span>
                <span className="text-[11px] text-zinc-500">From my.telegram.org</span>
              </label>
              <input
                type="text"
                value={formData.api_id}
                onChange={(e) => setFormData({ ...formData, api_id: e.target.value.trim() })}
                placeholder="e.g. 18492034"
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>

            {/* API Hash */}
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-cyan-400" />
                  Telegram API Hash
                </span>
                <button
                  type="button"
                  onClick={() => setShowHash(!showHash)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {showHash ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {showHash ? 'Hide Hash' : 'Show Hash'}
                </button>
              </label>
              <div className="relative">
                <input
                  type={showHash ? 'text' : 'password'}
                  value={formData.api_hash}
                  onChange={(e) => setFormData({ ...formData, api_hash: e.target.value.trim() })}
                  placeholder="32-character hexadecimal hash"
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-cyan-400" />
                  Account Phone Number (International format)
                </span>
                <span className="text-[11px] text-zinc-500">e.g. +1 555-019-2834</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555 019 2834"
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-medium flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span>Save Local Config</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-red-950 hover:text-red-300 hover:border-red-800 border border-zinc-700 text-zinc-400 rounded-lg text-xs font-mono flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Configuration</span>
            </button>
          </div>
        </form>
      )}

      {activeTab === 'security' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-cyan-400" />
              Configuration Security Check
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">Strict isolation active</span>
          </div>

          <div className="space-y-3">
            {securityAudits.map((audit) => (
              <div
                key={audit.id}
                className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800 flex items-start gap-3 text-xs"
              >
                {audit.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="font-mono font-semibold text-zinc-200">{audit.title}</div>
                  <p className="text-zinc-400 text-[11px]">{audit.description}</p>
                  <p className="text-cyan-400 text-[11px] font-mono">Recommendation: {audit.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'json' && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <FileCode className="h-4 w-4 text-cyan-400" />
              config/config.json Preview
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">File Mode: 600 (Private)</span>
          </div>

          <pre className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-cyan-300 overflow-x-auto">
{JSON.stringify(
  {
    api_id: formData.api_id || "YOUR_API_ID",
    api_hash: formData.api_hash ? "********************************" : "YOUR_API_HASH",
    phone: formData.phone || "YOUR_PHONE_IF_NEEDED",
  },
  null,
  2
)}
          </pre>
        </div>
      )}
    </div>
  );
};
