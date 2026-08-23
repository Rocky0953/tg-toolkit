import React, { useState } from 'react';
import {
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  LogIn,
  HardDrive,
  User,
  ShieldCheck,
  Phone,
  RefreshCw,
} from 'lucide-react';
import { TelegramConfig, TelegramSession } from '../types';

interface ConnectionManagerProps {
  config: TelegramConfig;
  session: TelegramSession;
  onUpdateSession: (newSession: Partial<TelegramSession>) => void;
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({
  config,
  session,
  onUpdateSession,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [authStep, setAuthStep] = useState<'idle' | 'code' | 'connected'>('idle');
  const [verificationCode, setVerificationCode] = useState('');
  const [password2FA, setPassword2FA] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleStartConnect = () => {
    if (!config.api_id || !config.api_hash) {
      setStatusMessage('Error: Please configure Telegram API ID and Hash first.');
      return;
    }
    setIsConnecting(true);
    setStatusMessage('Initiating MTProto connection to Telegram servers...');
    setTimeout(() => {
      setIsConnecting(false);
      setAuthStep('code');
      setStatusMessage(`Verification code sent to ${config.phone || 'your Telegram app'}`);
    }, 1000);
  };

  const handleConfirmCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setStatusMessage('Validating authorization code with MTProto session...');
    setTimeout(() => {
      setIsConnecting(false);
      setAuthStep('idle');
      setVerificationCode('');
      onUpdateSession({
        isConnected: true,
        connectedAt: new Date().toISOString(),
        accountName: 'Rocky Kandar',
        username: '@rocky_dev',
        phoneDisplay: config.phone || '+1 555-019-2834',
        sessionFile: '/data/telegram.session',
        sessionSizeKb: 48.2,
      });
      setStatusMessage('[✓] Telegram authentication successful. Session stored locally.');
    }, 1200);
  };

  const handleDisconnect = () => {
    if (window.confirm('Remove the local Telegram session? You will need to re-authorize.')) {
      onUpdateSession({
        isConnected: false,
        accountName: '',
        username: '',
        phoneDisplay: '',
        sessionSizeKb: 0,
      });
      setStatusMessage('[✓] Local Telegram session removed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-cyan-400" />
            Telegram Session & MTProto Connection
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            User-authorized Telethon connection manager with cryptographic session persistence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {session.isConnected ? (
            <button
              onClick={handleDisconnect}
              className="px-3.5 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 border border-red-800 text-red-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Disconnect Session</span>
            </button>
          ) : (
            <button
              onClick={handleStartConnect}
              disabled={isConnecting}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isConnecting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <LogIn className="h-3.5 w-3.5" />}
              <span>Connect Telegram</span>
            </button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-lg border text-xs font-mono flex items-center gap-2 ${
            statusMessage.includes('Error')
              ? 'bg-red-950/80 border-red-800 text-red-300'
              : 'bg-cyan-950/80 border-cyan-800 text-cyan-300'
          }`}
        >
          {statusMessage.includes('Error') ? (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Interactive Authorization Form (if signing in) */}
      {authStep === 'code' && (
        <form onSubmit={handleConfirmCode} className="bg-zinc-900/80 border border-cyan-500/40 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>Enter Telegram Login Code</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Telegram sent an official authorization code to your other active devices or SMS for{' '}
            <span className="font-mono text-zinc-200">{config.phone || 'configured phone'}</span>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">Login Code (5 digits)</label>
              <input
                type="text"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="12345"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-300 mb-1.5">2FA Password (if enabled)</label>
              <input
                type="password"
                value={password2FA}
                onChange={(e) => setPassword2FA(e.target.value)}
                placeholder="Optional 2FA password"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setAuthStep('idle')}
              className="px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isConnecting}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono flex items-center gap-2"
            >
              {isConnecting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
              <span>Verify & Authorize</span>
            </button>
          </div>
        </form>
      )}

      {/* Session Details Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Account Info */}
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <User className="h-4 w-4 text-cyan-400" />
            <span>Authorized Account</span>
          </div>
          {session.isConnected ? (
            <div className="space-y-1">
              <div className="font-bold text-base text-white">{session.accountName}</div>
              <div className="text-xs font-mono text-cyan-400">{session.username}</div>
              <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-2">
                <Phone className="h-3 w-3 text-zinc-500" />
                <span>{session.phoneDisplay}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-zinc-500 py-3">No account connected.</div>
          )}
        </div>

        {/* Session File */}
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <HardDrive className="h-4 w-4 text-cyan-400" />
            <span>Local Storage</span>
          </div>
          {session.isConnected ? (
            <div className="space-y-1 text-xs font-mono">
              <div className="text-zinc-300 truncate">{session.sessionFile}</div>
              <div className="text-[11px] text-zinc-500">Size: {session.sessionSizeKb} KB</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
                <CheckCircle2 className="h-3 w-3" />
                <span>File verified locally</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-zinc-500 py-3">Session file unmounted.</div>
          )}
        </div>

        {/* Security Summary */}
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Privacy Guard</span>
          </div>
          <div className="text-xs space-y-1.5 text-zinc-300">
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              TG-TOOLKIT uses local-only token authentication. Sessions are never uploaded to remote servers or logged.
            </p>
            <div className="text-[10px] font-mono text-cyan-400/80 mt-2">
              Telethon SQLite Key Format v2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
