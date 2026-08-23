import React, { useState } from 'react';
import { Link2, Plus, Copy, Check, ShieldCheck } from 'lucide-react';
import { InviteLinkRecord } from '../types';

export const InviteManager: React.FC = () => {
  const [invites, setInvites] = useState<InviteLinkRecord[]>([
    {
      id: 'inv_1',
      code: 'https://t.me/+AbCdEfGh123',
      title: 'Official Community Onboarding',
      groupTitle: 'Termux & Linux Developers',
      createdDate: '2026-08-20',
      memberLimit: 100,
      joinedCount: 38,
      isActive: true,
      expiresAt: '2026-09-20',
    },
    {
      id: 'inv_2',
      code: 'https://t.me/+XyZ987WvU456',
      title: 'Documentation Contributors',
      groupTitle: 'TG-TOOLKIT Core Contributors',
      createdDate: '2026-08-15',
      memberLimit: 25,
      joinedCount: 12,
      isActive: true,
      expiresAt: '2026-08-30',
    },
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newInviteName, setNewInviteName] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupTitle || !newInviteName) return;

    const randomStr = Math.random().toString(36).substring(2, 10);
    const newRecord: InviteLinkRecord = {
      id: `inv_${Date.now()}`,
      code: `https://t.me/+${randomStr}`,
      title: newInviteName,
      groupTitle: newGroupTitle,
      createdDate: new Date().toISOString().split('T')[0],
      memberLimit: 50,
      joinedCount: 0,
      isActive: true,
      expiresAt: 'In 30 days',
    };

    setInvites([newRecord, ...invites]);
    setNewGroupTitle('');
    setNewInviteName('');
  };

  const handleRevoke = (id: string) => {
    setInvites(invites.map((inv) => (inv.id === id ? { ...inv, isActive: false } : inv)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2.5">
            <Link2 className="h-5 w-5 text-cyan-400" />
            <span>Invite Manager</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Create, audit, and revoke administrative invite links for authorized groups and channels.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Plus className="h-4 w-4 text-cyan-400" />
            <span>Generate New Invite Link</span>
          </h3>

          <form onSubmit={handleCreateInvite} className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Group / Channel Title</label>
              <input
                type="text"
                value={newGroupTitle}
                onChange={(e) => setNewGroupTitle(e.target.value)}
                placeholder="e.g. Termux Python Hub"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Link Label</label>
              <input
                type="text"
                value={newInviteName}
                onChange={(e) => setNewInviteName(e.target.value)}
                placeholder="e.g. Beta Tester Onboarding"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors mt-2"
            >
              Export MTProto Invite Link
            </button>
          </form>

          <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg flex items-start gap-2.5 text-[11px] text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Only works on groups where the authenticated account has Change Chat Info or Invite Users permission.</span>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-200">Active Administrative Invites</h3>
          
          <div className="space-y-2.5">
            {invites.map((inv) => (
              <div
                key={inv.id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-100">{inv.title}</span>
                    <span className="text-xs text-zinc-400 font-mono">({inv.groupTitle})</span>
                    {inv.isActive ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                        Revoked
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-cyan-400">{inv.code}</div>
                  <div className="text-[11px] font-mono text-zinc-500">
                    Joined: {inv.joinedCount}/{inv.memberLimit} • Expires: {inv.expiresAt}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(inv.id, inv.code)}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs transition-colors flex items-center gap-1.5"
                    title="Copy Link"
                  >
                    {copiedId === inv.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span className="text-[11px]">Copy</span>
                  </button>

                  {inv.isActive && (
                    <button
                      onClick={() => handleRevoke(inv.id)}
                      className="px-2.5 py-2 bg-red-950/60 hover:bg-red-900/60 text-red-400 border border-red-900/60 rounded-lg text-xs transition-colors"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
