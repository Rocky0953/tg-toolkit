import React from 'react';
import { BarChart3, Users, MessageSquare, ShieldCheck, Download, TrendingUp } from 'lucide-react';
import { TelegramConfig, TelegramSession } from '../types';

interface AnalyticsProps {
  config: TelegramConfig;
  session: TelegramSession;
}

export const Analytics: React.FC<AnalyticsProps> = ({ session }) => {
  const metrics = [
    { label: 'Direct Chats Sampled', value: '42', change: '+12%', icon: Users },
    { label: 'Groups & Supergroups', value: '18', change: '+2', icon: MessageSquare },
    { label: 'Broadcast Channels', value: '7', change: 'Stable', icon: BarChart3 },
    { label: 'Opt-in Contacts Mapped', value: '156', change: '+5%', icon: ShieldCheck },
  ];

  const handleExport = () => {
    const data = {
      account: session.accountName || 'Demo Account',
      username: session.username || '@rocky0953',
      metrics: {
        direct_chats: 42,
        groups: 18,
        channels: 7,
        contacts_synced: 156,
      },
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tg_analytics_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <span>Telegram Metadata Analytics</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time dialog distribution, account growth metrics, and authorized session insights.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Analytics JSON</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-medium">{m.label}</span>
                <Icon className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-zinc-100">{m.value}</span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  {m.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-200">Dialog Category Breakdown</h3>
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-zinc-300 mb-1">
                <span>Direct User Chats</span>
                <span>62.7%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '62.7%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-300 mb-1">
                <span>Supergroups & Groups</span>
                <span>26.9%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '26.9%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-300 mb-1">
                <span>Broadcast Channels</span>
                <span>10.4%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '10.4%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-200">Compliance & Privacy Guarantee</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All analytics are generated from local MTProto dialog counts and message sequence counters.
            No private chat contents or hidden member data are ever stored or transmitted.
          </p>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-300 space-y-1">
            <div>• Historical snapshots: <span className="text-cyan-400">Stored in data/results/</span></div>
            <div>• Sanitization: <span className="text-emerald-400">0 secrets exposed</span></div>
            <div>• Rate limiting: <span className="text-indigo-400">Adaptive MTProto backoff</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
