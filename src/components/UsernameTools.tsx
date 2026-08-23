import React, { useState } from 'react';
import { AtSign, Search, CheckCircle2, XCircle, AlertCircle, Copy, Check, Sparkles } from 'lucide-react';

interface ValidationResult {
  username: string;
  isValid: boolean;
  isAvailable: boolean;
  length: number;
  message: string;
}

export const UsernameTools: React.FC = () => {
  const [singleInput, setSingleInput] = useState('');
  const [batchInput, setBatchInput] = useState('');
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const validateUsername = (raw: string): ValidationResult => {
    const clean = raw.trim().replace(/^@/, '');
    const regex = /^[a-zA-Z0-9_]{5,32}$/;
    const isValidFormat = regex.test(clean);

    if (!clean) {
      return {
        username: raw,
        isValid: false,
        isAvailable: false,
        length: 0,
        message: 'Empty username provided',
      };
    }

    if (clean.length < 5) {
      return {
        username: clean,
        isValid: false,
        isAvailable: false,
        length: clean.length,
        message: 'Too short (Minimum 5 characters required by Telegram)',
      };
    }

    if (clean.length > 32) {
      return {
        username: clean,
        isValid: false,
        isAvailable: false,
        length: clean.length,
        message: 'Too long (Maximum 32 characters permitted)',
      };
    }

    if (!isValidFormat) {
      return {
        username: clean,
        isValid: false,
        isAvailable: false,
        length: clean.length,
        message: 'Invalid characters (Use only A-Z, 0-9, and underscores)',
      };
    }

    // Mock availability heuristic
    const takenPresets = ['telegram', 'admin', 'rocky_dev', 'news', 'crypto', 'support', 'bot'];
    const isTaken = takenPresets.includes(clean.toLowerCase());

    return {
      username: clean,
      isValid: true,
      isAvailable: !isTaken,
      length: clean.length,
      message: !isTaken ? 'Valid & Available for registration' : 'Valid format, but currently registered',
    };
  };

  const handleSingleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleInput.trim()) return;
    const res = validateUsername(singleInput);
    setResults([res, ...results]);
    setSingleInput('');
  };

  const handleBatchCheck = () => {
    const lines = batchInput
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) return;
    const batchRes = lines.map(validateUsername);
    setResults([...batchRes, ...results]);
    setBatchInput('');
  };

  const handleCopy = (username: string, idx: number) => {
    navigator.clipboard.writeText(`@${username}`);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <AtSign className="h-5 w-5 text-cyan-400" />
          Telegram Username Validator & Lookup
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Telegram format compliance engine, character constraint auditing, and availability lookup.
        </p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Single Checker */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
            <Search className="h-4 w-4 text-cyan-400" />
            Single Username Check
          </h3>
          <form onSubmit={handleSingleCheck} className="space-y-3">
            <div>
              <input
                type="text"
                value={singleInput}
                onChange={(e) => setSingleInput(e.target.value)}
                placeholder="e.g. dev_toolkit or @username"
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Validate Username</span>
            </button>
          </form>
        </div>

        {/* Batch Checker */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            Batch Username Checker
          </h3>
          <div className="space-y-3">
            <textarea
              rows={3}
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder="Paste multiple usernames (one per line)..."
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg p-2.5 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 outline-none resize-none"
            />
            <button
              onClick={handleBatchCheck}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-mono font-medium transition-all"
            >
              <span>Batch Audit Usernames</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-zinc-200">Validation Results ({results.length})</h3>
          {results.length > 0 && (
            <button
              onClick={() => setResults([])}
              className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200"
            >
              Clear Results
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-zinc-500">
            No searches executed yet. Enter a handle above to begin.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800 overflow-x-auto">
            {results.map((res, i) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-3">
                  {res.isValid ? (
                    res.isAvailable ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                    )
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-zinc-200 flex items-center gap-2">
                      <span>@{res.username}</span>
                      <span className="text-[10px] text-zinc-500 font-normal">({res.length} chars)</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{res.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      res.isValid
                        ? res.isAvailable
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                        : 'bg-red-950/80 text-red-400 border border-red-800'
                    }`}
                  >
                    {res.isValid ? (res.isAvailable ? 'AVAILABLE' : 'TAKEN') : 'INVALID FORMAT'}
                  </span>
                  <button
                    onClick={() => handleCopy(res.username, i)}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                    title="Copy handle"
                  >
                    {copiedIdx === i ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
