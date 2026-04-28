
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VoiceIntent, PartnerConfig, SensitiveAction } from '../types';
import { extractIntent, speakText } from '../geminiService';
import { getIndustryConfig } from '../config/industryConfig';
import {
  Mic, MicOff, X, Send, Loader2, ChevronDown,
  CheckCircle2, AlertCircle, Volume2, MessageSquare,
  ShieldCheck, ArrowLeft
} from 'lucide-react';

interface LazziWidgetProps {
  config: PartnerConfig;
  onSensitiveAction?: (action: SensitiveAction) => void;
  onIntent?: (intent: VoiceIntent) => void;
}

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: Date;
  intent?: VoiceIntent;
  isSensitive?: boolean;
  awaitingConfirmation?: boolean;
}

const LazziWidget: React.FC<LazziWidgetProps> = ({ config, onSensitiveAction, onIntent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [pendingAction, setPendingAction] = useState<VoiceIntent | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const industryConfig = getIndustryConfig(config.industry);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript;
        setTranscript(resultTranscript);

        if (event.results[current].isFinal) {
          handleUserInput(resultTranscript);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          addMessage('assistant', "I had trouble hearing you. Could you try again?");
        }
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage('assistant', config.welcomeMessage);
    }
  }, [isOpen]);

  const addMessage = (role: 'assistant' | 'user', text: string, extras?: Partial<Message>) => {
    const msg: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      role,
      text,
      timestamp: new Date(),
      ...extras,
    };
    setMessages(prev => [...prev, msg]);
    return msg;
  };

  const handleUserInput = useCallback(async (text: string) => {
    if (!text.trim()) return;

    addMessage('user', text);
    setTranscript('');
    setIsProcessing(true);

    try {
      // Check for confirmation/denial of pending action
      if (pendingAction) {
        const confirmIntent = await extractIntent(text, {
          industry: config.industry,
          assistantName: config.assistantName,
          customInstructions: config.customInstructions,
        });

        if (confirmIntent.action === 'affirmation') {
          const intentDef = industryConfig.intents.find(i => i.id === pendingAction.action);

          if (intentDef?.isSensitive && onSensitiveAction) {
            // Hand off to host app for biometric verification
            addMessage('assistant',
              `I've prepared your ${intentDef.label.toLowerCase()} request. Please complete verification in your app to proceed.`,
              { isSensitive: true }
            );
            await speakText(`I've prepared your ${intentDef.label.toLowerCase()} request. Please complete verification in your app to proceed.`);

            onSensitiveAction({
              intentId: pendingAction.action,
              description: intentDef.label,
              extractedData: {
                amount: pendingAction.amount,
                recipient: pendingAction.recipient,
                ...pendingAction.extractedFields,
              },
              confirm: () => {
                addMessage('assistant', `Your ${intentDef.label.toLowerCase()} has been completed successfully! ✅`);
              },
              cancel: () => {
                addMessage('assistant', `The ${intentDef.label.toLowerCase()} was cancelled.`);
              },
            });
          } else {
            addMessage('assistant', "Done! Your request has been processed. ✅");
            await speakText("Done! Your request has been processed.");
          }
          setPendingAction(null);
        } else if (confirmIntent.action === 'negation') {
          addMessage('assistant', "No problem, I've cancelled that. How else can I help?");
          await speakText("No problem, I've cancelled that. How else can I help?");
          setPendingAction(null);
        } else {
          // They said something else while confirming — process as new intent
          setPendingAction(null);
          await processNewIntent(text);
        }
      } else {
        await processNewIntent(text);
      }
    } catch (error) {
      addMessage('assistant', "I'm having trouble processing that. Could you try again?");
    }

    setIsProcessing(false);
  }, [pendingAction, config, onSensitiveAction, onIntent]);

  const processNewIntent = async (text: string) => {
    const intent = await extractIntent(text, {
      industry: config.industry,
      assistantName: config.assistantName,
      customInstructions: config.customInstructions,
    });

    // Notify partner app
    onIntent?.(intent);

    if (intent.action === 'unknown') {
      const msg = "I'm not sure what you need. Could you rephrase that?";
      addMessage('assistant', msg);
      await speakText(msg);
      return;
    }

    if (intent.action === 'customer_support' && intent.supportAnswer) {
      addMessage('assistant', intent.supportAnswer);
      await speakText(intent.supportAnswer);
      return;
    }

    const intentDef = industryConfig.intents.find(i => i.id === intent.action);

    if (!intentDef) {
      addMessage('assistant', "I understood your request but I'm not set up to handle that yet.");
      return;
    }

    // Build confirmation message
    if (intentDef.requiresConfirmation) {
      let confirmMsg = `I understood: **${intentDef.label}**`;
      if (intent.amount) confirmMsg += ` — Amount: ₦${intent.amount.toLocaleString()}`;
      if (intent.recipient) confirmMsg += ` — To: ${intent.recipient}`;
      confirmMsg += `. Is that correct?`;

      addMessage('assistant', confirmMsg, { awaitingConfirmation: true });
      await speakText(confirmMsg.replace(/\*\*/g, ''));
      setPendingAction(intent);
    } else {
      // Non-sensitive, no confirmation needed — just respond
      const responseMap: Record<string, string> = {
        check_balance: "Your current balance is ₦124,560.75. Would you like to see recent transactions?",
        transaction_history: "Here are your recent transactions. You sent ₦5,000 to MTN on Monday and received ₦20,000 from Solomon on Tuesday.",
        account_info: "Your account number is 012****890, a savings account at First Bank.",
        check_bill: "Your current electricity bill is ₦12,450.00 for the period of March 2026.",
        usage_history: "Last month you used 245 kWh, which is 12% less than the previous month.",
        service_status: "All services are currently operational in your area. No scheduled maintenance.",
        check_savings: "Your total savings balance is ₦450,000. You're 75% toward your ₦600,000 goal!",
        interest_rate: "Your current interest rate is 16% per annum. You've earned ₦12,400 in interest this quarter.",
        goal_progress: "You're at 75% of your savings goal. ₦150,000 more to reach ₦600,000!",
        check_policy: "Your auto insurance policy #LP-2026-4421 is active until December 2026. Coverage: comprehensive.",
        check_premium: "Your next premium payment of ₦45,000 is due on May 1st, 2026.",
        track_package: "Your package #GK-88291 is currently in transit. Estimated delivery: Tomorrow by 3 PM.",
        delivery_estimate: "Delivery from Lagos to Abuja typically takes 2-3 business days. Estimated cost: ₦4,500.",
        faq: intent.supportAnswer || "Let me help with that! What specific question do you have?",
        feedback: "Thank you for your feedback! We really appreciate it. Is there anything else I can help with?",
        human_agent: "I'm connecting you to a human agent now. Please hold on...",
        account_help: "I can help with your account. What specific issue are you experiencing?",
      };

      const response = responseMap[intent.action] || `Processing your ${intentDef.label.toLowerCase()} request...`;
      addMessage('assistant', response);
      await speakText(response);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      addMessage('assistant', "Voice input isn't available in this browser. Please type your request instead.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputRef.current?.value?.trim();
    if (text) {
      handleUserInput(text);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  // CSS variables from partner brand
  const widgetStyles = {
    '--w-primary': config.brandColors.primary,
    '--w-secondary': config.brandColors.secondary,
    '--w-bg': config.brandColors.background,
    '--w-text': config.brandColors.text || '#FFFFFF',
  } as React.CSSProperties;

  const positionClass = config.widgetPosition === 'bottom-left' ? 'left-6' : 'right-6';

  return (
    <div style={widgetStyles} className="lazzi-widget-root">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 ${positionClass} z-[9999] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group`}
          style={{
            background: `linear-gradient(135deg, ${config.brandColors.primary}, ${config.brandColors.secondary})`,
          }}
          title={`Talk to ${config.assistantName}`}
        >
          <Mic size={28} className="text-white group-hover:scale-110 transition-transform" />
          {/* Pulse ring */}
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: config.brandColors.primary }}
          />
        </button>
      )}

      {/* Widget Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-6 ${positionClass} z-[9999] w-[380px] max-h-[600px] rounded-3xl shadow-2xl border border-white/10 flex flex-col overflow-hidden`}
          style={{
            background: config.brandColors.background,
            animation: 'lazzi-slide-up 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div
            className="px-6 py-4 flex items-center justify-between shrink-0"
            style={{
              background: `linear-gradient(135deg, ${config.brandColors.primary}22, ${config.brandColors.secondary}22)`,
              borderBottom: `1px solid ${config.brandColors.primary}33`,
            }}
          >
            <div className="flex items-center gap-3">
              {config.logo ? (
                <img src={config.logo} alt="" className="w-9 h-9 rounded-xl object-cover" />
              ) : (
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${config.brandColors.primary}, ${config.brandColors.secondary})`,
                  }}
                >
                  <MessageSquare size={18} className="text-white" />
                </div>
              )}
              <div>
                <h3 className="text-white font-bold text-sm leading-none">{config.assistantName}</h3>
                <p className="text-white/40 text-[10px] font-medium mt-0.5">
                  {industryConfig.icon} {industryConfig.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition"
              >
                <ChevronDown size={18} />
              </button>
              <button
                onClick={() => { setIsOpen(false); setMessages([]); setPendingAction(null); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[300px] max-h-[380px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-tr-md text-white'
                      : 'rounded-tl-md text-white/90'
                  }`}
                  style={{
                    backgroundColor: msg.role === 'user'
                      ? config.brandColors.primary
                      : `${config.brandColors.primary}22`,
                  }}
                >
                  {msg.isSensitive && (
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-bold text-yellow-400 uppercase tracking-widest">
                      <ShieldCheck size={12} /> Verification Required
                    </div>
                  )}
                  {msg.text}
                  {msg.awaitingConfirmation && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleUserInput('yes')}
                        className="flex-1 py-1.5 rounded-lg text-[11px] font-bold bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        ✓ Yes
                      </button>
                      <button
                        onClick={() => handleUserInput('no')}
                        className="flex-1 py-1.5 rounded-lg text-[11px] font-bold bg-white/10 text-white hover:bg-white/20 transition"
                      >
                        ✗ No
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl rounded-tl-md" style={{ backgroundColor: `${config.brandColors.primary}22` }}>
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {isListening && (
              <div className="flex justify-center">
                <div className="px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-red-400 text-[11px] font-bold">
                    {transcript || 'Listening...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-4 py-3 shrink-0" style={{ borderTop: `1px solid ${config.brandColors.primary}22` }}>
            <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-white/50 hover:text-white hover:bg-white/10'
                }`}
                style={!isListening ? { backgroundColor: `${config.brandColors.primary}22` } : {}}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <input
                ref={inputRef}
                type="text"
                placeholder={`Ask ${config.assistantName}...`}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/30 transition font-medium"
                disabled={isProcessing || isListening}
              />

              <button
                type="submit"
                disabled={isProcessing || isListening}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white transition-all disabled:opacity-30"
                style={{ backgroundColor: config.brandColors.primary }}
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>

            <p className="text-center text-white/20 text-[9px] mt-2 font-medium">
              Powered by Lazzi AI
            </p>
          </div>
        </div>
      )}

      {/* Widget Animations */}
      <style>{`
        @keyframes lazzi-slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default LazziWidget;
