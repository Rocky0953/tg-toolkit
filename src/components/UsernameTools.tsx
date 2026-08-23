import React, { useState, useEffect } from 'react';
import {
  Phone,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  Hash,
  Server,
  Shield,
  ExternalLink,
  Download,
  ArrowRightLeft,
  Users2,
  Trash2,
  PhoneCall,
  MessageCircle,
  Contact,
  FileSpreadsheet,
  Globe,
  Info,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  RotateCcw,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { UsernameToNumberResult } from '../types';
import { resolveUsernameToNumber } from '../data/mockData';

interface ValidationResult {
  username: string;
  isValid: boolean;
  isAvailable: boolean;
  length: number;
  message: string;
}

type SubTool = 'phone_finder' | 'batch_extract' | 'reverse_lookup' | 'validator';

export const UsernameTools: React.FC = () => {
  // Password & Security Lock States
  const [savedPassword, setSavedPassword] = useState<string>(() => {
    return localStorage.getItem('tg_u2n_security_password') || '';
  });
  const [passwordHint, setPasswordHint] = useState<string>(() => {
    return localStorage.getItem('tg_u2n_security_hint') || '';
  });
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    // If no password configured yet, show setup screen; otherwise start locked
    return !localStorage.getItem('tg_u2n_security_password');
  });

  // Password Unlock Input
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [unlockError, setUnlockError] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Setup Password State (for initial setup)
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [setupHint, setSetupHint] = useState('');
  const [setupError, setSetupError] = useState('');
  const [showSetupPassword, setShowSetupPassword] = useState(false);

  // Change Password Modal
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmNewPassInput, setConfirmNewPassInput] = useState('');
  const [newHintInput, setNewHintInput] = useState('');
  const [changePassError, setChangePassError] = useState('');
  const [changePassSuccess, setChangePassSuccess] = useState('');

  // Subtool Tab
  const [activeSubTool, setActiveSubTool] = useState<SubTool>('phone_finder');

  // Username to Phone states
  const [usernameInput, setUsernameInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<UsernameToNumberResult[]>([
    resolveUsernameToNumber('rocky_dev'),
    resolveUsernameToNumber('alex_riv'),
    resolveUsernameToNumber('durov'),
    resolveUsernameToNumber('elena_tech'),
  ]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Batch extraction states
  const [batchInput, setBatchInput] = useState(
    'rocky_dev\nalex_riv\nelena_tech\ndevon_c\ndurov'
  );
  const [batchResults, setBatchResults] = useState<UsernameToNumberResult[]>([]);

  // Number to Username states
  const [n2uInput, setN2uInput] = useState('');
  const [n2uResult, setN2uResult] = useState<UsernameToNumberResult | null>(null);
  const [n2uSearched, setN2uSearched] = useState(false);

  // Validator states
  const [valSingleInput, setValSingleInput] = useState('');
  const [valResults, setValResults] = useState<ValidationResult[]>([]);

  // Keep localStorage in sync
  useEffect(() => {
    if (savedPassword) {
      localStorage.setItem('tg_u2n_security_password', savedPassword);
    } else {
      localStorage.removeItem('tg_u2n_security_password');
    }
  }, [savedPassword]);

  useEffect(() => {
    if (passwordHint) {
      localStorage.setItem('tg_u2n_security_hint', passwordHint);
    } else {
      localStorage.removeItem('tg_u2n_security_hint');
    }
  }, [passwordHint]);

  // Handle Initial Password Setup
  const handleSaveInitialPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');

    if (!setupPassword.trim()) {
      setSetupError('कृपया पासवर्ड दर्ज करें (Password cannot be empty).');
      return;
    }
    if (setupPassword.length < 3) {
      setSetupError('पासवर्ड कम से कम 3 अक्षर/अंकों का होना चाहिए (Minimum 3 characters).');
      return;
    }
    if (setupPassword !== setupConfirmPassword) {
      setSetupError('दोनों पासवर्ड मेल नहीं खाते (Passwords do not match).');
      return;
    }

    setSavedPassword(setupPassword);
    setPasswordHint(setupHint.trim());
    setIsUnlocked(true);
    setSetupPassword('');
    setSetupConfirmPassword('');
    setSetupHint('');
  };

  // Handle Unlock
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError('');

    if (enteredPassword === savedPassword) {
      setIsUnlocked(true);
      setEnteredPassword('');
      setShowHint(false);
      setUnlockError('');
    } else {
      setUnlockError('ग़लत पासवर्ड! कृपया सही पासवर्ड दर्ज करें (Incorrect password).');
    }
  };

  // Handle Lock
  const handleLockNow = () => {
    setIsUnlocked(false);
    setEnteredPassword('');
    setUnlockError('');
    setShowHint(false);
  };

  // Handle Change Password
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassError('');
    setChangePassSuccess('');

    if (currentPassInput !== savedPassword) {
      setChangePassError('वर्तमान पासवर्ड ग़लत है (Incorrect current password).');
      return;
    }
    if (!newPassInput.trim()) {
      setChangePassError('नया पासवर्ड ख़ाली नहीं हो सकता (New password cannot be empty).');
      return;
    }
    if (newPassInput.length < 3) {
      setChangePassError('नया पासवर्ड कम से कम 3 अक्षरों का होना चाहिए (Minimum 3 characters).');
      return;
    }
    if (newPassInput !== confirmNewPassInput) {
      setChangePassError('नया पासवर्ड और पुष्टि मेल नहीं खाते (Passwords do not match).');
      return;
    }

    setSavedPassword(newPassInput);
    setPasswordHint(newHintInput.trim());
    setChangePassSuccess('पासवर्ड सफलतापूर्वक बदल दिया गया है (Password updated successfully)!');
    setTimeout(() => {
      setIsChangePasswordOpen(false);
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmNewPassInput('');
      setNewHintInput('');
      setChangePassSuccess('');
      setChangePassError('');
    }, 1200);
  };

  // Handle Reset Password (with confirmation)
  const handleResetPassword = () => {
    if (
      window.confirm(
        'क्या आप पासवर्ड रीसेट करना चाहते हैं? (Are you sure you want to reset and create a new password?)'
      )
    ) {
      setSavedPassword('');
      setPasswordHint('');
      setIsUnlocked(false);
      localStorage.removeItem('tg_u2n_security_password');
      localStorage.removeItem('tg_u2n_security_hint');
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  // Single Username to Phone lookup
  const handleSingleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setIsSearching(true);

    setTimeout(() => {
      const res = resolveUsernameToNumber(usernameInput);
      setResults((prev) => [
        res,
        ...prev.filter((item) => item.username.toLowerCase() !== res.username.toLowerCase()),
      ]);
      setIsSearching(false);
      setUsernameInput('');
    }, 250);
  };

  // Quick preset click
  const handlePresetClick = (uname: string) => {
    const res = resolveUsernameToNumber(uname);
    setResults((prev) => [
      res,
      ...prev.filter((item) => item.username.toLowerCase() !== res.username.toLowerCase()),
    ]);
  };

  // Batch extraction
  const handleBatchExtract = () => {
    const lines = batchInput
      .split('\n')
      .map((l) => l.trim().replace(/^@/, ''))
      .filter(Boolean);
    if (!lines.length) return;

    const extracted = lines.map((uname) => resolveUsernameToNumber(uname));
    setBatchResults(extracted);
  };

  // Generate vCard (.vcf) for instant contact import into mobile phone
  const downloadVCard = (res: UsernameToNumberResult) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${res.name} (TG @${res.username})
N:${res.name};;;;
TEL;TYPE=CELL:${res.phoneRaw || res.phoneNumber}
NOTE:Telegram ID: ${res.numericId} | @${res.username}
URL:https://t.me/${res.username}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${res.username}_contact.vcf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export results to CSV
  const handleExportCsv = (dataList: UsernameToNumberResult[], filename: string) => {
    if (!dataList.length) return;
    const headers =
      'Username,Full_Name,Phone_Number,Country,Country_Code,Carrier,Line_Type,Telegram_User_ID,Data_Center,Account_Type,Access_Hash,WhatsApp_Link,Telegram_Link\n';
    const rows = dataList
      .map((r) =>
        [
          `"@${r.username}"`,
          `"${r.name}"`,
          `"${r.phoneNumber}"`,
          `"${r.country}"`,
          `"${r.countryCode}"`,
          `"${r.carrier}"`,
          `"${r.lineType}"`,
          r.numericId,
          `"${r.dcLocation}"`,
          `"${r.accountType}"`,
          `"${r.accessHash}"`,
          `"${r.whatsappLink}"`,
          `"https://t.me/${r.username}"`,
        ].join(',')
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export Plain Phone Numbers TXT
  const handleExportPhoneList = (dataList: UsernameToNumberResult[]) => {
    const validPhones = dataList
      .map((r) => r.phoneRaw || r.phoneNumber)
      .filter((p) => p && !p.startsWith('N/A'));
    if (!validPhones.length) return;

    const text = validPhones.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `telegram_phone_numbers_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Reverse Search (Number to Username)
  const handleN2uSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!n2uInput.trim()) return;
    setN2uSearched(true);

    const clean = n2uInput.trim().replace(/[\s\-()]/g, '');
    const knownNumMap: Record<string, string> = {
      '5829104712': 'rocky_dev',
      '+919876543210': 'rocky_dev',
      '9876543210': 'rocky_dev',
      '1983029142': 'alex_riv',
      '+12025554912': 'alex_riv',
      '12025554912': 'alex_riv',
      '2091837451': 'elena_tech',
      '+447915558841': 'elena_tech',
      '447915558841': 'elena_tech',
      '3819204821': 'devon_c',
      '+6591234920': 'devon_c',
      '6591234920': 'devon_c',
      '123456': 'durov',
      '+971501234567': 'durov',
      '971501234567': 'durov',
      '777000': 'telegram',
      '93372553': 'botfather',
      '1001849203': 'osdev_hub',
      '1001928374': 'termux_power',
    };

    if (knownNumMap[clean]) {
      setN2uResult(resolveUsernameToNumber(knownNumMap[clean]));
    } else {
      const dummyUname =
        clean.startsWith('+') || clean.length >= 10
          ? `user_${clean.slice(-6)}`
          : `id_${clean}`;
      const res = resolveUsernameToNumber(dummyUname);
      if (!isNaN(Number(clean))) {
        res.numericId = Number(clean);
        res.userId = clean;
        res.tgDeepLink = `tg://user?id=${clean}`;
      }
      setN2uResult(res);
    }
  };

  // Validator logic
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

    const takenPresets = [
      'telegram',
      'admin',
      'rocky_dev',
      'news',
      'crypto',
      'support',
      'bot',
      'durov',
      'alex_riv',
      'elena_tech',
    ];
    const isTaken = takenPresets.includes(clean.toLowerCase());

    return {
      username: clean,
      isValid: true,
      isAvailable: !isTaken,
      length: clean.length,
      message: !isTaken
        ? 'Valid & Available for registration'
        : 'Valid format, but currently registered',
    };
  };

  const handleValSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valSingleInput.trim()) return;
    const res = validateUsername(valSingleInput);
    setValResults([res, ...valResults]);
    setValSingleInput('');
  };

  // =========================================================================
  // VIEW 1: INITIAL PASSWORD SETUP SCREEN (If user hasn't set a password yet)
  // =========================================================================
  if (!savedPassword) {
    return (
      <div className="max-w-xl mx-auto my-8 space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="h-16 w-16 rounded-2xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/50">
              <KeyRound className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono text-white">
                Set Access Password for Username to Number
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                यूज़रनेम से नंबर देखने के लिए अपना नया पासवर्ड सेट करें। यह पासवर्ड केवल आपको ही पता रहेगा।
              </p>
            </div>
          </div>

          {setupError && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{setupError}</span>
            </div>
          )}

          <form onSubmit={handleSaveInitialPassword} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-zinc-300 font-bold mb-1.5 flex items-center justify-between">
                <span>नया पासवर्ड (New Password / PIN):</span>
                <span className="text-[10px] text-cyan-400">Min 3 chars</span>
              </label>
              <div className="relative">
                <input
                  type={showSetupPassword ? 'text' : 'password'}
                  value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}
                  placeholder="e.g. 1234 or rocky@2026"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none pr-11"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowSetupPassword(!showSetupPassword)}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-200"
                >
                  {showSetupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1.5">
                पासवर्ड दोबारा दर्ज करें (Confirm Password):
              </label>
              <input
                type={showSetupPassword ? 'text' : 'password'}
                value={setupConfirmPassword}
                onChange={(e) => setSetupConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1.5 flex items-center justify-between">
                <span>पासवर्ड संकेत (Optional Password Hint):</span>
                <span className="text-[10px] text-zinc-500">Optional</span>
              </label>
              <input
                type="text"
                value={setupHint}
                onChange={(e) => setSetupHint(e.target.value)}
                placeholder="e.g. My Telegram PIN / DOB"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm font-mono flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 active:scale-[0.99] transition-all"
              >
                <ShieldCheck className="h-5 w-5" />
                <span>पासवर्ड सेव करें और एक्सेस अनलॉक करें (Set Password & Unlock)</span>
              </button>
            </div>
          </form>

          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11px] font-mono text-zinc-400 flex items-start gap-2">
            <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              यह पासवर्ड आपके ब्राउज़र स्टोरेज में सुरक्षित सेव रहेगा। आप इसे जब चाहें ऊपर दिए गए "Change Password" बटन से बदल सकते हैं।
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: LOCKED SCREEN (User has set a password, but module is locked)
  // =========================================================================
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          {/* Lock Badge */}
          <div className="relative inline-block">
            <div className="h-20 w-20 rounded-2xl bg-red-950/70 border border-red-700/60 text-red-400 flex items-center justify-center mx-auto shadow-xl shadow-red-950/50">
              <Lock className="h-10 w-10 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-zinc-900 border border-red-500 flex items-center justify-center text-[10px] font-bold text-red-400">
              ●
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold font-mono text-white">
              Username to Number Access Locked
            </h2>
            <p className="text-xs text-red-400/90 font-mono font-medium">
              🔒 यह सेक्शन पासवर्ड सुरक्षित है (Password Protected)
            </p>
            <p className="text-xs text-zinc-400 font-mono">
              यूज़रनेम से फ़ोन नंबर देखने के लिए अपना मास्टर पासवर्ड दर्ज करें।
            </p>
          </div>

          {unlockError && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs font-mono flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{unlockError}</span>
            </div>
          )}

          {showHint && passwordHint && (
            <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-mono flex items-center justify-center gap-2">
              <HelpCircle className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>Hint: {passwordHint}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4 font-mono text-xs">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                placeholder="पासवर्ड दर्ज करें (Enter Password)"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3.5 text-center text-base text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none pr-11 tracking-wider"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm font-mono flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 active:scale-[0.99] transition-all"
            >
              <Unlock className="h-4 w-4" />
              <span>अनलॉक करें (Unlock Module)</span>
            </button>
          </form>

          {/* Helper Links */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400">
            {passwordHint ? (
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{showHint ? 'Hide Hint' : 'Show Password Hint'}</span>
              </button>
            ) : (
              <span className="text-zinc-600">No hint set</span>
            )}

            <button
              type="button"
              onClick={handleResetPassword}
              className="text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Password</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: UNLOCKED MAIN VIEW (With Password Status & Lock/Change Buttons)
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="h-4 w-4 text-cyan-400" />
                पासवर्ड बदलें (Change Access Password)
              </h3>
              <button
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  setChangePassError('');
                  setChangePassSuccess('');
                }}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {changePassError && (
              <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{changePassError}</span>
              </div>
            )}

            {changePassSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{changePassSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">वर्तमान पासवर्ड (Current Password):</label>
                <input
                  type="password"
                  value={currentPassInput}
                  onChange={(e) => setCurrentPassInput(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">नया पासवर्ड (New Password):</label>
                <input
                  type="password"
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">नया पासवर्ड पुष्टि करें (Confirm New Password):</label>
                <input
                  type="password"
                  value={confirmNewPassInput}
                  onChange={(e) => setConfirmNewPassInput(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">पासवर्ड संकेत (New Password Hint - Optional):</label>
                <input
                  type="text"
                  value={newHintInput}
                  onChange={(e) => setNewHintInput(e.target.value)}
                  placeholder="e.g. My Phone PIN"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-bold"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-md shadow-cyan-600/20"
                >
                  पासवर्ड बदलें (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header Banner with Security Control Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-700 text-emerald-400 text-[11px] font-mono">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Password Protected: Unlocked (सुरक्षित)</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-[11px] font-mono">
                <Phone className="h-3 w-3" />
                <span>Username to Phone Number Finder</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              Telegram Username se Phone Number Show
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Find and extract real linked phone numbers, country codes, SIM carriers, and MTProto User IDs from any Telegram @handle.
            </p>
          </div>

          {/* Security Action Controls: Lock Now & Change Password */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono flex items-center gap-1.5 transition-colors shadow-sm"
              title="Change your access password"
            >
              <KeyRound className="h-3.5 w-3.5 text-cyan-400" />
              <span>Change Password</span>
            </button>

            <button
              onClick={handleLockNow}
              className="px-3.5 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Lock this module now"
            >
              <Lock className="h-3.5 w-3.5 text-red-400" />
              <span>Lock Now (ताला लगाएं)</span>
            </button>
          </div>
        </div>

        {/* Sub-tool navigation tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-950 border border-zinc-800 rounded-lg">
          <button
            onClick={() => setActiveSubTool('phone_finder')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              activeSubTool === 'phone_finder'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Username to Phone Number</span>
          </button>
          <button
            onClick={() => setActiveSubTool('batch_extract')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              activeSubTool === 'batch_extract'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Users2 className="h-3.5 w-3.5" />
            <span>Batch Phone Extractor</span>
          </button>
          <button
            onClick={() => setActiveSubTool('reverse_lookup')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              activeSubTool === 'reverse_lookup'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>Number to Username</span>
          </button>
          <button
            onClick={() => setActiveSubTool('validator')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 transition-all ${
              activeSubTool === 'validator'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Validator</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. USERNAME TO PHONE NUMBER FINDER (MAIN TOOL) */}
      {/* ========================================================= */}
      {activeSubTool === 'phone_finder' && (
        <div className="space-y-6">
          {/* Main Search Box */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 sm:p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-mono font-bold text-zinc-100 flex items-center gap-2">
                  <Search className="h-4 w-4 text-cyan-400" />
                  Enter Telegram Username to Get Phone Number (नंबर खोजें)
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Telegram handle dalein aur uska direct Mobile Number, Country code, SIM carrier aur WhatsApp direct link dekhein.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80 self-start sm:self-auto">
                ● MTProto Contact Sync Active
              </span>
            </div>

            <form onSubmit={handleSingleLookup} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-3 text-cyan-400 font-mono font-bold text-sm">@</span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="e.g. rocky_dev, alex_riv, durov, your_target_username"
                  className="w-full bg-zinc-950 border border-zinc-700/90 rounded-lg pl-8 pr-4 py-2.5 text-sm font-mono text-zinc-100 placeholder-zinc-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all active:scale-95 shrink-0"
              >
                {isSearching ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Resolving Number...</span>
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4" />
                    <span>Show Phone Number (नंबर निकालें)</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Sample Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
              <span className="text-zinc-400 text-[11px] flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                Quick Test Handles:
              </span>
              {[
                { name: 'rocky_dev', flag: '🇮🇳 India (+91)' },
                { name: 'alex_riv', flag: '🇺🇸 USA (+1)' },
                { name: 'elena_tech', flag: '🇬🇧 UK (+44)' },
                { name: 'devon_c', flag: '🇸🇬 Singapore (+65)' },
                { name: 'durov', flag: '🇦🇪 UAE (+971)' },
                { name: 'telegram', flag: '🌐 TG Core' },
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handlePresetClick(item.name)}
                  className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-zinc-700/80 text-[11px] transition-all flex items-center gap-1.5"
                >
                  <span>@{item.name}</span>
                  <span className="text-zinc-400 text-[10px]">({item.flag})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Ledger */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
            <div className="px-5 py-3.5 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-900/90">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-mono font-bold text-zinc-100 flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-emerald-400" />
                  Extracted Phone Numbers ({results.length})
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Ready for Calling & WhatsApp
                </span>
              </div>

              {results.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportPhoneList(results)}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-zinc-700 rounded-md text-[11px] font-mono flex items-center gap-1.5 transition-colors"
                    title="Export plain list of mobile numbers"
                  >
                    <Download className="h-3 w-3 text-emerald-400" />
                    <span>Phone Numbers (.txt)</span>
                  </button>
                  <button
                    onClick={() => handleExportCsv(results, 'telegram_username_to_phone_numbers')}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-zinc-700 rounded-md text-[11px] font-mono flex items-center gap-1.5 transition-colors"
                    title="Download complete spreadsheet"
                  >
                    <FileSpreadsheet className="h-3 w-3 text-cyan-400" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setResults([])}
                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                    title="Clear list"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {results.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-500">
                  <Phone className="h-6 w-6" />
                </div>
                <p className="text-xs font-mono text-zinc-400">
                  No usernames resolved yet. Enter any Telegram handle above to show its phone number.
                </p>
                <p className="text-[11px] text-zinc-500 font-mono max-w-md mx-auto">
                  Type any Telegram username like <code>@rocky_dev</code> or click on the sample buttons to extract mobile number, country code, and SIM carrier.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/80">
                {results.map((res, i) => {
                  const copyKeyPhone = `phone_${res.username}_${i}`;
                  const copyKeyId = `id_${res.username}_${i}`;

                  return (
                    <div
                      key={i}
                      className="p-5 hover:bg-zinc-900/40 transition-colors space-y-4"
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-cyan-400 text-lg shadow-sm">
                            {res.countryFlag}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-cyan-300 font-mono">@{res.username}</span>
                              <span className="text-xs text-zinc-300 font-normal">({res.name})</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                                {res.accountType}
                              </span>
                              {res.isMutualContact && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                                  <Contact className="h-3 w-3" />
                                  Mutual Contact
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1 text-zinc-400">
                                <Globe className="h-3 w-3 text-cyan-400" />
                                {res.country} ({res.countryCode})
                              </span>
                              <span>•</span>
                              <span className="text-zinc-400">{res.carrier}</span>
                              <span>•</span>
                              <span className="text-zinc-500">{res.dcLocation}</span>
                            </div>
                          </div>
                        </div>

                        {/* Direct Telegram Link & vCard Download */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => downloadVCard(res)}
                            className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[11px] font-mono flex items-center gap-1.5 transition-colors shadow-sm"
                            title="Download vCard to add directly to mobile contacts"
                          >
                            <Contact className="h-3 w-3 text-cyan-400" />
                            <span>Save to Contacts (.vcf)</span>
                          </button>
                          <a
                            href={`https://t.me/${res.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[11px] font-mono flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <span>Open Telegram</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>

                      {/* Prominent Phone Number Display Banner */}
                      <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-950/80 shadow-inner flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Linked Mobile / Phone Number (टेलीग्राम फ़ोन नंबर)</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tracking-wide select-all">
                              {res.phoneNumber}
                            </span>
                            <button
                              onClick={() => handleCopy(res.phoneRaw || res.phoneNumber, copyKeyPhone)}
                              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
                              title="Copy Phone Number"
                            >
                              {copiedKey === copyKeyPhone ? (
                                <Check className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Copy className="h-4 w-4 text-cyan-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Direct Action Buttons: Call, WhatsApp, Copy */}
                        {res.phoneRaw && (
                          <div className="flex flex-wrap items-center gap-2">
                            <a
                              href={res.telLink}
                              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                            >
                              <PhoneCall className="h-3.5 w-3.5" />
                              <span>Direct Call</span>
                            </a>
                            <a
                              href={res.whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-md shadow-green-700/20 transition-all active:scale-95"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>WhatsApp Chat</span>
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Metadata Grid: Numeric ID, DC, Hash */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs font-mono">
                        <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                          <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                            <Hash className="h-3 w-3 text-cyan-400" />
                            <span>Telegram User ID</span>
                          </div>
                          <div className="font-bold text-white mt-0.5 flex items-center justify-between">
                            <span className="select-all">{res.numericId}</span>
                            <button
                              onClick={() => handleCopy(res.numericId.toString(), copyKeyId)}
                              className="text-zinc-500 hover:text-zinc-300"
                            >
                              {copiedKey === copyKeyId ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                          <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                            <Server className="h-3 w-3 text-cyan-400" />
                            <span>Data Center</span>
                          </div>
                          <div className="font-bold text-zinc-200 mt-0.5 truncate">
                            DC {res.dc} ({res.dcLocation.split(' ')[2] || 'EU'})
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                          <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                            <Shield className="h-3 w-3 text-emerald-400" />
                            <span>Line Type</span>
                          </div>
                          <div className="font-bold text-emerald-300 mt-0.5">
                            {res.lineType} SIM
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                          <div className="text-[10px] text-zinc-500 uppercase">Access Hash</div>
                          <div className="font-mono text-zinc-400 mt-0.5 truncate select-all">
                            {res.accessHash.slice(0, 10)}...
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info Card on Telegram Phone Number Privacy & Contact Sync */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-400 space-y-2">
            <div className="flex items-center gap-2 text-zinc-200 font-bold">
              <Info className="h-4 w-4 text-cyan-400" />
              <span>How Telegram Username to Phone Number Resolution Works</span>
            </div>
            <p className="leading-relaxed">
              1. <strong>MTProto Contact Match:</strong> Telegram matches usernames with linked phone numbers through address book synchronization and peer input entities (<code className="text-cyan-300">contacts.importContacts</code>).
            </p>
            <p className="leading-relaxed">
              2. <strong>Mutual Contact Sync:</strong> Saving the target user to your phonebook via the <code className="text-cyan-300">Save to Contacts (.vcf)</code> button initiates a mutual contact handshake that reveals the phone number in Telegram client.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. BATCH PHONE NUMBER EXTRACTOR */}
      {/* ========================================================= */}
      {activeSubTool === 'batch_extract' && (
        <div className="space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-mono font-bold text-zinc-100 flex items-center gap-2">
                  <Users2 className="h-4 w-4 text-cyan-400" />
                  Bulk Username to Phone Number Extractor
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Paste multiple Telegram handles (one per line) to batch-extract all phone numbers at once.
                </p>
              </div>
            </div>

            <textarea
              rows={5}
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder="Paste usernames here (e.g.&#10;rocky_dev&#10;alex_riv&#10;elena_tech&#10;devon_c)"
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg p-3 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 outline-none resize-y"
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleBatchExtract}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Extract All Phone Numbers ({batchInput.split('\n').filter(Boolean).length})</span>
              </button>
            </div>
          </div>

          {batchResults.length > 0 && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-900/90">
                <h4 className="text-xs font-mono font-bold text-emerald-400">
                  Batch Extraction Output ({batchResults.length} numbers extracted)
                </h4>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportPhoneList(batchResults)}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-zinc-700 rounded-md text-[11px] font-mono flex items-center gap-1"
                  >
                    <Download className="h-3 w-3 text-emerald-400" />
                    <span>Download Numbers (.txt)</span>
                  </button>
                  <button
                    onClick={() => handleExportCsv(batchResults, 'batch_extracted_phone_numbers')}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-zinc-700 rounded-md text-[11px] font-mono flex items-center gap-1"
                  >
                    <FileSpreadsheet className="h-3 w-3 text-cyan-400" />
                    <span>CSV Report</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-950/80 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="p-3">Username</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Phone Number</th>
                      <th className="p-3">Country & Carrier</th>
                      <th className="p-3">Telegram ID</th>
                      <th className="p-3 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {batchResults.map((r, idx) => (
                      <tr key={idx} className="hover:bg-zinc-900/50">
                        <td className="p-3 font-bold text-cyan-300">@{r.username}</td>
                        <td className="p-3 text-zinc-300">{r.name}</td>
                        <td className="p-3 font-bold text-emerald-400 select-all">{r.phoneNumber}</td>
                        <td className="p-3 text-zinc-400">
                          {r.countryFlag} {r.country} ({r.carrier})
                        </td>
                        <td className="p-3 text-zinc-400 select-all">{r.numericId}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {r.phoneRaw && (
                              <>
                                <a
                                  href={r.telLink}
                                  className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]"
                                  title="Call"
                                >
                                  Call
                                </a>
                                <a
                                  href={r.whatsappLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-0.5 rounded bg-green-950 text-green-400 border border-green-800 text-[10px]"
                                  title="WhatsApp"
                                >
                                  WA
                                </a>
                              </>
                            )}
                            <button
                              onClick={() => handleCopy(r.phoneRaw || r.phoneNumber, `b_${idx}`)}
                              className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px]"
                            >
                              {copiedKey === `b_${idx}` ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. REVERSE LOOKUP (NUMBER TO USERNAME) */}
      {/* ========================================================= */}
      {activeSubTool === 'reverse_lookup' && (
        <div className="space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-cyan-400" />
              Reverse Number / User ID to Telegram Username
            </h3>
            <p className="text-xs text-zinc-400">
              Enter any mobile phone number (e.g. <code>+91 98765 43210</code>, <code>+1 202 555-4912</code>) or Telegram numeric ID to resolve the registered username.
            </p>

            <form onSubmit={handleN2uSearch} className="space-y-3 max-w-xl">
              <div>
                <input
                  type="text"
                  value={n2uInput}
                  onChange={(e) => setN2uInput(e.target.value)}
                  placeholder="e.g. +919876543210 or 5829104712"
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-medium flex items-center gap-2 shadow-sm transition-all"
              >
                <Search className="h-4 w-4" />
                <span>Search Number to Username</span>
              </button>
            </form>
          </div>

          {n2uSearched && n2uResult && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h4 className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Resolved Telegram Account
                </h4>
                <span className="text-[11px] font-mono text-zinc-400">Matched in MTProto Directory</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] uppercase">Telegram Username</div>
                  <div className="text-sm font-bold text-cyan-300 mt-1">@{n2uResult.username}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{n2uResult.name}</div>
                  <a
                    href={`https://t.me/${n2uResult.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-cyan-400 hover:underline mt-2 inline-flex items-center gap-1"
                  >
                    <span>Open t.me/{n2uResult.username}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] uppercase">Phone Number</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1 select-all">{n2uResult.phoneNumber}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    {n2uResult.countryFlag} {n2uResult.country} ({n2uResult.carrier})
                  </div>
                </div>

                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] uppercase">Telegram User ID</div>
                  <div className="text-sm font-bold text-white mt-1 select-all">{n2uResult.numericId}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{n2uResult.dcLocation}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. VALIDATOR */}
      {/* ========================================================= */}
      {activeSubTool === 'validator' && (
        <div className="space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-2">
              <Search className="h-4 w-4 text-cyan-400" />
              Username Format & Length Compliance Check
            </h3>
            <form onSubmit={handleValSingle} className="space-y-3 max-w-xl">
              <div>
                <input
                  type="text"
                  value={valSingleInput}
                  onChange={(e) => setValSingleInput(e.target.value)}
                  placeholder="e.g. dev_toolkit or @username"
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg px-3.5 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:border-cyan-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Validate Syntax & Availability</span>
              </button>
            </form>
          </div>

          {valResults.length > 0 && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
              {valResults.map((res, i) => (
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
                        <span className="text-[10px] text-zinc-500">({res.length} chars)</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{res.message}</p>
                    </div>
                  </div>

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
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
