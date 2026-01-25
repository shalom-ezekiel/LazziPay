
import React, { useState, useEffect, useRef } from 'react';
import { UserSettings, VoiceIntent, DemoState, TransferStep } from '../types';
import { extractIntent, speakText } from '../geminiService';
import { 
  Mic, MicOff, Send, Loader2, AlertCircle, 
  CheckCircle2, ThumbsUp, ThumbsDown, 
  Cpu, Zap, Volume2, UserCheck, CreditCard, Wallet, List
} from 'lucide-react';

interface VoiceDemoProps {
  settings: UserSettings;
  onPanic: () => void;
}

const VoiceDemo: React.FC<VoiceDemoProps> = ({ settings, onPanic }) => {
  const [demoState, setDemoState] = useState<DemoState>('IDLE');
  const [transferStep, setTransferStep] = useState<TransferStep>('INTENT');
  const [transcript, setTranscript] = useState('');
  const [lastIntent, setLastIntent] = useState<VoiceIntent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const recognitionRef = useRef<any>(null);

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
    try {
      const intent = await extractIntent(textToProcess, settings.panicWord);
      
      if (intent.action === 'panic_trigger') {
        onPanic();
        return;
      }

      // Handle conversational follow-ups (Yes/No)
      if (lastIntent?.action === 'show_balance') {
        if (intent.action === 'affirmation' || textToProcess.toLowerCase().includes('yes') || textToProcess.toLowerCase().includes('read')) {
          setShowTransactions(true);
          setDemoState('SUCCESS');
          await speakText("Of course. Here are your recent transactions: You sent 5,000 Naira to MTN on Monday, and you received 20,000 Naira from Solomon on Tuesday afternoon.");
          return;
        } else if (intent.action === 'negation' || textToProcess.toLowerCase().includes('no')) {
          resetDemo();
          await speakText("No problem. Let me know if you need anything else.");
          return;
        }
      }

      if (intent.action === 'unknown') {
        setDemoState('IDLE');
        setError("I didn't recognize that as a banking command.");
        await speakText("I'm sorry, I didn't recognize that as a banking command. How can I help with your finances?");
        return;
      }

      setLastIntent(intent);

      if (intent.action === 'show_balance') {
        setDemoState('SUCCESS');
        setShowTransactions(false);
        await speakText("According to your bank, your current account balance is 124,560 Naira and 75 Kobo. Would you like me to read recent transactions?");
      } else if (intent.action === 'transfer_money') {
        if (intent.recipient?.toLowerCase().includes('tosin')) {
          setTransferStep('DISAMBIGUATION');
          setDemoState('CONFIRMING');
          await speakText("I found two contacts for Tosin Matthew. Option 1: Matthew Tosin Ade, First Bank. Option 2: Tosin Matthew Kole, GTBank. Please select Option 1 or 2.");
        } else if (!intent.amount) {
          setTransferStep('AMOUNT');
          setDemoState('CONFIRMING');
          await speakText(`How much would you like to prepare for transfer to ${intent.recipient || 'your contact'}?`);
        } else {
          setTransferStep('FINAL');
          setDemoState('CONFIRMING');
          await speakText(`Please confirm: Transfer ₦${intent.amount} to ${intent.recipient}. Say Yes to confirm or No to cancel.`);
        }
      } else {
        setDemoState('SUCCESS');
        await speakText(`Action identified: ${intent.action.replace('_', ' ')}. Processing your request.`);
      }
    } catch (e) {
      setError("Intelligence engine busy. Please retry.");
      setDemoState('ERROR');
    }
  };

  const handleSelection = (option: number) => {
    if (lastIntent) {
      const selected = option === 1 ? 'Matthew Tosin Ade (First Bank)' : 'Tosin Matthew Kole (GTBank)';
      setLastIntent({ ...lastIntent, recipient: selected });
      setTransferStep('AMOUNT');
      speakText(`Selected ${selected}. How much should I prepare?`);
    }
  };

  const handleConfirmation = async (confirmed: boolean) => {
    if (confirmed) {
      setDemoState('SUCCESS');
      await speakText("I have prepared your transfer request and sent it to your bank for authorization. To complete it, please confirm with your bank’s security step, such as your PIN or biometrics.");
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
    setShowTransactions(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-blue-100">
          <Zap size={14} /> Legally Compliant & Safe
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Interactive Safe Demo</h2>
        <p className="text-slate-600">LazziPay helps prepare banking actions, but your bank handles all transactions.</p>
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
                : 'bg-blue-600 text-white shadow-blue-200 ring-8 ring-blue-50 hover:bg-blue-700'
              }`}
            >
              {demoState === 'LISTENING' ? <MicOff size={48} /> : <Mic size={48} />}
            </button>
            <h3 className="text-slate-900 font-bold mb-1">{demoState === 'LISTENING' ? 'Listening...' : 'Tap to Command'}</h3>
            <p className="text-slate-400 text-xs font-medium px-8 leading-relaxed italic">
              Try: "What is my balance?" or "Transfer to Tosin"
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className={`p-5 rounded-2xl border transition-all text-sm font-medium ${demoState === 'LISTENING' ? 'bg-blue-50 border-blue-200 italic text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
              {transcript || "..."}
            </div>
            
            <button
              disabled={demoState === 'PROCESSING' || demoState === 'LISTENING' || !transcript}
              onClick={() => processText()}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition disabled:opacity-30 shadow-lg"
            >
              {demoState === 'PROCESSING' ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              Analyze Signal
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-xs font-bold animate-in slide-in-from-bottom-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Step 2: Intelligent Verification */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl min-h-[500px] relative overflow-hidden flex flex-col">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">02 / Secure Mapping</span>
            
            {demoState === 'IDLE' && (
              <div className="flex-grow flex flex-col items-center justify-center text-slate-600 text-center opacity-40">
                <Cpu size={64} className="mb-6" />
                <p className="text-xs font-bold tracking-widest uppercase">Waiting for Input</p>
              </div>
            )}

            {demoState === 'PROCESSING' && (
              <div className="flex-grow flex flex-col items-center justify-center text-blue-400">
                <Loader2 size={64} className="mb-6 animate-spin" />
                <p className="animate-pulse font-bold tracking-widest uppercase text-xs">Extracting Verified Intents...</p>
              </div>
            )}

            {demoState === 'CONFIRMING' && (
              <div className="flex-grow flex flex-col animate-in zoom-in duration-300">
                {transferStep === 'DISAMBIGUATION' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-3xl text-center">
                      <UserCheck size={40} className="text-blue-500 mx-auto mb-4" />
                      <h4 className="text-white font-bold text-lg mb-2">Who is the recipient?</h4>
                      <div className="space-y-3">
                        <button onClick={() => handleSelection(1)} className="w-full bg-slate-800 text-white p-4 rounded-xl text-left text-sm hover:bg-slate-700 transition flex justify-between items-center border border-slate-700">
                          <span>Matthew Tosin Ade (First Bank)</span>
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">1</div>
                        </button>
                        <button onClick={() => handleSelection(2)} className="w-full bg-slate-800 text-white p-4 rounded-xl text-left text-sm hover:bg-slate-700 transition flex justify-between items-center border border-slate-700">
                          <span>Tosin Matthew Kole (GTBank)</span>
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">2</div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {transferStep === 'AMOUNT' && (
                  <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                      <CreditCard size={40} className="text-blue-500" />
                    </div>
                    <h4 className="text-white font-bold text-xl mb-4">Set Amount</h4>
                    <p className="text-blue-200 text-sm mb-8 leading-relaxed">
                      How much should I prepare for <strong>{lastIntent?.recipient}</strong>?
                    </p>
                    <button onClick={toggleListening} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                      Speak Amount
                    </button>
                  </div>
                )}

                {transferStep === 'FINAL' && (
                  <div className="flex-grow flex flex-col justify-center">
                    <div className="p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-3xl text-center">
                      <Volume2 size={40} className="text-indigo-400 mx-auto mb-4 animate-pulse" />
                      <h4 className="text-white font-bold text-lg mb-2">Final Confirmation</h4>
                      <div className="p-4 bg-slate-800 rounded-2xl mb-6 border border-slate-700">
                        <p className="text-slate-400 text-[10px] uppercase font-bold mb-1">Prepared Action</p>
                        <p className="text-white text-base">Transfer <strong>₦{lastIntent?.amount}</strong> to <strong>{lastIntent?.recipient}</strong></p>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => handleConfirmation(true)} className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition">
                          <ThumbsUp size={18} /> Yes
                        </button>
                        <button onClick={() => handleConfirmation(false)} className="flex-1 bg-slate-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition">
                          <ThumbsDown size={18} /> No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {demoState === 'SUCCESS' && (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-6 animate-in fade-in slide-in-from-top-4">
                {lastIntent?.action === 'show_balance' ? (
                  <div className="w-full animate-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Wallet size={36} className="text-blue-500" />
                    </div>
                    <h3 className="text-white text-xl font-bold mb-1">Account Balance</h3>
                    <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-4">Official Bank Feed</p>
                    <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 shadow-inner mb-6">
                       <p className="text-3xl font-extrabold text-white tracking-tighter">₦124,560<span className="text-lg text-slate-500">.75</span></p>
                    </div>

                    {!showTransactions ? (
                      <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/20 mb-6">
                        <p className="text-blue-400 text-xs font-bold italic mb-3">"Would you like to read recent transactions?"</p>
                        <div className="flex gap-2">
                          <button onClick={() => processText('yes')} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold transition hover:bg-blue-700">Yes</button>
                          <button onClick={resetDemo} className="flex-1 bg-slate-800 text-white py-2 rounded-lg text-xs font-bold transition hover:bg-slate-700">No</button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 mb-6 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase mb-2">
                          <List size={12} /> Recent Activity
                        </div>
                        <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 flex justify-between items-center text-left">
                          <div>
                            <p className="text-white text-xs font-bold">MTN Data Purchase</p>
                            <p className="text-[10px] text-slate-500">Monday, 10:24 AM</p>
                          </div>
                          <p className="text-red-400 text-xs font-bold">-₦5,000</p>
                        </div>
                        <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 flex justify-between items-center text-left">
                          <div>
                            <p className="text-white text-xs font-bold">Transfer from Solomon</p>
                            <p className="text-[10px] text-slate-500">Tuesday, 02:15 PM</p>
                          </div>
                          <p className="text-green-400 text-xs font-bold">+₦20,000</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 ring-4 ring-green-500/10">
                      <CheckCircle2 size={44} className="text-green-500" />
                    </div>
                    <h3 className="text-white text-xl font-bold mb-4">Transfer Prepared</h3>
                    <p className="text-slate-400 text-xs mb-8 leading-relaxed max-w-xs">
                      Sent to your bank for authorization. Complete the final step in your banking app using PIN or biometrics.
                    </p>
                  </>
                )}
                <button onClick={resetDemo} className="bg-slate-800 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-slate-700 transition border border-slate-700 text-sm">
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
