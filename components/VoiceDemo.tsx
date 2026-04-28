
import React, { useState, useEffect, useRef } from 'react';
import { UserSettings, VoiceIntent, DemoState, TransferStep, IndustryType } from '../types';
import { extractIntent, speakText } from '../geminiService';
import { usePartner } from '../contexts/PartnerContext';
import { getIndustryConfig, ALL_INDUSTRIES, INDUSTRY_REGISTRY } from '../config/industryConfig';
import { DEMO_PARTNERS } from '../config/partnerConfig';
import { 
  Mic, MicOff, Send, Loader2, AlertCircle, 
  CheckCircle2, ThumbsUp, ThumbsDown, 
  Cpu, Zap, Volume2, UserCheck, CreditCard, Wallet, List,
  ChevronDown, Building2, Lightbulb, PiggyBank, Shield, Truck, MessageSquare
} from 'lucide-react';

interface VoiceDemoProps {
  settings: UserSettings;
  onPanic: () => void;
}

const industryIcons: Record<IndustryType, React.ReactNode> = {
  banking: <Building2 size={18} />,
  utilities: <Lightbulb size={18} />,
  savings: <PiggyBank size={18} />,
  insurance: <Shield size={18} />,
  logistics: <Truck size={18} />,
  general: <MessageSquare size={18} />,
};

const VoiceDemo: React.FC<VoiceDemoProps> = ({ settings, onPanic }) => {
  const { config, switchIndustry, loadDemoPartner, resetToDefault } = usePartner();
  const [demoState, setDemoState] = useState<DemoState>('IDLE');
  const [transferStep, setTransferStep] = useState<TransferStep>('INTENT');
  const [transcript, setTranscript] = useState('');
  const [lastIntent, setLastIntent] = useState<VoiceIntent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const recognitionRef = useRef<any>(null);

  const industryConfig = getIndustryConfig(config.industry);

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
      };

      recognition.onend = () => {
        setDemoState(prev => (prev === 'LISTENING' ? 'IDLE' : prev));
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          setError(`Voice capture issue: ${event.error}`);
        }
        setDemoState('IDLE');
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (demoState === 'LISTENING') {
      recognitionRef.current.stop();
      setDemoState('IDLE');
    } else {
      setError(null);
      setTranscript('');
      setDemoState('LISTENING');
      try {
        recognitionRef.current.start();
      } catch (e) {
        setDemoState('IDLE');
      }
    }
  };

  const processText = async (manualText?: string) => {
    const textToProcess = manualText || transcript;
    if (!textToProcess.trim()) return;
    
    setDemoState('PROCESSING');
    setError(null);
    setAiResponse('');

    try {
      const intent = await extractIntent(textToProcess, {
        industry: config.industry,
        assistantName: config.assistantName,
        panicWord: settings.panicWord,
        customInstructions: config.customInstructions,
      });
      
      if (intent.action === 'panic_trigger') {
        onPanic();
        return;
      }

      // Handle conversational follow-ups
      if (lastIntent && (intent.action === 'affirmation' || textToProcess.toLowerCase().includes('yes'))) {
        setShowDetails(true);
        setDemoState('SUCCESS');
        const msg = "Of course! Here are the details you requested.";
        setAiResponse(msg);
        await speakText(msg);
        return;
      }

      if (lastIntent && (intent.action === 'negation' || textToProcess.toLowerCase().includes('no'))) {
        resetDemo();
        const msg = "No problem. Let me know if you need anything else.";
        await speakText(msg);
        return;
      }

      if (intent.action === 'unknown') {
        setDemoState('IDLE');
        const msg = `I didn't recognize that as a ${industryConfig.name.toLowerCase()} command.`;
        setError(msg);
        await speakText(msg + " How can I help?");
        return;
      }

      if (intent.action === 'customer_support' && intent.supportAnswer) {
        setDemoState('SUCCESS');
        setLastIntent(intent);
        setAiResponse(intent.supportAnswer);
        await speakText(intent.supportAnswer);
        return;
      }

      setLastIntent(intent);

      // Find the intent definition
      const intentDef = industryConfig.intents.find(i => i.id === intent.action);

      if (intentDef?.requiresConfirmation) {
        setTransferStep('FINAL');
        setDemoState('CONFIRMING');

        let confirmMsg = `Please confirm: ${intentDef.label}`;
        if (intent.amount) confirmMsg += ` — ₦${intent.amount.toLocaleString()}`;
        if (intent.recipient) confirmMsg += ` to ${intent.recipient}`;
        confirmMsg += '. Say Yes to confirm or No to cancel.';
        
        setAiResponse(confirmMsg);
        await speakText(confirmMsg);
      } else {
        setDemoState('SUCCESS');
        const msg = `${intentDef?.label || intent.action}: Processing your request...`;
        setAiResponse(msg);
        await speakText(msg);
      }
    } catch (e) {
      setError("Intelligence engine busy. Please retry.");
      setDemoState('ERROR');
    }
  };

  const handleConfirmation = async (confirmed: boolean) => {
    if (confirmed) {
      setDemoState('SUCCESS');
      const intentDef = industryConfig.intents.find(i => i.id === lastIntent?.action);
      const msg = intentDef?.isSensitive
        ? `I've prepared your ${intentDef.label.toLowerCase()} request and sent it to your app for authorization. Please confirm with your security step.`
        : "Done! Your request has been processed successfully.";
      setAiResponse(msg);
      await speakText(msg);
    } else {
      setDemoState('IDLE');
      setTranscript('');
      setLastIntent(null);
      await speakText("Action cancelled. I'm standing by.");
    }
  };

  const resetDemo = () => {
    setDemoState('IDLE');
    setTranscript('');
    setLastIntent(null);
    setTransferStep('INTENT');
    setShowDetails(false);
    setAiResponse('');
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-blue-100">
          Multi-Industry Voice AI
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Interactive Demo</h2>
        <p className="text-slate-600">Test Lazzi across different industries. Select an industry or partner preset below.</p>
      </div>

      {/* Industry Selector */}
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 text-center">Select Industry</p>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {ALL_INDUSTRIES.map(industry => {
            const ic = INDUSTRY_REGISTRY[industry];
            const isActive = config.industry === industry;
            return (
              <button
                key={industry}
                onClick={() => { switchIndustry(industry); resetDemo(); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 -translate-y-0.5' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:-translate-y-0.5'
                }`}
              >
                <span>{ic.icon}</span>
                {ic.name}
              </button>
            );
          })}
        </div>

        {/* Partner Presets */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 self-center mr-2">Partner Demos:</span>
          {Object.entries(DEMO_PARTNERS).map(([id, partner]) => (
            <button
              key={id}
              onClick={() => { loadDemoPartner(id); resetDemo(); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                config.partnerId === partner.partnerId
                  ? 'text-white border-transparent shadow-md'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-white hover:text-slate-700'
              }`}
              style={config.partnerId === partner.partnerId ? { backgroundColor: partner.brandColors.primary } : {}}
            >
              {partner.assistantName}
            </button>
          ))}
          <button
            onClick={() => { resetToDefault(); resetDemo(); }}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-400 border border-slate-200 hover:bg-white hover:text-slate-600 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Active Config Banner */}
      <div 
        className="mb-8 p-4 rounded-2xl flex items-center justify-between border"
        style={{ 
          backgroundColor: `${config.brandColors.primary}08`,
          borderColor: `${config.brandColors.primary}22`,
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${config.brandColors.primary}, ${config.brandColors.secondary})` }}
          >
            <Cpu size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">{config.assistantName}</p>
            <p className="text-slate-500 text-xs font-medium">{industryConfig.icon} {industryConfig.name} • {industryConfig.intents.length} intents</p>
          </div>
        </div>
        <div className="hidden sm:flex gap-2 flex-wrap justify-end">
          {industryConfig.intents.slice(0, 3).map(intent => (
            <span key={intent.id} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-500">
              {intent.label}
            </span>
          ))}
          {industryConfig.intents.length > 3 && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-400">
              +{industryConfig.intents.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Step 1: Voice Capture */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl relative overflow-hidden flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">01 / Capture</span>
            {demoState === 'LISTENING' && (
              <div className="flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                <span className="text-[10px] text-red-600 font-black">MIC ACTIVE</span>
              </div>
            )}
          </div>

          <div className="flex-grow flex flex-col justify-center items-center text-center">
            <button
              onClick={toggleListening}
              className={`w-36 h-36 rounded-full flex items-center justify-center transition-all shadow-2xl transform active:scale-95 mb-6 group ${
                demoState === 'LISTENING' 
                ? 'bg-red-500 text-white animate-pulse shadow-red-200 ring-8 ring-red-50' 
                : 'text-white shadow-blue-200 ring-8 ring-blue-50 hover:opacity-90'
              }`}
              style={demoState !== 'LISTENING' ? { 
                background: `linear-gradient(135deg, ${config.brandColors.primary}, ${config.brandColors.secondary})` 
              } : {}}
            >
              {demoState === 'LISTENING' ? <MicOff size={48} /> : <Mic size={48} />}
            </button>
            <h3 className="text-slate-900 font-bold mb-1">{demoState === 'LISTENING' ? 'Listening...' : `Talk to ${config.assistantName}`}</h3>
            <p className="text-slate-400 text-xs font-medium px-8 leading-relaxed italic">
              Try: "{industryConfig.intents[0]?.samplePhrases[0]}" or "{industryConfig.intents[1]?.samplePhrases[0]}"
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className={`p-5 rounded-2xl border transition-all text-sm font-medium ${demoState === 'LISTENING' ? 'bg-blue-50 border-blue-200 italic text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
              {transcript || "..."}
            </div>
            
            <button
              disabled={demoState === 'PROCESSING' || demoState === 'LISTENING' || !transcript}
              onClick={() => processText()}
              className="w-full text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition disabled:opacity-30 shadow-lg"
              style={{ backgroundColor: config.brandColors.primary }}
            >
              {demoState === 'PROCESSING' ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              Analyze Intent
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-xs font-bold">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Step 2: AI Response */}
        <div className="space-y-6">
          <div 
            className="rounded-[2.5rem] p-8 border shadow-2xl min-h-[500px] relative overflow-hidden flex flex-col"
            style={{ 
              backgroundColor: config.brandColors.background,
              borderColor: `${config.brandColors.primary}33`,
            }}
          >
            <span className="text-xs font-black uppercase tracking-widest mb-6" style={{ color: `${config.brandColors.primary}88` }}>
              02 / {config.assistantName} Response
            </span>
            
            {demoState === 'IDLE' && (
              <div className="flex-grow flex flex-col items-center justify-center text-center opacity-40">
                <Cpu size={64} className="mb-6 text-white/50" />
                <p className="text-xs font-bold tracking-widest uppercase text-white/50">Waiting for Input</p>
              </div>
            )}

            {demoState === 'PROCESSING' && (
              <div className="flex-grow flex flex-col items-center justify-center" style={{ color: config.brandColors.primary }}>
                <Loader2 size={64} className="mb-6 animate-spin" />
                <p className="animate-pulse font-bold tracking-widest uppercase text-xs">Extracting Intent...</p>
              </div>
            )}

            {demoState === 'CONFIRMING' && (
              <div className="flex-grow flex flex-col justify-center">
                <div className="p-6 rounded-3xl text-center border" style={{ 
                  backgroundColor: `${config.brandColors.primary}15`,
                  borderColor: `${config.brandColors.primary}33`,
                }}>
                  <Volume2 size={40} className="mx-auto mb-4 animate-pulse" style={{ color: config.brandColors.primary }} />
                  <h4 className="text-white font-bold text-lg mb-2">Confirm Action</h4>
                  <div className="p-4 rounded-2xl mb-6 border" style={{ backgroundColor: `${config.brandColors.background}`, borderColor: `${config.brandColors.primary}22` }}>
                    <p className="text-white/40 text-[10px] uppercase font-bold mb-1">Prepared</p>
                    <p className="text-white text-base">{aiResponse}</p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleConfirmation(true)} 
                      className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition"
                    >
                      <ThumbsUp size={18} /> Yes
                    </button>
                    <button 
                      onClick={() => handleConfirmation(false)} 
                      className="flex-1 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                      style={{ backgroundColor: `${config.brandColors.primary}22` }}
                    >
                      <ThumbsDown size={18} /> No
                    </button>
                  </div>
                </div>
              </div>
            )}

            {demoState === 'SUCCESS' && (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-green-500/10">
                  <CheckCircle2 size={44} className="text-green-500" />
                </div>
                <h3 className="text-white text-xl font-bold mb-4">
                  {lastIntent?.action === 'customer_support' ? 'Support Answer' : 'Action Complete'}
                </h3>
                {aiResponse && (
                  <p className="text-white/70 text-sm mb-6 leading-relaxed max-w-xs">{aiResponse}</p>
                )}
                {lastIntent && (
                  <div className="w-full p-4 rounded-2xl mb-6 border text-left" style={{ backgroundColor: `${config.brandColors.primary}11`, borderColor: `${config.brandColors.primary}22` }}>
                    <p className="text-white/40 text-[10px] uppercase font-bold mb-2">Intent Detected</p>
                    <p className="text-white text-sm font-bold">{lastIntent.action}</p>
                    <p className="text-white/40 text-xs mt-1">Confidence: {Math.round((lastIntent.confidence || 0) * 100)}%</p>
                    {lastIntent.amount && <p className="text-white/40 text-xs">Amount: ₦{lastIntent.amount.toLocaleString()}</p>}
                    {lastIntent.recipient && <p className="text-white/40 text-xs">Recipient: {lastIntent.recipient}</p>}
                  </div>
                )}
                <button 
                  onClick={resetDemo} 
                  className="text-white px-8 py-2.5 rounded-xl font-bold transition border text-sm"
                  style={{ backgroundColor: `${config.brandColors.primary}22`, borderColor: `${config.brandColors.primary}44` }}
                >
                  New Command
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceDemo;
