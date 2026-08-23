export interface TelegramConfig {
  api_id: string;
  api_hash: string;
  phone: string;
  session_name?: string;
  updated_at?: string;
}

export interface TelegramSession {
  isConnected: boolean;
  connectedAt?: string;
  accountName: string;
  username: string;
  phoneDisplay: string;
  sessionFile: string;
  sessionSizeKb: number;
}

export type DoctorStatus = 'pass' | 'warning' | 'error';

export interface DoctorCheckItem {
  id: string;
  label: string;
  category: 'Environment' | 'Dependencies' | 'Structure' | 'Git & Version' | 'Network';
  status: DoctorStatus;
  detail: string;
}

export interface DoctorReport {
  pass: number;
  warning: number;
  error: number;
  status: 'READY' | 'READY WITH WARNINGS' | 'ERROR';
  timestamp: string;
  checks: DoctorCheckItem[];
}

export interface SecurityAuditItem {
  id: string;
  title: string;
  description: string;
  passed: boolean;
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface TelegramGroup {
  id: string;
  title: string;
  username?: string;
  memberCount: number;
  type: 'supergroup' | 'group' | 'channel';
  canInvite: boolean;
  privacy: 'public' | 'private';
  lastActivity: string;
}

export interface TelegramContact {
  id: string;
  firstName: string;
  lastName?: string;
  username?: string;
  phoneMasked: string;
  isMutual: boolean;
  isOptedIn: boolean;
  status: 'active' | 'inactive';
}

export interface InviteLinkRecord {
  id: string;
  code: string;
  title: string;
  groupTitle: string;
  createdDate: string;
  memberLimit: number;
  joinedCount: number;
  isActive: boolean;
  expiresAt: string;
}

export interface UsernameToNumberResult {
  username: string;
  name: string;
  userId: string;
  numericId: number;
  dc: number;
  dcLocation: string;
  phoneStatus: 'available' | 'revealed_via_contacts' | 'hidden_by_privacy' | 'not_applicable';
  phoneNumber: string;
  phoneRaw: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  carrier: string;
  lineType: 'Mobile' | 'VoIP' | 'Landline' | 'Virtual';
  accountType: 'User' | 'Bot' | 'Channel' | 'Group';
  accessHash: string;
  isMutualContact: boolean;
  tgDeepLink: string;
  whatsappLink: string;
  telLink: string;
  resolvedAt: string;
}

export type ActiveTab =
  | 'overview'
  | 'terminal'
  | 'config'
  | 'connection'
  | 'doctor'
  | 'usernames'
  | 'privacy'
  | 'groups'
  | 'analytics'
  | 'invites'
  | 'csv'
  | 'security'
  | 'updates';
