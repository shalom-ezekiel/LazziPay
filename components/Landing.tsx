
import React from 'react';
import { PlanType } from '../types';
import { 
  CheckCircle2, ArrowRight, Zap, Cpu, 
  Shield, MessageSquare, Activity, PlayCircle, 
  Users, ServerCrash, Mic, Share2
} from 'lucide-react';

interface LandingProps {
  onPlanSelected: (plan: PlanType) => void;
}

const LazziLogo = () => (
  <div className="w-9 h-9 bg-gradient-to-br from-[#33C4CC] via-[#2D73E0] to-[#8D25D1] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 relative overflow-hidden group hover:rotate-6 transition-transform">
    <div className="relative transform -translate-y-0.5 translate-x-0.5">
      <div className="w-4 h-5 border-l-[4px] border-b-[4px] border-white rounded-bl-md rounded-tr-sm rounded-br-lg shadow-sm"></div>
    </div>
    <div className="absolute inset-0 animate-shimmer pointer-events-none"></div>
  </div>
);

const DashboardPreview = () => (
  <div className="mt-12 w-full max-w-5xl mx-auto perspective-1000 px-4">
    <div className="bg-white rounded-[1.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden transform hover:-rotate-x-1 transition-transform duration-700">
      {/* Dashboard Image  */}
      <div className="flex overflow-hidden bg-slate-50">
        <img 
          src="/images/Dashboard.png" 
          alt="Lazzipay Dashboard Preview"
          className="w-full h-auto object-cover block"
        />
      </div>
    </div>
  </div>
);

const Landing: React.FC<LandingProps> = ({ onPlanSelected }) => {
  const integrations = [
    "Kuda", "PayPorte", "Access Bank", "Zenith", "Piggyvest", "Paystack", 
    "Customer Experience Africa", "Eko Electricity", 
    "FIRS", "NSITF", "Gokada", "Travel", 
    "Leadway Assurance", "AXA Mansard"
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 flex flex-col items-center">
        {/* Animated  Background Blobs */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-400/10 animate-blob pointer-events-none blur-[100px]"></div>
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-400/10 animate-blob pointer-events-none blur-[100px]" style={{ animationDelay: '-5s' }}></div>

        <div className="max-w-6xl mx-auto text-center relative z-10 w-full">
          <div className="flex justify-center mb-6 opacity-0 animate-text-reveal stagger-1">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md text-blue-700 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">
              Pioneering Fintech Accessibility
            </span>
          </div>
          
          <div className="overflow-hidden mb-6">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter opacity-0 animate-text-reveal stagger-2">
              The Voice Interface for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#33C4CC] via-[#2D73E0] to-[#8D25D1]">African Banking</span>
            </h1>
          </div>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-text-reveal stagger-3 font-medium">
            LazziPay brings your tools and touchpoints together, creating one intelligent flow where insight, action, and trust move as one.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 opacity-0 animate-text-reveal stagger-4">
            <button 
              onClick={() => onPlanSelected(PlanType.CORE)}
              className="group w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-400/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
            >
              Start for Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl text-base font-bold hover:bg-slate-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95">
              Book a Demo
            </button>
          </div>

          {/* Interactive Dashboard Preview */}
          <div className="opacity-0 animate-text-reveal stagger-4">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50 reveal-on-scroll">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8">Trusted by leading businesses worldwide</p>
          <div className="flex overflow-hidden relative group">
            <div className="flex gap-16 animate-marquee whitespace-nowrap py-4 items-center">
              {['Kuda Bank', 'Opay', 'Moniepoint', 'Flutterwave', 'Interswitch', 'GTBank', 'Zenith Bank', 'Paystack'].map((bank, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300 font-black text-xl transition-all duration-700 cursor-default hover:text-blue-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 group-hover:border-blue-100 transition-colors"></div>
                  {bank}
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Safe Voice-First Transfers Section */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-on-scroll">
              <div className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-[9px] font-black mb-4 uppercase tracking-widest border border-green-100">
                Safety First Architecture
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                Safe Voice-First <br />Money Transfers
              </h2>
              <p className="text-base text-slate-600 mb-8 leading-relaxed font-medium">
                Voice recognition can misinterpret names. LazziPay eliminates this risk with a strict confirmation and mapping protocol.
              </p>
              
              <ul className="space-y-6">
                <SafeStep 
                  number="01"
                  title="Repeat & Confirm Intent"
                  description="We read back the structured intent to ensure accuracy before processing."
                />
                <SafeStep 
                  number="02"
                  title="Structured Name Mapping"
                  description="Names are cross-referenced with your verified contacts via bank APIs."
                />
                <SafeStep 
                  number="03"
                  title="Prepare-Only Phase"
                  description="Transactions are prepared but never executed autonomously for your safety."
                />
              </ul>
            </div>
            <div className="reveal-on-scroll stagger-2">
              <div className="bg-slate-950 rounded-[2.5rem] p-10 shadow-2xl relative group border border-white/5">
                <div className="absolute -top-4 -right-4 bg-gradient-to-tr from-[#33C4CC] to-[#8D25D1] text-white p-6 rounded-2xl shadow-xl animate-bounce">
                  <MessageSquare size={28} />
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 transform transition-all group-hover:scale-[1.02] duration-500">
                    <p className="text-blue-400 text-[9px] font-black mb-2 uppercase tracking-widest">LazziPay Voice Feedback</p>
                    <p className="text-white text-base font-bold italic leading-relaxed">"I understood you want to transfer ₦10,000 to Solomon. Is that correct?"</p>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-white p-4 rounded-2xl rounded-tr-none text-slate-900 font-black text-sm shadow-xl transform transition-all group-hover:-translate-x-2 duration-500">
                      "Yes, correct."
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-green-500/20 transform transition-all group-hover:scale-[1.02] duration-500">
                    <p className="text-green-400 text-[9px] font-black mb-2 uppercase tracking-widest">System Status</p>
                    <p className="text-white font-bold text-base">Verified contact: Solomon A. Preparing transfer request...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Impact Section */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Real Impact</h2>
            <p className="text-slate-600 max-w-xl mx-auto text-base font-medium">Proactively improving voice recognition and reducing transfer errors.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ImpactCard 
              icon={<Cpu className="text-blue-600" size={32} />}
              title="Advanced AI Insights"
              description="Our models proactively improve voice recognition for unique local accents and dialects."
              delay="stagger-1"
            />
            <ImpactCard 
              icon={<Share2 className="text-blue-500" size={32} />}
              title="Smart Routing"
              description="Prepares transfers faster and more efficiently by pre-fetching account metadata."
              delay="stagger-2"
            />
            <ImpactCard 
              icon={<Shield className="text-green-600" size={32} />}
              title="24/7 AI-Powered Support"
              description="LazziPay monitors transaction patterns and provides automated alerts for anomalies."
              delay="stagger-3"
            />
          </div>
        </div>
      </section>

      {/* Integration Marquee Section */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-10 reveal-on-scroll">
            <LazziLogo />
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
              Integration
            </h2>
          </div>

          <div className="relative flex overflow-hidden group reveal-on-scroll">
            <div className="flex gap-10 animate-marquee-slow whitespace-nowrap items-center py-6">
              {[...integrations, ...integrations].map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-2xl transition-all duration-500 hover:shadow-lg hover:-translate-y-1 group/item cursor-default"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                  </div>
                  <span className="text-slate-800 font-black text-base tracking-tight whitespace-nowrap">{item}</span>
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-slate-50" id="pricing">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">LazziPay Plans</h2>
            <p className="text-slate-600 text-base font-medium">Choose the right path for your journey.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PriceCard 
              title="Core / Free"
              price="0"
              description="Ideal for individuals & safety."
              features={[
                "Voice-to-action transfers",
                "Confirmation prompts",
                "Verified account mapping",
                "Prepare-only transactions"
              ]}
              cta="Start Free"
              onCta={() => onPlanSelected(PlanType.CORE)}
            />
            <PriceCard 
              title="Pay-As-You-Go"
              price="Custom"
              description="Flexible for growing fintechs."
              features={[
                "All Core features",
                "Flexible usage-based transfers",
                "Real-time dashboard",
                "Transfer limits control"
              ]}
              cta="Get Started"
              onCta={() => onPlanSelected(PlanType.PAYG)}
              highlighted
            />
            <PriceCard 
              title="Enterprise"
              price="Contact"
              description="Solutions for organizations."
              features={[
                "Dedicated account support",
                "Advanced reporting",
                "Full banking API integration",
                "Custom workflow configs"
              ]}
              cta="Request a Demo"
              onCta={() => onPlanSelected(PlanType.ENTERPRISE)}
            />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="pb-32 pt-10 px-6 text-center reveal-on-scroll">
        <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[3rem] bg-slate-950 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-1000"></div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter text-white relative z-10 leading-none">Ready to build <br />the future?</h2>
          <p className="text-slate-400 mb-10 text-lg leading-relaxed max-w-xl mx-auto relative z-10 font-medium">
            Integrate LazziPay’s Voice Accessibility API today and reach the next generation of banked users.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button onClick={() => onPlanSelected(PlanType.CORE)} className="bg-blue-600 text-white px-10 py-4 rounded-xl font-black text-base hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 hover:-translate-y-1 active:scale-95">Try for Free</button>
            <button className="bg-white/10 border border-white/10 text-white px-10 py-4 rounded-xl font-black text-base hover:bg-white/20 transition hover:-translate-y-1 active:scale-95 backdrop-blur-md">Book a Demo</button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-slow {
          display: flex;
          animation: marquee 50s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

const SafeStep: React.FC<{ number: string, title: string, description: string }> = ({ number, title, description }) => (
  <div className="flex gap-6 items-start group">
    <span className="text-blue-600 font-black text-4xl opacity-10 group-hover:opacity-100 transition-all duration-700 select-none">{number}</span>
    <div className="transform group-hover:translate-x-2 transition-all duration-500">
      <h4 className="font-black text-slate-900 mb-1 text-xl tracking-tight">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{description}</p>
    </div>
  </div>
);

const ImpactCard: React.FC<{ icon: React.ReactNode, title: string, description: string, delay?: string }> = ({ icon, title, description, delay }) => (
  <div className={`reveal-on-scroll ${delay} bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-700 group relative overflow-hidden hover:-translate-y-2`}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors duration-700"></div>
    <div className="mb-6 group-hover:scale-110 transition-transform duration-700 origin-left relative z-10">{icon}</div>
    <h3 className="text-xl font-black text-slate-900 mb-3 relative z-10 tracking-tight">{title}</h3>
    <p className="text-slate-600 leading-relaxed text-sm relative z-10 font-medium">{description}</p>
  </div>
);

const PriceCard: React.FC<{ 
  title: string, 
  price: string, 
  description: string, 
  features: string[], 
  cta: string, 
  highlighted?: boolean,
  onCta?: () => void
}> = ({ title, price, description, features, cta, highlighted, onCta }) => (
  <div className={`reveal-on-scroll p-10 rounded-[2.5rem] flex flex-col h-full border transition-all duration-700 hover:shadow-xl hover:-translate-y-2 ${highlighted ? 'border-blue-600 ring-4 ring-blue-50 bg-white scale-[1.03] z-10' : 'border-slate-100 bg-slate-50/50'}`}>
    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">{title}</h3>
    <p className="text-slate-500 text-sm mb-8 font-medium">{description}</p>
    <div className="mb-10">
      <span className="text-5xl font-black text-slate-900 tracking-tighter">{price === 'Custom' || price === 'Contact' ? price : `$${price}`}</span>
      {price !== 'Custom' && price !== 'Contact' && <span className="text-slate-400 ml-2 font-black text-lg">/mo</span>}
    </div>
    <ul className="space-y-4 mb-12 flex-grow">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-bold">
          <CheckCircle2 size={20} className="text-blue-600 shrink-0 mt-0.5" /> {f}
        </li>
      ))}
    </ul>
    <button 
      onClick={onCta}
      className={`w-full py-4 rounded-xl font-black text-base transition-all duration-300 active:scale-95 ${highlighted ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-400/20' : 'bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'}`}
    >
      {cta}
    </button>
  </div>
);

export default Landing;
