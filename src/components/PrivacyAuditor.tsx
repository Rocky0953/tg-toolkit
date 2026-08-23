import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  AlertTriangle,
  EyeOff,
  FileCheck,
  PhoneOff,
} from 'lucide-react';
import { SAMPLE_CONTACTS } from '../data/mockData';

export const PrivacyAuditor: React.FC = () => {
  const [contacts, setContacts] = useState(SAMPLE_CONTACTS);

  const toggleOptIn = (id: string) => {
    setContacts(
      contacts.map((c) => (c.id === id ? { ...c, isOptedIn: !c.isOptedIn } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-cyan-400" />
          Telegram Privacy & Opt-In Compliance Auditor
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Guarantees ethical contact management, zero unauthorized phone scraping, and explicit opt-in policy enforcement.
        </p>
      </div>

      {/* Privacy Guarantees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
            <PhoneOff className="h-4 w-4" />
            <span>No Phone Harvesting</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Phone numbers are masked in all logs and outputs. TG-TOOLKIT never attempts to discover undisclosed phone numbers.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
            <UserCheck className="h-4 w-4" />
            <span>Explicit Consent</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Only contacts with verified opt-in authorization can be migrated or invited to groups. Force-adding is strictly blocked.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
            <Lock className="h-4 w-4" />
            <span>Local Boundary</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All audit logs and session cryptographic tokens remain local. No telemetry or credentials are sent to external analytics.
          </p>
        </div>
      </div>

      {/* Contact Opt-in List */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-cyan-400" />
              Contact Privacy Roster ({contacts.length})
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Verified mutual contacts and explicit consent flags.
            </p>
          </div>
        </div>

        <div className="divide-y divide-zinc-800 overflow-x-auto">
          {contacts.map((contact) => (
            <div key={contact.id} className="p-4 flex items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-200">
                  {contact.firstName[0]}
                </div>
                <div>
                  <div className="font-bold text-zinc-200 flex items-center gap-2">
                    <span>
                      {contact.firstName} {contact.lastName || ''}
                    </span>
                    {contact.username && <span className="text-cyan-400 text-[11px]">{contact.username}</span>}
                  </div>
                  <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1 text-zinc-500">
                      <EyeOff className="h-3 w-3" />
                      {contact.phoneMasked}
                    </span>
                    <span>•</span>
                    <span className={contact.isMutual ? 'text-emerald-400' : 'text-zinc-500'}>
                      {contact.isMutual ? 'Mutual Contact' : 'Single Contact'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleOptIn(contact.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                    contact.isOptedIn
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  {contact.isOptedIn ? (
                    <>
                      <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Opted-In</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                      <span>Not Opted In</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
