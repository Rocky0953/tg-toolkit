import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, Maximize2, Minimize2, Copy, Check } from 'lucide-react';
import { TelegramConfig, TelegramSession } from '../types';
import { resolveUsernameToNumber } from '../data/mockData';

interface TerminalProps {
  config: TelegramConfig;
  session: TelegramSession;
  onUpdateConfig: (newConfig: Partial<TelegramConfig>) => void;
  onUpdateSession: (newSession: Partial<TelegramSession>) => void;
}

interface CommandLog {
  id: string;
  type: 'command' | 'output' | 'error' | 'system';
  text: string;
  timestamp: string;
}

export const Terminal: React.FC<TerminalProps> = ({ config, session, onUpdateConfig: _onUpdateConfig, onUpdateSession }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialLogs: CommandLog[] = [
    {
      id: 'init_1',
      type: 'system',
      text: '╔════════════════════════════════════════════════════════════╗\n║                    TG-TOOLKIT v1.4.0-dev                   ║\n║            Telegram Management CLI for Termux/Web          ║\n╚════════════════════════════════════════════════════════════╝\nType "tg-tool" or "help" for a list of available subcommands.\n',
      timestamp: new Date().toLocaleTimeString(),
    },
  ];

  const [logs, setLogs] = useState<CommandLog[]>(initialLogs);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (text: string, type: CommandLog['type'] = 'output') => {
    setLogs((prev) => [
      ...prev,
      {
        id: 'log_' + Math.random().toString(36).substring(2, 9),
        type,
        text,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Add command to logs & history
    addLog(`$ ${cmd}`, 'command');
    setHistory((prev) => [...prev, cmd]);
    setHistoryIdx(-1);

    const parts = cmd.split(/\s+/);
    const primary = parts[0];
    const sub = parts[1];

    if (cmd === 'clear' || cmd === 'cls') {
      setLogs([]);
      return;
    }

    if (cmd === 'help') {
      addLog(
        `Usage: tg-tool [subcommand]\n\nAvailable commands:\n  tg-tool doctor             Run System Doctor diagnostics\n  tg-tool config             Display or adjust API credentials\n  tg-tool connect            Connect to Telegram MTProto session\n  tg-tool status             Check active session and local storage\n  tg-tool u2n <username>     Resolve username to numeric User ID & Phone\n  tg-tool n2u <id|phone>     Resolve numeric ID or phone to username\n  tg-tool disconnect         Remove saved Telegram session\n  tg-tool update             Check GitHub repository for upstream changes\n  tg-tool security           Execute local configuration security audit\n  tg-tool version            Print installed version\n  clear                      Clear terminal console screen`
      );
      return;
    }

    if (primary === 'tg-tool' || primary === './tg-tool') {
      if (!sub || sub === 'help' || sub === '--help' || sub === '-h') {
        addLog(
          `╔══════════════════════════════════════╗\n║          TG-TOOLKIT v1.4.0-dev       ║\n║       Telegram Management CLI        ║\n╚══════════════════════════════════════╝\n\n[1] 👤 Username Tools (tg-tool u2n @handle)\n[2] 📱 Contact & Privacy\n[3] 👥 Group Manager\n[4] 📊 Analytics\n[5] 🔗 Invite Manager\n[6] 📁 CSV Tools\n[7] 🛡️ Security\n[8] ⚙️ Settings\n[9] 🩺 System Doctor\n[U] 🔄 Check Updates\n[0] 🚪 Exit\n\nRun 'tg-tool <subcommand>' (e.g. 'tg-tool u2n rocky_dev', 'tg-tool doctor')`
        );
      } else if (sub === 'u2n' || sub === 'phone' || sub === 'getphone' || sub === 'username2number' || sub === 'resolve') {
        const targetUsername = parts[2] || 'rocky_dev';
        const res = resolveUsernameToNumber(targetUsername);
        addLog(
          `\nTelegram Username to Phone Number (MTProto Lookup)\n────────────────────────────────────────\n  Target Handle : @${res.username} (${res.name})\n  📱 Phone Number: ${res.phoneNumber}\n  🌍 Country     : ${res.countryFlag} ${res.country} (${res.countryCode})\n  📡 SIM Carrier : ${res.carrier} (${res.lineType})\n  🆔 Numeric ID  : ${res.numericId} (user_id)\n  🌐 Data Center : ${res.dcLocation}\n  💬 WhatsApp    : ${res.whatsappLink || 'N/A'}\n  🔗 Telegram    : https://t.me/${res.username}\n────────────────────────────────────────\nStatus: Resolved phone number in 16ms.`
        );
      } else if (sub === 'n2u' || sub === 'number2username') {
        const targetNum = parts[2] || '5829104712';
        const res = resolveUsernameToNumber(targetNum === '5829104712' ? 'rocky_dev' : `id_${targetNum}`);
        addLog(
          `\nNumber to Username (Reverse Directory Lookup)\n────────────────────────────────────────\n  Query Number  : ${targetNum}\n  Username      : @${res.username}\n  Numeric ID    : ${res.numericId}\n  Data Center   : ${res.dcLocation}\n  Web Link      : https://t.me/${res.username}\n────────────────────────────────────────\nStatus: Resolved successfully.`
        );
      } else if (sub === 'doctor') {
        addLog(
          `\nTG-TOOLKIT System Doctor v1.1\n────────────────────────────────────────\n  [✓] Web / Node.js Environment (Node.js 22.x)\n  [✓] Shell: /bin/bash compatible\n  [✓] Bash: GNU bash, version 5.2.15(1)-release\n  [✓] Git: git version 2.43.0\n  [✓] Python: Python 3.11.8 (Telethon runtime active)\n  [✓] Directory: config/ (chmod 700)\n  [✓] Directory: data/ (isolated session path)\n  [✓] Directory: logs/\n  [✓] Git checkout detected (branch: main)\n  [✓] Git remote configured (https://github.com/Rocky0953/tg-toolkit)\n  ${
            config.api_id && config.api_hash
              ? `[✓] Telegram API: ID ${config.api_id}, Hash configured (hidden)`
              : `[!] Telegram API: Not configured`
          }\n  ${
            session.isConnected
              ? `[✓] Session File: ${session.sessionFile} (${session.sessionSizeKb} KB)`
              : `[!] Session File: Not connected`
          }\n  [✓] Internet / MTProto Gateway reachable (38ms)\n────────────────────────────────────────\nPASS: 11   WARNING: 0   ERROR: 0\nStatus: READY\n\nSecurity: secrets, API hashes and Telegram sessions are not displayed by Doctor.`
        );
      } else if (sub === 'status' || sub === 'connection-status') {
        if (session.isConnected) {
          addLog(
            `\n[✓] Local Telegram session exists\n    Account  : ${session.accountName}\n    Username : ${session.username}\n    Phone    : ${session.phoneDisplay}\n    Path     : ${session.sessionFile} (${session.sessionSizeKb} KB)\n    Status   : Authenticated & Active`
          );
        } else {
          addLog(
            `\n[!] No active Telegram session found.\n    Run 'tg-tool connect' or configure API in Settings.`,
            'error'
          );
        }
      } else if (sub === 'config') {
        const maskedPhone =
          config.phone && config.phone.length > 6
            ? config.phone.substring(0, 3) + '*****' + config.phone.slice(-3)
            : 'not configured';
        addLog(
          `\nConfiguration Status\n────────────────────────────────────────\n  ${
            config.api_id ? `[✓] API ID: ${config.api_id}` : `[!] API ID: not configured`
          }\n  ${
            config.api_hash ? `[✓] API Hash: configured (hidden)` : `[!] API Hash: not configured`
          }\n  ${
            config.phone ? `[✓] Phone: ${maskedPhone}` : `[!] Phone: not configured`
          }\n\nTo update credentials, use the API Configuration tab or set_value command.`
        );
      } else if (sub === 'connect') {
        if (!config.api_id || !config.api_hash) {
          addLog(
            `[✗] Cannot authenticate: API ID and API Hash are not configured.\n    Run: tg-tool config`,
            'error'
          );
          return;
        }
        addLog('Connecting to Telegram MTProto Gateway...');
        setTimeout(() => {
          onUpdateSession({
            isConnected: true,
            accountName: 'Rocky Kandar',
            username: '@rocky_dev',
            phoneDisplay: config.phone ? config.phone.substring(0, 4) + '***' + config.phone.slice(-3) : '+1 555-***-2834',
            sessionFile: '/data/telegram.session',
            sessionSizeKb: 48.2,
          });
          addLog(
            `\n[✓] Telegram authentication successful!\n[✓] Account: Rocky Kandar\n[✓] Username: @rocky_dev\n[✓] Session saved locally in /data/telegram.session`
          );
        }, 600);
      } else if (sub === 'disconnect' || sub === 'remove') {
        onUpdateSession({
          isConnected: false,
          username: '',
          accountName: '',
          phoneDisplay: '',
          sessionSizeKb: 0,
        });
        addLog(`\n[✓] Local Telegram session removed.\n[✓] Session cache purged from /data/telegram.session`);
      } else if (sub === 'security') {
        addLog(
          `\nConfiguration Security Check\n────────────────────────────────────────\n  [✓] config/config.json permissions: 600\n  [✓] config/config.json is ignored by Git\n  [✓] config/config.json is not tracked by Git\n  [✓] Telegram session is ignored by Git\n\nSecrets and sessions are never printed by this check.`
        );
      } else if (sub === 'update') {
        addLog(
          `\nChecking GitHub for updates...\n  [✓] Remote: https://github.com/Rocky0953/tg-toolkit.git\n  [✓] Branch: main\n  [✓] Local commit:  7a3f8902c11d\n  [✓] Remote commit: 7a3f8902c11d\n  [✓] Already up to date (v1.4.0-dev).`
        );
      } else if (sub === 'version') {
        addLog('1.4.0-dev');
      } else {
        addLog(`Unknown tg-tool subcommand: "${sub}". Type "tg-tool help" for usage.`, 'error');
      }
      return;
    }

    if (cmd.startsWith('python modules/telegram_connect.py')) {
      if (cmd.includes('connect')) {
        addLog('[✓] Telegram authentication successful\n[✓] Account: Rocky Kandar\n[✓] Username: @rocky_dev\n[✓] Session saved locally');
        onUpdateSession({ isConnected: true });
      } else if (cmd.includes('status')) {
        addLog(`[✓] Local Telegram session exists\n    Session: /data/telegram.session`);
      } else if (cmd.includes('remove')) {
        addLog(`[✓] Local Telegram session removed`);
        onUpdateSession({ isConnected: false });
      } else {
        addLog('Usage: python modules/telegram_connect.py [connect|status|remove]');
      }
      return;
    }

    if (cmd === 'version') {
      addLog('v1.4.0-dev');
      return;
    }

    if (cmd === 'ls') {
      addLog('config/  data/  logs/  modules/  README.md  tg-tool  package.json');
      return;
    }

    if (cmd.startsWith('cat config/config.json')) {
      addLog(
        JSON.stringify(
          {
            api_id: config.api_id ? config.api_id : '',
            api_hash: config.api_hash ? '********' : '',
            phone: config.phone ? config.phone : '',
          },
          null,
          2
        )
      );
      return;
    }

    addLog(`bash: command not found: ${primary}. Type 'help' for TG-TOOLKIT commands.`, 'error');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx + 1 < history.length ? historyIdx + 1 : historyIdx;
        setHistoryIdx(nextIdx);
        setInput(history[history.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInput(history[history.length - 1 - nextIdx] || '');
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInput('');
      }
    }
  };

  const handleCopyLogs = () => {
    const text = logs.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickCommands = [
    'tg-tool',
    'tg-tool u2n @rocky_dev',
    'tg-tool u2n @durov',
    'tg-tool doctor',
    'tg-tool status',
    'tg-tool config',
    'tg-tool connect',
    'tg-tool security',
    'clear',
  ];

  return (
    <div
      className={`flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl transition-all ${
        isExpanded ? 'fixed inset-4 z-50' : 'h-[620px] w-full'
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 ml-2">
            <TerminalIcon className="h-3.5 w-3.5 text-cyan-400" />
            tg-tool ~ bash console
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLogs}
            className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Copy terminal output"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => setLogs([])}
            className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Clear output"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
            title={isExpanded ? 'Restore size' : 'Expand full screen'}
          >
            {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Quick Run Pills */}
      <div className="px-3 py-2 bg-zinc-900/60 border-b border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
        <span className="text-zinc-500 shrink-0 mr-1 flex items-center gap-1">
          <Play className="h-3 w-3 text-cyan-400" /> Quick:
        </span>
        {quickCommands.map((q) => (
          <button
            key={q}
            onClick={() => handleCommand(q)}
            className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 transition-colors shrink-0 active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Terminal Output Area */}
      <div
        className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 bg-zinc-950/90 text-zinc-300"
        onClick={() => inputRef.current?.focus()}
      >
        {logs.map((log) => (
          <div key={log.id} className="whitespace-pre-wrap leading-relaxed">
            {log.type === 'command' ? (
              <span className="text-cyan-400 font-bold">{log.text}</span>
            ) : log.type === 'error' ? (
              <span className="text-red-400">{log.text}</span>
            ) : log.type === 'system' ? (
              <span className="text-zinc-400">{log.text}</span>
            ) : (
              <span className="text-zinc-200">{log.text}</span>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Input Line */}
      <div className="flex items-center px-4 py-2.5 bg-zinc-900 border-t border-zinc-800">
        <span className="font-mono text-xs text-emerald-400 font-bold mr-2 select-none">tg-tool$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type tg-tool [doctor|config|connect|status|security]..."
          className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-zinc-100 placeholder-zinc-600"
          autoFocus
        />
        <button
          onClick={() => {
            handleCommand(input);
            setInput('');
          }}
          className="ml-2 px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-[11px] flex items-center gap-1 transition-colors"
        >
          <span>Run</span>
        </button>
      </div>
    </div>
  );
};
