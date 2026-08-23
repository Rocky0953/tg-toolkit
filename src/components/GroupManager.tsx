import React, { useState } from 'react';
import { Users, Link2, Plus, Check } from 'lucide-react';
import { SAMPLE_GROUPS } from '../data/mockData';
import { TelegramGroup } from '../types';

export const GroupManager: React.FC = () => {
  const [groups, setGroups] = useState<TelegramGroup[]>(SAMPLE_GROUPS);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupType, setNewGroupType] = useState<'supergroup' | 'group' | 'channel'>('supergroup');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCopyLink = (code: string) => {
    navigator.clipboard.writeText(`https://t.me/+opt_${code}`);
    setCopiedLink(code);
    setTimeout(() => setCopiedLink(null), 1500);
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupTitle.trim()) return;
    const newGrp: TelegramGroup = {
      id: `grp_${Date.now()}`,
      title: newGroupTitle.trim(),
      memberCount: 1,
      type: newGroupType,
      canInvite: true,
      privacy: 'public',
      lastActivity: 'Just now',
    };
    setGroups([newGrp, ...groups]);
    setNewGroupTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Users className="h-5 w-5 text-cyan-400" />
            Telegram Group & Channel Manager
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Group structure inspector, opt-in invite link generator, and migration status.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-medium flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Register Group</span>
        </button>
      </div>

      {showAddModal && (
        <form onSubmit={handleAddGroup} className="bg-zinc-900 border border-cyan-500/40 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono font-bold text-white">Register Target Telegram Group / Channel</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">Group Title</label>
              <input
                type="text"
                required
                value={newGroupTitle}
                onChange={(e) => setNewGroupTitle(e.target.value)}
                placeholder="e.g. Developer Community"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">Entity Type</label>
              <select
                value={newGroupType}
                onChange={(e) => setNewGroupType(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 outline-none focus:border-cyan-500"
              >
                <option value="supergroup">Supergroup (up to 200,000 members)</option>
                <option value="group">Basic Group</option>
                <option value="channel">Broadcast Channel</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono rounded-lg"
            >
              Save Entity
            </button>
          </div>
        </form>
      )}

      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                  <span>{group.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-cyan-400 border border-zinc-700">
                    {group.type}
                  </span>
                </div>
                {group.username && <div className="text-xs font-mono text-cyan-400">{group.username}</div>}
              </div>

              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1 bg-zinc-800 px-2.5 py-1 rounded-md">
                <Users className="h-3 w-3 text-zinc-500" />
                <span>{group.memberCount.toLocaleString()} members</span>
              </span>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-[11px] text-zinc-500">Activity: {group.lastActivity}</span>
              <button
                onClick={() => handleCopyLink(group.id)}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1.5 border border-zinc-700 transition-colors"
              >
                {copiedLink === group.id ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Link2 className="h-3.5 w-3.5 text-cyan-400" />
                )}
                <span>{copiedLink === group.id ? 'Copied' : 'Opt-in Link'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
