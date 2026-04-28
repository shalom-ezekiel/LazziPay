
/**
 * Lazzi Industry Configuration
 * 
 * Each industry template defines:
 * - Available intents (what actions users can perform)
 * - Sensitive actions (requiring biometric/PIN handoff to host app)
 * - Sample phrases (for AI training context)
 * - Support topics (common customer support questions)
 * - Response templates (how Lazzi confirms actions)
 */

export type IndustryType = 'banking' | 'utilities' | 'savings' | 'insurance' | 'logistics' | 'general';

export interface IntentDefinition {
  id: string;
  label: string;
  description: string;
  samplePhrases: string[];
  requiresConfirmation: boolean;
  isSensitive: boolean; // requires biometric handoff
  extractFields?: string[]; // fields to extract from voice (amount, recipient, etc.)
}

export interface SupportTopic {
  id: string;
  question: string;
  keywords: string[];
}

export interface IndustryConfig {
  id: IndustryType;
  name: string;
  icon: string;
  description: string;
  intents: IntentDefinition[];
  supportTopics: SupportTopic[];
  systemPromptContext: string; // extra context injected into Gemini prompt
}

// ─────────────────────────────────────────────
// BANKING
// ─────────────────────────────────────────────
const bankingConfig: IndustryConfig = {
  id: 'banking',
  name: 'Banking & Fintech',
  icon: '🏦',
  description: 'Voice assistant for banks, neobanks, and fintech platforms.',
  systemPromptContext: `You are a banking voice assistant. Users interact with their bank accounts via voice. 
You help with balance checks, transfers, transaction history, card management, and general banking support.
For transfers: always extract recipient name and amount. If ambiguous, ask for clarification.
NEVER execute transactions — only PREPARE them for bank authorization.`,
  intents: [
    {
      id: 'check_balance',
      label: 'Check Balance',
      description: 'View current account balance',
      samplePhrases: [
        'what is my balance', 'how much do I have', 'account balance',
        'what\'s in my account', 'check my balance', 'account status',
        'how much money do I have', 'show me my balance'
      ],
      requiresConfirmation: false,
      isSensitive: false,
    },
    {
      id: 'transfer_money',
      label: 'Transfer Money',
      description: 'Prepare a money transfer to a contact',
      samplePhrases: [
        'transfer money', 'send money', 'make a transfer', 'pay someone',
        'send to', 'transfer to', 'prepare a transfer', 'make a payment',
        'I want to send', 'move money to', 'wire money'
      ],
      requiresConfirmation: true,
      isSensitive: true,
      extractFields: ['recipient', 'amount'],
    },
    {
      id: 'transaction_history',
      label: 'Transaction History',
      description: 'View recent transactions',
      samplePhrases: [
        'show my transactions', 'recent transactions', 'what did I spend',
        'transaction history', 'last transactions', 'recent activity',
        'show me what I bought', 'spending history'
      ],
      requiresConfirmation: false,
      isSensitive: false,
    },
    {
      id: 'card_services',
      label: 'Card Services',
      description: 'Block, unblock, or manage debit/credit cards',
      samplePhrases: [
        'block my card', 'freeze my card', 'unblock card',
        'I lost my card', 'card stolen', 'new card',
        'activate my card', 'card status'
      ],
      requiresConfirmation: true,
      isSensitive: true,
    },
    {
      id: 'account_info',
      label: 'Account Information',
      description: 'View account details like number, type, etc.',
      samplePhrases: [
        'my account number', 'account details', 'what type of account',
        'show my account info', 'account information'
      ],
      requiresConfirmation: false,
      isSensitive: false,
    },
  ],
  supportTopics: [
    { id: 'fees', question: 'What are the transfer fees?', keywords: ['fee', 'charge', 'cost', 'how much to transfer'] },
    { id: 'limits', question: 'What are my transfer limits?', keywords: ['limit', 'maximum', 'how much can I send'] },
    { id: 'hours', question: 'What are your operating hours?', keywords: ['hours', 'open', 'close', 'when', 'available'] },
    { id: 'branches', question: 'Where are your branches?', keywords: ['branch', 'location', 'office', 'nearest'] },
    { id: 'app_issues', question: 'I\'m having issues with the app', keywords: ['problem', 'issue', 'not working', 'bug', 'error', 'crash'] },
  ],
};

// ─────────────────────────────────────────────
// UTILITIES (Electricity, Water, etc.)
// ─────────────────────────────────────────────
const utilitiesConfig: IndustryConfig = {
  id: 'utilities',
  name: 'Utilities & Energy',
  icon: '⚡',
  description: 'Voice assistant for electricity, water, gas, and utility companies.',
  systemPromptContext: `You are a utility services voice assistant. Users interact with their utility accounts via voice.
You help with checking bills, making payments, reporting outages, viewing usage, and general utility support.
For bill payments: always confirm the amount and billing period before preparing.
NEVER execute payments — only PREPARE them for customer authorization.`,
  intents: [
    {
      id: 'check_bill',
      label: 'Check Bill',
      description: 'View current or outstanding bill amount',
      samplePhrases: [
        'what\'s my bill', 'how much do I owe', 'electricity bill',
        'check my bill', 'outstanding balance', 'bill amount',
        'what do I need to pay', 'current bill', 'my bill status'
      ],
      requiresConfirmation: false,
      isSensitive: false,
    },
    {
      id: 'pay_bill',
      label: 'Pay Bill',
      description: 'Prepare a bill payment',
      samplePhrases: [
        'pay my bill', 'make a payment', 'pay electricity bill',
        'settle my bill', 'I want to pay', 'clear my bill',
        'pay outstanding', 'pay what I owe'
      ],
      requiresConfirmation: true,
      isSensitive: true,
      extractFields: ['amount', 'billing_period'],
    },
    {
      id: 'report_outage',
      label: 'Report Outage',
      description: 'Report a power/water outage',
      samplePhrases: [
        'there\'s no light', 'power outage', 'no electricity',
        'report outage', 'light is off', 'no power',
        'no water', 'water is off', 'service down'
      ],
      requiresConfirmation: true,
      isSensitive: false,
      extractFields: ['location', 'issue_type'],
    },
    {
      id: 'usage_history',
      label: 'Usage History',
      description: 'View electricity/water usage over time',
      samplePhrases: [
        'show my usage', 'how much did I use', 'usage history',
        'electricity usage', 'water consumption', 'monthly usage',
        'usage this month', 'consumption report'
      ],
      requiresConfirmation: false,
      isSensitive: false,
    },
    {
      id: 'service_status',
      label: 'Service Status',
      description: 'Check if services are operational in an area',
      samplePhrases: [
        'is there maintenance', 'service status', 'are you working in my area',
        'scheduled maintenance', 'when will power be back', 'restoration time'
      ],
      requiresConfirmation: false,
      isSensitive: false,
    },
  ],
  supportTopics: [
    { id: 'tariff', question: 'What is my tariff plan?', keywords: ['tariff', 'rate', 'plan', 'pricing'] },
    { id: 'meter', question: 'How do I read my meter?', keywords: ['meter', 'reading', 'how to read'] },
    { id: 'reconnection', question: 'How do I get reconnected?', keywords: ['reconnect', 'disconnected', 'cut off'] },
    { id: 'prepaid', question: 'How do I buy prepaid units?', keywords: ['prepaid', 'token', 'recharge', 'units'] },
  ],
};

// ─────────────────────────────────────────────
// SAVINGS & INVESTMENT
// ─────────────────────────────────────────────
const savingsConfig: IndustryConfig = {
  id: 'savings',
  name: 'Savings & Investment',
  icon: '💰',
  description: 'Voice assistant for savings platforms, investment apps, and wealth management.',
  systemPromptContext: `You are a savings and investment voice assistant. Users manage their savings goals, deposits, and withdrawals via voice.
You help with checking savings balance, making deposits, withdrawals, tracking goals, and viewing interest.
For withdrawals and deposits: always confirm the amount and destination.
NEVER execute financial transactions — only PREPARE them for customer authorization.`,
  intents: [
    {
      id: 'check_savings',
      label: 'Check Savings',
      description: 'View savings balance or goal progress',
      samplePhrases: [
        'how much have I saved', 'my savings balance', 'savings status',
        'check savings', 'how much is in my vault', 'my savings',
        'show my savings', 'what\'s my savings balance'
      ],
      requiresConfirmation: false,
      isSensitive: false,
    },
    {
      id: 'deposit',
      label: 'Make Deposit',
      description: 'Deposit money into savings',
      samplePhrases: [
        'save money', 'make a deposit', 'add to savings',
        'I want to save', 'deposit into vault', 'put money aside',
        'add money', 'top up savings', 'fund my savings'
      ],
      requiresConfirmation: true,
      isSensitive: true,
      extractFields: ['amount', 'savings_plan'],
    },
    {
      id: 'withdraw',
      label: 'Withdraw',
      description: 'Withdraw money from savings',
      samplePhrases: [
        'withdraw money', 'take out money', 'break my savings',
        'I need my money', 'withdraw from vault', 'cash out',
        'withdraw savings', 'pull out money'
      ],
      requiresConfirmation: true,
      isSensitive: true,
      extractFields: ['amount', 'savings_plan'],
    },
    {
      id: 'interest_rate',
      label: 'Interest Rate',
      description: 'Check current interest rates',
      samplePhrases: [
        'what\'s the interest rate', 'how much interest', 'interest earned',
        'rate of return', 'my interest', 'how much am I earning',
        'investment returns', 'yield rate'
      ],
      requiresConfirmation: false,
      isSensitive: false,
    },
    {
      id: 'goal_progress',
      label: 'Goal Progress',
      description: 'Check progress toward a savings goal',
      samplePhrases: [
        'how close am I to my goal', 'savings goal progress',
        'am I on track', 'goal status', 'target progress',
        'how much more do I need to save'
      ],
      requiresConfirmation: false,
      isSensitive: false,
    },
  ],
  supportTopics: [
    { id: 'lock', question: 'Can I lock my savings?', keywords: ['lock', 'freeze', 'fixed', 'term'] },
    { id: 'penalty', question: 'Is there a withdrawal penalty?', keywords: ['penalty', 'fee', 'early withdrawal', 'charge'] },
    { id: 'auto_save', question: 'How do I set up auto-save?', keywords: ['auto', 'automatic', 'recurring', 'schedule'] },
    { id: 'referral', question: 'Do you have a referral program?', keywords: ['refer', 'referral', 'invite', 'bonus'] },
  ],
};

// ─────────────────────────────────────────────
// INSURANCE
// ─────────────────────────────────────────────
const insuranceConfig: IndustryConfig = {
  id: 'insurance',
  name: 'Insurance',
  icon: '🛡️',
  description: 'Voice assistant for insurance companies and brokers.',
  systemPromptContext: `You are an insurance voice assistant. Users manage their policies, claims, and premiums via voice.
You help with checking policy status, filing claims, viewing premiums, and general insurance support.
For claims: gather incident details before preparing the claim form.
NEVER approve claims — only PREPARE and SUBMIT them for review.`,
  intents: [
    {
      id: 'check_policy',
      label: 'Check Policy',
      description: 'View policy details and status',
      samplePhrases: [
        'what\'s my policy', 'policy status', 'am I covered',
        'check my insurance', 'policy details', 'what does my plan cover',
        'my insurance status', 'coverage details'
      ],
      requiresConfirmation: false,
      isSensitive: false,
    },
    {
      id: 'file_claim',
      label: 'File Claim',
      description: 'Start an insurance claim',
      samplePhrases: [
        'I want to file a claim', 'make a claim', 'report an incident',
        'I had an accident', 'insurance claim', 'submit a claim',
        'I need to claim', 'start a claim'
      ],
      requiresConfirmation: true,
      isSensitive: true,
      extractFields: ['claim_type', 'incident_date', 'description'],
    },
    {
      id: 'check_premium',
      label: 'Check Premium',
      description: 'View premium amount and payment schedule',
      samplePhrases: [
        'how much is my premium', 'premium amount', 'when is my premium due',
        'insurance payment', 'next payment', 'premium status'
      ],
      requiresConfirmation: false,
      isSensitive: false,
    },
    {
      id: 'pay_premium',
      label: 'Pay Premium',
      description: 'Prepare a premium payment',
      samplePhrases: [
        'pay my premium', 'make premium payment', 'pay insurance',
        'settle my premium', 'pay what I owe for insurance'
      ],
      requiresConfirmation: true,
      isSensitive: true,
      extractFields: ['amount'],
    },
  ],
  supportTopics: [
    { id: 'coverage', question: 'What does my policy cover?', keywords: ['cover', 'coverage', 'included', 'exclusion'] },
    { id: 'claim_status', question: 'What is the status of my claim?', keywords: ['claim status', 'claim update', 'processing'] },
    { id: 'renewal', question: 'When does my policy renew?', keywords: ['renew', 'renewal', 'expiry', 'expire'] },
  ],
};

// ─────────────────────────────────────────────
// LOGISTICS
// ─────────────────────────────────────────────
const logisticsConfig: IndustryConfig = {
  id: 'logistics',
  name: 'Logistics & Delivery',
  icon: '🚚',
  description: 'Voice assistant for delivery, shipping, and logistics platforms.',
  systemPromptContext: `You are a logistics and delivery voice assistant. Users track packages, schedule deliveries, and manage shipping via voice.
You help with tracking shipments, scheduling pickups, estimating delivery times, and general logistics support.
For new shipments: always confirm pickup address, destination, and package details.`,
  intents: [
    {
      id: 'track_package',
      label: 'Track Package',
      description: 'Track a shipment or delivery',
      samplePhrases: [
        'where is my package', 'track my delivery', 'package status',
        'shipment tracking', 'when will it arrive', 'delivery status',
        'where is my order', 'track order'
      ],
      requiresConfirmation: false,
      isSensitive: false,
      extractFields: ['tracking_number'],
    },
    {
      id: 'schedule_pickup',
      label: 'Schedule Pickup',
      description: 'Schedule a package pickup',
      samplePhrases: [
        'schedule a pickup', 'I need a pickup', 'come pick up a package',
        'arrange pickup', 'send a rider', 'book a delivery',
        'I want to send a package'
      ],
      requiresConfirmation: true,
      isSensitive: false,
      extractFields: ['pickup_address', 'destination', 'package_type'],
    },
    {
      id: 'delivery_estimate',
      label: 'Delivery Estimate',
      description: 'Get estimated delivery time and cost',
      samplePhrases: [
        'how long will delivery take', 'delivery estimate', 'shipping cost',
        'how much to deliver', 'estimated arrival', 'delivery time'
      ],
      requiresConfirmation: false,
      isSensitive: false,
      extractFields: ['origin', 'destination'],
    },
    {
      id: 'cancel_shipment',
      label: 'Cancel Shipment',
      description: 'Cancel an existing shipment',
      samplePhrases: [
        'cancel my delivery', 'cancel shipment', 'I don\'t want it anymore',
        'cancel order', 'stop delivery', 'cancel pickup'
      ],
      requiresConfirmation: true,
      isSensitive: true,
      extractFields: ['tracking_number'],
    },
  ],
  supportTopics: [
    { id: 'damaged', question: 'My package arrived damaged', keywords: ['damaged', 'broken', 'crushed', 'torn'] },
    { id: 'missing', question: 'My package is missing', keywords: ['missing', 'lost', 'not delivered', 'didn\'t arrive'] },
    { id: 'return', question: 'How do I return a package?', keywords: ['return', 'send back', 'refund'] },
  ],
};

// ─────────────────────────────────────────────
// GENERAL CUSTOMER SUPPORT
// ─────────────────────────────────────────────
const generalConfig: IndustryConfig = {
  id: 'general',
  name: 'General Support',
  icon: '💬',
  description: 'General-purpose voice assistant for any business needing customer support.',
  systemPromptContext: `You are a general customer support voice assistant. You help users with FAQs, complaints, feedback, and connecting them to human agents when needed.
Be friendly, empathetic, and solution-oriented. If you can't resolve an issue, offer to connect them with a human agent.`,
  intents: [
    {
      id: 'faq',
      label: 'FAQ',
      description: 'Answer frequently asked questions',
      samplePhrases: [
        'I have a question', 'help me', 'I need information',
        'tell me about', 'how does it work', 'what is'
      ],
      requiresConfirmation: false,
      isSensitive: false,
    },
    {
      id: 'complaint',
      label: 'File Complaint',
      description: 'Log a customer complaint',
      samplePhrases: [
        'I want to complain', 'I have a complaint', 'this is unacceptable',
        'I\'m not happy', 'bad service', 'file a complaint',
        'I want to report a problem'
      ],
      requiresConfirmation: true,
      isSensitive: false,
      extractFields: ['complaint_type', 'description'],
    },
    {
      id: 'feedback',
      label: 'Give Feedback',
      description: 'Provide feedback or suggestions',
      samplePhrases: [
        'I want to give feedback', 'suggestion', 'I think you should',
        'feedback', 'I have a suggestion', 'you could improve'
      ],
      requiresConfirmation: false,
      isSensitive: false,
    },
    {
      id: 'human_agent',
      label: 'Speak to Human',
      description: 'Connect to a human support agent',
      samplePhrases: [
        'talk to a human', 'speak to someone', 'connect me to an agent',
        'I want to talk to a person', 'human agent', 'customer care',
        'let me speak to a real person', 'agent'
      ],
      requiresConfirmation: false,
      isSensitive: false,
    },
    {
      id: 'account_help',
      label: 'Account Help',
      description: 'General account assistance',
      samplePhrases: [
        'help with my account', 'account problem', 'can\'t login',
        'reset my password', 'update my details', 'change my info'
      ],
      requiresConfirmation: false,
      isSensitive: false,
    },
  ],
  supportTopics: [
    { id: 'contact', question: 'How do I contact support?', keywords: ['contact', 'reach', 'call', 'email'] },
    { id: 'hours', question: 'What are your operating hours?', keywords: ['hours', 'open', 'close', 'when'] },
    { id: 'account', question: 'How do I create an account?', keywords: ['create', 'account', 'sign up', 'register'] },
  ],
};

// ─────────────────────────────────────────────
// REGISTRY
// ─────────────────────────────────────────────
export const INDUSTRY_REGISTRY: Record<IndustryType, IndustryConfig> = {
  banking: bankingConfig,
  utilities: utilitiesConfig,
  savings: savingsConfig,
  insurance: insuranceConfig,
  logistics: logisticsConfig,
  general: generalConfig,
};

export const ALL_INDUSTRIES: IndustryType[] = Object.keys(INDUSTRY_REGISTRY) as IndustryType[];

/**
 * Get industry config by type
 */
export function getIndustryConfig(industry: IndustryType): IndustryConfig {
  return INDUSTRY_REGISTRY[industry];
}

/**
 * Get all intent IDs for an industry
 */
export function getIndustryIntentIds(industry: IndustryType): string[] {
  return INDUSTRY_REGISTRY[industry].intents.map(i => i.id);
}

/**
 * Get only sensitive intents for an industry
 */
export function getSensitiveIntents(industry: IndustryType): IntentDefinition[] {
  return INDUSTRY_REGISTRY[industry].intents.filter(i => i.isSensitive);
}

/**
 * Build the AI system prompt for a given industry + partner config
 */
export function buildSystemPrompt(
  industry: IndustryType,
  assistantName: string,
  customInstructions?: string
): string {
  const config = INDUSTRY_REGISTRY[industry];
  const intentList = config.intents
    .map(i => `- "${i.id}": ${i.description}. Trigger phrases: ${i.samplePhrases.slice(0, 4).join(', ')}`)
    .join('\n');

  const supportList = config.supportTopics
    .map(t => `- "${t.id}": ${t.question}`)
    .join('\n');

  return `You are "${assistantName}", a voice assistant for ${config.name}.

${config.systemPromptContext}

AVAILABLE INTENTS:
${intentList}

CUSTOMER SUPPORT TOPICS:
${supportList}

ADDITIONAL RULES:
- Always understand human intent regardless of exact phrasing
- "make a transfer" = "send money" = "prepare a payment" — they all mean the same thing
- If the user's intent is unclear, classify as "unknown" and ask for clarification
- If the user asks a support question, classify as "customer_support" and provide a helpful answer
- Respond with "affirmation" for yes/confirm/correct/agree
- Respond with "negation" for no/cancel/stop/decline
- Confidence should be a float between 0.0 and 1.0
${customInstructions ? `\nPARTNER INSTRUCTIONS:\n${customInstructions}` : ''}

Respond ONLY in valid JSON.`;
}
