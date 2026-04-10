
export enum AppView {
  LANDING = 'LANDING',
  DEMO = 'DEMO',
  DASHBOARD = 'DASHBOARD',
  SETTINGS = 'SETTINGS',
  DEVELOPER = 'DEVELOPER',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
}

export enum PlanType {
  CORE = 'CORE',
  PAYG = 'PAYG',
  ENTERPRISE = 'ENTERPRISE'
}

export type DemoState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'CONFIRMING' | 'SUCCESS' | 'ERROR';
export type TransferStep = 'INTENT' | 'DISAMBIGUATION' | 'AMOUNT' | 'FINAL';

export interface VoiceIntent {
  action: 'show_balance' | 'transfer_money' | 'set_reminder' | 'panic_trigger' | 'affirmation' | 'negation' | 'unknown';
  amount?: number | null;
  recipient?: string | null;
  message?: string | null;
  confidence: number;
  ambiguousContacts?: string[];
}

export interface UserSettings {
  userId: string;
  panicWord: string;
  reminderTime: string;
  voicePreference: 'male' | 'female';
  isLocked: boolean;
  selectedPlan: PlanType;
}

export interface AnalyticsData {
  day: string;
  commands: number;
  panicTriggers: number;
  successRate: number;
}
