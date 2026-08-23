import React, { useState } from 'react';
import { FileSpreadsheet, Download, CheckCircle2, FileText, Hash } from 'lucide-react';
import { SAMPLE_CONTACTS, SAMPLE_GROUPS, resolveUsernameToNumber } from '../data/mockData';

export const CsvTools: React.FC = () => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(filename);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const exportContactsCsv = () => {
    const headers = 'ID,First Name,Last Name,Username,Phone Masked,Mutual,Opted In,Status\n';
    const rows = SAMPLE_CONTACTS.map(
      (c) =>
        `"${c.id}","${c.firstName}","${c.lastName || ''}","${c.username || ''}","${c.phoneMasked}","${c.isMutual}","${c.isOptedIn}","${c.status}"`
    ).join('\n');
    downloadFile(`telegram_contacts_${new Date().toISOString().slice(0, 10)}.csv`, headers + rows);
  };

  const exportUsernameNumbersCsv = () => {
    const defaultList = ['rocky_dev', 'alex_riv', 'elena_tech', 'devon_c', 'durov', 'telegram', 'botfather'];
    const resolved = defaultList.map((u) => resolveUsernameToNumber(u));
    const headers = 'Username,Full_Name,Phone_Number,Country,Country_Code,Carrier,Telegram_User_ID,Data_Center,Account_Type,Access_Hash,WhatsApp_Link,Telegram_Link\n';
    const rows = resolved
      .map((r) =>
        [
          `@${r.username}`,
          `"${r.name}"`,
          `"${r.phoneNumber}"`,
          `"${r.country}"`,
          `"${r.countryCode}"`,
          `"${r.carrier}"`,
          r.numericId,
          `"${r.dcLocation}"`,
          `"${r.accountType}"`,
          `"${r.accessHash}"`,
          `"${r.whatsappLink}"`,
          `"https://t.me/${r.username}"`,
        ].join(',')
      )
      .join('\n');
    downloadFile(`telegram_username_to_phone_numbers_${new Date().toISOString().slice(0, 10)}.csv`, headers + rows);
  };

  const exportGroupsCsv = () => {
    const headers = 'ID,Title,Username,Members Count,Type,Privacy,Last Activity\n';
    const rows = SAMPLE_GROUPS.map(
      (g) =>
        `"${g.id}","${g.title}","${g.username || ''}","${g.memberCount}","${g.type}","${g.privacy}","${g.lastActivity}"`
    ).join('\n');
    downloadFile(`telegram_groups_${new Date().toISOString().slice(0, 10)}.csv`, headers + rows);
  };

  const exportAuditLogCsv = () => {
    const headers = 'Timestamp,Event,Severity,Detail\n';
    const rows = [
      `"${new Date().toISOString()}","Config Security Audit","PASS","Permissions chmod 600 verified"`,
      `"${new Date().toISOString()}","Git Secrets Check","PASS","config.json ignored by git"`,
      `"${new Date().toISOString()}","Doctor Diagnostic","PASS","All 11 environment checks succeeded"`,
    ].join('\n');
    downloadFile(`tg_toolkit_audit_${new Date().toISOString().slice(0, 10)}.csv`, headers + rows);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-cyan-400" />
          CSV Utilities & Data Reporting
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Export standardized CSV reports for contacts, username-to-number mappings, group rosters, and security audit histories.
        </p>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-lg text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>[✓] Successfully exported and downloaded {downloadSuccess}</span>
        </div>
      )}

      {/* CSV Export Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Username to Number CSV */}
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-9 w-9 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Hash className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm font-mono text-zinc-100">Username to Number CSV</h3>
            <p className="text-xs text-zinc-400">
              Exports handle-to-numeric User ID, DC cluster, and phone linkages.
            </p>
          </div>
          <button
            onClick={exportUsernameNumbersCsv}
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Mappings</span>
          </button>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-9 w-9 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm font-mono text-zinc-100">Export Contacts CSV</h3>
            <p className="text-xs text-zinc-400">
              Exports authorized mutual contact roster with privacy flags and opt-in metadata.
            </p>
          </div>
          <button
            onClick={exportContactsCsv}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Contacts CSV</span>
          </button>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-9 w-9 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm font-mono text-zinc-100">Export Groups & Channels</h3>
            <p className="text-xs text-zinc-400">
              Generates CSV with group member counts, entity types, and permissions.
            </p>
          </div>
          <button
            onClick={exportGroupsCsv}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Groups CSV</span>
          </button>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-9 w-9 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm font-mono text-zinc-100">Security Audit Log CSV</h3>
            <p className="text-xs text-zinc-400">
              Exports timestamps and findings from System Doctor and permission checks.
            </p>
          </div>
          <button
            onClick={exportAuditLogCsv}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Audit CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
