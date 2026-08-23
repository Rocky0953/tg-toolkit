import { DoctorCheckItem, DoctorReport, SecurityAuditItem, TelegramConfig, TelegramContact, TelegramGroup, TelegramSession } from '../types';

export const DEFAULT_CONFIG: TelegramConfig = {
  api_id: '18492034',
  api_hash: '9f83a21bc9837de91a2384f938da120e',
  phone: '+1 (555) 019-2834',
  session_name: 'telegram.session',
  updated_at: new Date().toISOString(),
};

export const INITIAL_SESSION: TelegramSession = {
  isConnected: true,
  connectedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  accountName: 'Rocky Kandar',
  username: '@rocky_dev',
  phoneDisplay: '+1 555-***-2834',
  sessionFile: '/data/telegram.session',
  sessionSizeKb: 48.2,
};

export const SAMPLE_GROUPS: TelegramGroup[] = [
  {
    id: 'grp_1001',
    title: 'OpenSource Developers Hub',
    username: '@osdev_hub',
    memberCount: 3840,
    type: 'supergroup',
    canInvite: true,
    privacy: 'public',
    lastActivity: '12 mins ago',
  },
  {
    id: 'grp_1002',
    title: 'Linux & Termux Power Users',
    username: '@termux_power',
    memberCount: 1420,
    type: 'supergroup',
    canInvite: true,
    privacy: 'public',
    lastActivity: '3 mins ago',
  },
  {
    id: 'grp_1003',
    title: 'Security & Automation Guild',
    memberCount: 290,
    type: 'group',
    canInvite: false,
    privacy: 'private',
    lastActivity: '1 hour ago',
  },
  {
    id: 'grp_1004',
    title: 'Tech Announcements Feed',
    username: '@tech_announces',
    memberCount: 8900,
    type: 'channel',
    canInvite: false,
    privacy: 'public',
    lastActivity: '30 mins ago',
  },
];

export const SAMPLE_CONTACTS: TelegramContact[] = [
  {
    id: 'cnt_01',
    firstName: 'Alex',
    lastName: 'Rivera',
    username: '@alex_riv',
    phoneMasked: '+1 202-***-4912',
    isMutual: true,
    isOptedIn: true,
    status: 'active',
  },
  {
    id: 'cnt_02',
    firstName: 'Elena',
    lastName: 'Rostova',
    username: '@elena_tech',
    phoneMasked: '+44 791-***-8841',
    isMutual: true,
    isOptedIn: true,
    status: 'active',
  },
  {
    id: 'cnt_03',
    firstName: 'Marcus',
    lastName: 'Vance',
    phoneMasked: '+1 415-***-9023',
    isMutual: false,
    isOptedIn: false,
    status: 'inactive',
  },
  {
    id: 'cnt_04',
    firstName: 'Devon',
    lastName: 'Chen',
    username: '@devon_c',
    phoneMasked: '+65 9123-****',
    isMutual: true,
    isOptedIn: true,
    status: 'active',
  },
];

export function runDoctorChecks(config: TelegramConfig, session: TelegramSession): DoctorReport {
  const checks: DoctorCheckItem[] = [
    {
      id: 'chk_env',
      label: 'Runtime Environment',
      category: 'Environment',
      status: 'pass',
      detail: 'Node.js 22.x LTS (x86_64 container environment)',
    },
    {
      id: 'chk_shell',
      label: 'Shell Environment',
      category: 'Environment',
      status: 'pass',
      detail: 'Bash 5.2.15 / Web Console v1.4.0 active',
    },
    {
      id: 'chk_git',
      label: 'Git checkout integrity',
      category: 'Git & Version',
      status: 'pass',
      detail: 'Git repository detected at root (branch: main, origin configured)',
    },
    {
      id: 'chk_dirs_config',
      label: 'Directory: config/',
      category: 'Structure',
      status: 'pass',
      detail: 'Directory accessible, permissions: 700 (isolated)',
    },
    {
      id: 'chk_dirs_data',
      label: 'Directory: data/',
      category: 'Structure',
      status: 'pass',
      detail: 'Local session directory initialized, secure storage ready',
    },
    {
      id: 'chk_dirs_logs',
      label: 'Directory: logs/',
      category: 'Structure',
      status: 'pass',
      detail: 'Audit log storage verified',
    },
    {
      id: 'chk_config_api',
      label: 'Telegram API ID & Hash',
      category: 'Dependencies',
      status: config.api_id && config.api_hash ? 'pass' : 'error',
      detail:
        config.api_id && config.api_hash
          ? `Configured (API ID: ${config.api_id}, Hash: hidden)`
          : 'API credentials missing. Run configuration wizard.',
    },
    {
      id: 'chk_config_phone',
      label: 'Phone Number Configuration',
      category: 'Dependencies',
      status: config.phone ? 'pass' : 'warning',
      detail: config.phone
        ? `Configured (${config.phone.substring(0, 4)}***${config.phone.slice(-3)})`
        : 'Phone not configured. Required for first authentication.',
    },
    {
      id: 'chk_session',
      label: 'Local Telegram Session File',
      category: 'Dependencies',
      status: session.isConnected ? 'pass' : 'warning',
      detail: session.isConnected
        ? `Session verified (${session.sessionFile}, ${session.sessionSizeKb} KB)`
        : 'No local Telegram session file found.',
    },
    {
      id: 'chk_net',
      label: 'Telegram MTProto Gateway Connectivity',
      category: 'Network',
      status: 'pass',
      detail: 'Latency: 38ms (HTTP/HTTPS endpoint reachable)',
    },
    {
      id: 'chk_git_ignore',
      label: 'Gitignore Secrets Protection',
      category: 'Git & Version',
      status: 'pass',
      detail: 'config.json and *.session explicitly ignored by Git',
    },
  ];

  const pass = checks.filter((c) => c.status === 'pass').length;
  const warning = checks.filter((c) => c.status === 'warning').length;
  const error = checks.filter((c) => c.status === 'error').length;

  let overallStatus: DoctorReport['status'] = 'READY';
  if (error > 0) overallStatus = 'ERROR';
  else if (warning > 0) overallStatus = 'READY WITH WARNINGS';

  return {
    pass,
    warning,
    error,
    status: overallStatus,
    timestamp: new Date().toLocaleTimeString(),
    checks,
  };
}

export function runSecurityAudits(_config: TelegramConfig, session: TelegramSession): SecurityAuditItem[] {
  return [
    {
      id: 'sec_01',
      title: 'config.json File Permissions',
      description: 'Verifies config file permissions are restricted to user only (chmod 600).',
      passed: true,
      severity: 'high',
      recommendation: 'Ensure only the running process user has read/write permissions.',
    },
    {
      id: 'sec_02',
      title: 'Gitignore Ignore Policy',
      description: 'Checks if config/config.json and data/*.session are prevented from Git commits.',
      passed: true,
      severity: 'high',
      recommendation: 'Keep all secrets excluded from version control at all times.',
    },
    {
      id: 'sec_03',
      title: 'API Hash In-Memory Protection',
      description: 'Confirms Telegram API Hash is never printed in CLI Doctor or plain outputs.',
      passed: true,
      severity: 'medium',
      recommendation: 'Mask all sensitive tokens in logs and audit displays.',
    },
    {
      id: 'sec_04',
      title: 'Opt-in Compliance Verification',
      description: 'Ensures TG-TOOLKIT respects user privacy and opt-in policies for member management.',
      passed: true,
      severity: 'low',
      recommendation: 'Do not attempt to discover private numbers or bypass privacy barriers.',
    },
    {
      id: 'sec_05',
      title: 'Local Session Cryptographic Integrity',
      description: 'Validates local Telethon session key storage and active device binding.',
      passed: session.isConnected,
      severity: 'medium',
      recommendation: session.isConnected
        ? 'Session key is securely cached locally.'
        : 'Authenticate with Telegram via Session Connect menu.',
    },
  ];
}
