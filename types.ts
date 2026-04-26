
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

// ─────────────────────────────────────────────
// Industry & Partner Types
// ─────────────────────────────────────────────

export type IndustryType = 'banking' | 'utilities' | 'savings' | 'insurance' | 'logistics' | 'general';

export interface PartnerBrandColors {
  primary: string;
  secondary: string;
  background: string;
  text?: string;
}

export interface PartnerConfig {
  partnerId: string;
  assistantName: string;          // "Kuda AI", "PHCN Helper", "PiggyBot"
  industry: IndustryType;
  brandColors: PartnerBrandColors;
  logo?: string;                  // URL to partner logo
  voicePreference: 'male' | 'female';
  allowedIntents?: string[];      // subset of industry intents (null = all)
  welcomeMessage: string;         // "Hi! I'm Kuda AI, how can I help?"
  customInstructions?: string;    // extra prompt context for the AI
  widgetPosition?: 'bottom-right' | 'bottom-left';
  widgetSize?: 'compact' | 'standard' | 'large';
}

// ─────────────────────────────────────────────
// Voice Intent (now dynamic, not hardcoded)
// ─────────────────────────────────────────────

export interface VoiceIntent {
  action: string;                 // dynamic — any intent ID from industry config
  amount?: number | null;
  recipient?: string | null;
  message?: string | null;
  confidence: number;
  ambiguousContacts?: string[];
  extractedFields?: Record<string, string | number | null>; // dynamic fields
  supportAnswer?: string;         // AI-generated answer for support questions
}

// ─────────────────────────────────────────────
// Sensitive Action Handoff
// ─────────────────────────────────────────────

export interface SensitiveAction {
  intentId: string;
  description: string;
  extractedData: Record<string, any>;
  confirm: () => void;
  cancel: () => void;
}

export type SensitiveActionCallback = (action: SensitiveAction) => void;
export type IntentCallback = (intent: VoiceIntent) => void;

// ─────────────────────────────────────────────
// SDK Init Options (what partners pass to Lazzi.init())
// ─────────────────────────────────────────────

export interface LazziSDKOptions {
  apiKey: string;
  assistantName?: string;
  industry?: IndustryType;
  brandColors?: Partial<PartnerBrandColors>;
  logo?: string;
  voicePreference?: 'male' | 'female';
  welcomeMessage?: string;
  customInstructions?: string;
  widgetPosition?: 'bottom-right' | 'bottom-left';
  widgetSize?: 'compact' | 'standard' | 'large';
  onSensitiveAction?: SensitiveActionCallback;
  onIntent?: IntentCallback;
  onError?: (error: Error) => void;
  onReady?: () => void;
}

// ─────────────────────────────────────────────
// Existing types (preserved)
// ─────────────────────────────────────────────

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
