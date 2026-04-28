
import { PartnerConfig, IndustryType } from '../types';

/**
 * Default LazziPay partner config (used on the main site)
 */
export const DEFAULT_PARTNER_CONFIG: PartnerConfig = {
  partnerId: 'lazzi_default',
  assistantName: 'Lazzi',
  industry: 'banking',
  brandColors: {
    primary: '#2D73E0',
    secondary: '#8D25D1',
    background: '#0F172A',
    text: '#FFFFFF',
  },
  voicePreference: 'female',
  welcomeMessage: "Hi! I'm Lazzi, your voice assistant. How can I help you today?",
  widgetPosition: 'bottom-right',
  widgetSize: 'standard',
};

/**
 * Example partner configs for demo/showcase purposes
 */
export const DEMO_PARTNERS: Record<string, PartnerConfig> = {
  arcline: {
    partnerId: 'arcline_bank',
    assistantName: 'Arcline AI',
    industry: 'banking',
    brandColors: {
      primary: '#6C63FF',
      secondary: '#40CEB5',
      background: '#1A1A2E',
      text: '#FFFFFF',
    },
    voicePreference: 'female',
    welcomeMessage: "Hey there! I'm Arcline AI. What would you like to do?",
    widgetPosition: 'bottom-right',
    widgetSize: 'standard',
  },
  voltgrid: {
    partnerId: 'voltgrid_energy',
    assistantName: 'Volt Helper',
    industry: 'utilities',
    brandColors: {
      primary: '#F59E0B',
      secondary: '#EF4444',
      background: '#1C1917',
      text: '#FFFFFF',
    },
    voicePreference: 'male',
    welcomeMessage: "Hello! I'm Volt Helper. I can help with your electricity bills and services.",
    widgetPosition: 'bottom-right',
    widgetSize: 'standard',
  },
  trivot: {
    partnerId: 'trivot_savings',
    assistantName: 'Trivot',
    industry: 'savings',
    brandColors: {
      primary: '#0066F5',
      secondary: '#00D4AA',
      background: '#0A0E1A',
      text: '#FFFFFF',
    },
    voicePreference: 'female',
    welcomeMessage: "Hi! I'm Trivot. Let's grow your savings together!",
    widgetPosition: 'bottom-right',
    widgetSize: 'standard',
  },
  sentinel: {
    partnerId: 'sentinel_insurance',
    assistantName: 'Sentinel Assist',
    industry: 'insurance',
    brandColors: {
      primary: '#DC2626',
      secondary: '#991B1B',
      background: '#1A0A0A',
      text: '#FFFFFF',
    },
    voicePreference: 'male',
    welcomeMessage: "Hello! I'm Sentinel Assist. How can I help with your insurance today?",
    widgetPosition: 'bottom-right',
    widgetSize: 'standard',
  },
  fleetrun: {
    partnerId: 'fleetrun_logistics',
    assistantName: 'FleetRun Voice',
    industry: 'logistics',
    brandColors: {
      primary: '#22C55E',
      secondary: '#15803D',
      background: '#052E16',
      text: '#FFFFFF',
    },
    voicePreference: 'female',
    welcomeMessage: "Hey! I'm FleetRun Voice. Need to track or schedule a delivery?",
    widgetPosition: 'bottom-right',
    widgetSize: 'standard',
  },
};

/**
 * Build a PartnerConfig from SDK init options
 */
export function buildPartnerConfig(options: {
  apiKey?: string;
  assistantName?: string;
  industry?: IndustryType;
  brandColors?: Partial<PartnerConfig['brandColors']>;
  logo?: string;
  voicePreference?: 'male' | 'female';
  welcomeMessage?: string;
  customInstructions?: string;
  widgetPosition?: 'bottom-right' | 'bottom-left';
  widgetSize?: 'compact' | 'standard' | 'large';
}): PartnerConfig {
  return {
    ...DEFAULT_PARTNER_CONFIG,
    partnerId: options.apiKey || DEFAULT_PARTNER_CONFIG.partnerId,
    assistantName: options.assistantName || DEFAULT_PARTNER_CONFIG.assistantName,
    industry: options.industry || DEFAULT_PARTNER_CONFIG.industry,
    brandColors: {
      ...DEFAULT_PARTNER_CONFIG.brandColors,
      ...options.brandColors,
    },
    logo: options.logo,
    voicePreference: options.voicePreference || DEFAULT_PARTNER_CONFIG.voicePreference,
    welcomeMessage: options.welcomeMessage || DEFAULT_PARTNER_CONFIG.welcomeMessage,
    customInstructions: options.customInstructions,
    widgetPosition: options.widgetPosition || DEFAULT_PARTNER_CONFIG.widgetPosition,
    widgetSize: options.widgetSize || DEFAULT_PARTNER_CONFIG.widgetSize,
  };
}
