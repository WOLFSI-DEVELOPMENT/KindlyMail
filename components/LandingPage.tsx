import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, ChevronLeft, Monitor, Smartphone, ArrowUp, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TEMPLATES } from '../data/templates';
import { Template } from '../types';

interface LandingPageProps {
  onLoadTemplate?: (template: Template) => void;
  onGetStarted?: () => void;
  onLogin?: () => void;
  onNavigate?: (page: any) => void;
}

const TypingAnimation = () => {
  const [text, setText] = useState('Create emails in ');
  const [phase, setPhase] = useState<'typing-hours' | 'deleting-hours' | 'typing-seconds' | 'finished'>('typing-hours');
  const [cursorVisible, setCursorVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Base string
  const baseText = "Create emails in ";
  const word1 = "hours";
  const word2 = "seconds.";

  // Blink cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Visibility check
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Typing logic
  useEffect(() => {
    if (!isVisible) return;

    let timeout: ReturnType<typeof setTimeout>;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 800;

    const currentFullText = text; 
    // Phase 1: Typing "hours"
    if (phase === 'typing-hours') {
        const target = baseText + word1;
        if (currentFullText !== target) {
            timeout = setTimeout(() => {
                setText(target.substring(0, currentFullText.length + 1));
            }, typeSpeed);
        } else {
            timeout = setTimeout(() => setPhase('deleting-hours'), pauseTime);
        }
    } 
    // Phase 2: Deleting "hours"
    else if (phase === 'deleting-hours') {
        if (currentFullText.length > baseText.length) {
            timeout = setTimeout(() => {
                setText(currentFullText.substring(0, currentFullText.length - 1));
            }, deleteSpeed);
        } else {
            setPhase('typing-seconds');
        }
    } 
    // Phase 3: Typing "seconds."
    else if (phase === 'typing-seconds') {
        const target = baseText + word2;
        if (currentFullText !== target) {
            timeout = setTimeout(() => {
                setText(target.substring(0, currentFullText.length + 1));
            }, typeSpeed);
        } else {
            setPhase('finished');
        }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, isVisible]);

  return (
    <div ref={containerRef} className="flex items-center justify-center min-h-[4rem]">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-stone-900 tracking-tight text-center">
            {text}
            <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 text-pink-500`}>|</span>
        </h2>
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onLoadTemplate }) => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleTemplateClick = (template: Template) => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 selection:bg-stone-900 selection:text-white overflow-x-hidden">
      
      {/* Navigation - Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://iili.io/fNbamD7.md.png" alt="KindlyMail Logo" className="w-8 h-8 rounded-lg shadow-sm" />
            <span className="font-bold text-xl tracking-tight text-black">KindlyMail</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#templates" className="hover:text-black transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/login')} 
                className="text-sm font-medium text-stone-600 hover:text-black transition-colors"
            >
                Log in
            </button>
            <button 
                onClick={() => navigate('/login')} 
                className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors"
            >
                Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 relative">
        <div className="max-w-7xl mx-auto text-center">
          
          <div className="flex justify-center mb-8">
             <a 
               href="https://www.producthunt.com/products/kindlymail-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-kindlymail-ai" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-block transition-transform hover:scale-105 active:scale-95 group"
             >
                 <img 
                   src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1058900&theme=dark&t=1767671168901" 
                   alt="KindlyMail AI - Create emails worth opening. AI-powered, designer-quality. | Product Hunt" 
                   width="250" 
                   height="54" 
                   className="h-[42px] w-auto rounded-full shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/30 transition-shadow"
                 />
             </a>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-black mb-8 leading-[1.05] max-w-5xl mx-auto">
            The professional email<br/>orchestration platform.
          </h1>

          <p className="text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
             Turn designs into production-ready HTML emails instantly. <br className="hidden md:block" />
             No coding required. Built for modern marketing teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <button 
                onClick={() => navigate('/login')} 
                className="h-12 px-8 rounded-full bg-black text-white font-medium hover:bg-stone-800 transition-all text-base"
            >
              Start Building Free
            </button>
            <button className="h-12 px-8 rounded-full border border-stone-200 text-stone-900 font-medium hover:bg-stone-50 transition-all text-base bg-white">
               Contact Sales
            </button>
          </div>

          {/* High-Fidelity Dashboard Replica (Static) */}
          <div className="relative max-w-6xl mx-auto">
             <div className="relative bg-white rounded-xl border border-stone-200 shadow-2xl shadow-stone-200/50 overflow-hidden aspect-[16/10] flex text-left">
                {/* Sidebar Replica */}
                <div className="w-[300px] bg-white border-r border-stone-200 flex-shrink-0 flex flex-col hidden md:flex">
                    <div className="h-16 border-b border-stone-100 flex items-center px-4">
                        <div className="flex items-center gap-2 text-stone-500">
                             <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-orange-400 rounded-lg flex items-center justify-center shadow-sm">
                                <ChevronLeft className="text-white" size={16} />
                            </div>
                            <span className="font-bold text-stone-900 text-sm">Back to Home</span>
                        </div>
                    </div>
                    <div className="flex-1 p-4 space-y-4 bg-white">
                        <div className="flex flex-col items-end gap-1">
                            <div className="bg-stone-100 text-stone-800 px-4 py-3 rounded-2xl rounded-br-sm text-sm max-w-[90%]">
                                Create a minimalist welcome email for "Lumina". Use black and white.
                            </div>
                            <span className="text-[10px] text-stone-300 px-1">You</span>
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <div className="bg-white border border-stone-100 text-stone-600 px-4 py-3 rounded-2xl rounded-bl-sm text-sm shadow-sm max-w-[90%]">
                                I've drafted a clean, monochrome welcome email for Lumina. I used a high-contrast layout with plenty of whitespace.
                            </div>
                            <span className="text-[10px] text-stone-300 px-1">Gemini</span>
                        </div>
                    </div>
                    <div className="p-4 border-t border-stone-50">
                        <div className="relative bg-white border border-stone-200 rounded-[1.5rem] p-3">
                            <div className="text-xs text-stone-400 mb-2">Type a message...</div>
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    <div className="w-4 h-4 rounded bg-stone-100"></div>
                                    <div className="w-4 h-4 rounded bg-stone-100"></div>
                                </div>
                                <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center">
                                    <ArrowUp size={14} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Main Canvas Replica */}
                <div className="flex-1 bg-stone-50 flex flex-col">
                    <div className="h-16 bg-white/80 backdrop-blur border-b border-stone-200 flex items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            <span className="font-medium text-sm text-stone-900">Welcome to Lumina</span>
                            <div className="h-4 w-px bg-stone-200"></div>
                            <div className="flex bg-stone-100 rounded-lg p-1">
                                <div className="p-1.5 rounded-md bg-white shadow-sm text-stone-900"><Monitor size={14} /></div>
                                <div className="p-1.5 rounded-md text-stone-400"><Smartphone size={14} /></div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <div className="px-3 py-1.5 text-xs font-medium text-stone-600 bg-white border border-stone-200 rounded-full shadow-sm">Save</div>
                             <div className="px-3 py-1.5 text-xs font-medium text-white bg-black rounded-full shadow-sm">Export</div>
                        </div>
                    </div>
                    <div className="flex-1 p-8 overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex justify-center">
                        <div className="w-full max-w-[600px] bg-white shadow-xl shadow-stone-200/60 rounded-xl overflow-hidden h-full flex flex-col">
                            <div className="p-12 text-center border-b border-stone-50 bg-white flex-1">
                                <div className="w-12 h-12 bg-black rounded-xl mx-auto mb-8"></div>
                                <h1 className="text-3xl font-bold text-stone-900 mb-4 tracking-tight">Welcome aboard.</h1>
                                <p className="text-stone-500 mb-8 max-w-sm mx-auto leading-relaxed">
                                    We're thrilled to have you. You've joined a community of creators building the next generation of digital experiences.
                                </p>
                                <button className="bg-black text-white px-8 py-3 rounded-full text-sm font-semibold">Get Started</button>
                                <div className="mt-12 pt-12 border-t border-stone-100 grid grid-cols-2 gap-4 text-left">
                                    <div className="h-24 bg-stone-50 rounded-lg"></div>
                                    <div className="h-24 bg-stone-50 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Typing Value Prop Animation */}
      <section className="py-24 border-y border-stone-100 bg-stone-50/50">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <TypingAnimation />
          </div>
      </section>

      {/* Auto-scrolling Template Gallery */}
      <section id="templates" className="bg-stone-50 py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center w-full relative z-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-900 mb-4">Start with a Blueprint</h2>
            <p className="text-stone-500 text-lg">Browse our professional template library.</p>
        </div>

        <div className="relative w-full">
            {/* Gradient Masks for Fade Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-stone-50 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-stone-50 to-transparent z-20 pointer-events-none"></div>

            {/* Marquee Track */}
            <div className="flex gap-8 w-max animate-marquee hover:[animation-play-state:paused] px-8">
                {/* Render templates twice for seamless loop */}
                {[...TEMPLATES, ...TEMPLATES].map((template, idx) => (
                    <div 
                        key={`${template.id}-${idx}`}
                        className="relative group w-[320px] h-[560px] bg-white rounded-[2.5rem] shadow-xl shadow-stone-200 border border-stone-200 overflow-hidden cursor-pointer hover:-translate-y-4 hover:shadow-2xl transition-all duration-300"
                        onClick={() => handleTemplateClick(template)}
                    >
                        {/* Preview Iframe */}
                        <div className="absolute inset-0 w-full h-full pointer-events-none">
                            <iframe 
                                srcDoc={template.body} 
                                className="w-[200%] h-[200%] transform scale-50 origin-top-left bg-white border-none"
                                title={template.name}
                                tabIndex={-1}
                            />
                        </div>
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

                        {/* Hover Actions */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end h-1/2">
                            <span className="text-white text-xs font-bold uppercase tracking-wider mb-2">{template.category}</span>
                            <h3 className="text-white font-bold text-2xl mb-4 leading-tight">{template.name}</h3>
                            <button className="bg-white text-black py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-stone-200 transition-colors">
                                Edit Template <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Inline Style for Marquee Animation */}
        <style>{`
            @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            .animate-marquee {
                animation: marquee 80s linear infinite;
            }
        `}</style>
      </section>

      {/* Pricing - Clean Table */}
      <section id="pricing" className="py-32 bg-white relative z-10">
          <div className="max-w-7xl mx-auto px-6">
              
              <div className="text-center mb-16">
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-900 mb-6 tracking-tight">Plans & Pricing</h2>
                  <p className="text-lg text-stone-500 max-w-xl mx-auto mb-10">
                    Start for free, upgrade when you need to scale. <br/> No credit card required for the free tier.
                  </p>

                  {/* Toggle */}
                  <div className="inline-flex bg-stone-100 p-1.5 rounded-full relative">
                    <button 
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
                    >
                      Monthly
                    </button>
                    <button 
                      onClick={() => setBillingCycle('yearly')}
                      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${billingCycle === 'yearly' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'}`}
                    >
                      Yearly <span className="text-[10px] text-green-600 ml-1 font-extrabold">-20%</span>
                    </button>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
                  
                  {/* Free Plan */}
                  <div className="p-10 rounded-[2.5rem] border border-stone-200 bg-white flex flex-col h-full hover:shadow-xl transition-all duration-300">
                      <div className="mb-8">
                          <div className="text-stone-500 font-bold text-sm uppercase tracking-wider mb-2">Individual</div>
                          <div className="flex items-baseline gap-1">
                              <span className="text-5xl font-display font-bold text-stone-900">$0</span>
                              <span className="text-stone-400 font-medium">/mo</span>
                          </div>
                          <p className="text-stone-500 mt-4 text-sm leading-relaxed">Perfect for hobbyists and side projects.</p>
                      </div>
                      {/* Features */}
                      <div className="flex-1 space-y-4 mb-10">
                          {['10 Exports / mo', 'Basic Templates', 'Community Access', '7-day History'].map(feature => (
                              <div key={feature} className="flex items-center gap-3 text-sm text-stone-600 font-medium">
                                  <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center shrink-0"><Check size={12} /></div>
                                  {feature}
                              </div>
                          ))}
                      </div>
                      <button onClick={() => navigate('/login')} className="w-full py-4 rounded-2xl border border-stone-200 font-bold text-stone-900 hover:bg-stone-50 hover:border-stone-300 transition-all">
                          Get Started
                      </button>
                  </div>

                  {/* Pro Plan */}
                  <div className="p-10 rounded-[2.5rem] bg-stone-900 text-white flex flex-col h-full shadow-2xl shadow-stone-300/50 relative overflow-hidden transform md:-translate-y-4">
                      <div className="absolute top-0 right-0 bg-stone-800 text-stone-200 text-[10px] font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-wider">Coming Soon</div>
                      <div className="mb-8 relative z-10">
                          <div className="text-stone-400 font-bold text-sm uppercase tracking-wider mb-2">Business</div>
                          <div className="flex items-baseline gap-1">
                              <span className="text-5xl font-display font-bold text-white">${billingCycle === 'monthly' ? '29' : '24'}</span>
                              <span className="text-stone-500 font-medium">/mo</span>
                          </div>
                          <p className="text-stone-400 mt-4 text-sm leading-relaxed">For professional creators and small teams.</p>
                      </div>
                      <div className="flex-1 space-y-4 mb-10 relative z-10">
                          {['Unlimited Exports', 'Figma to Email', 'Priority Support', 'Custom Branding', '90-day History', 'Smart Analytics'].map(feature => (
                              <div key={feature} className="flex items-center gap-3 text-sm text-stone-300 font-medium">
                                  <div className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center shrink-0 text-white"><Check size={12} /></div>
                                  {feature}
                              </div>
                          ))}
                      </div>
                      <button onClick={() => navigate('/login')} className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-stone-100 transition-all shadow-lg shadow-white/10 relative z-10">
                          Join Waitlist
                      </button>
                      
                      {/* Decoration */}
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-stone-800/30 rounded-full blur-3xl pointer-events-none"></div>
                  </div>

                  {/* Enterprise */}
                  <div className="p-10 rounded-[2.5rem] border border-stone-200 bg-white flex flex-col h-full hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-stone-100 text-stone-500 text-[10px] font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-wider">Coming Soon</div>
                      <div className="mb-8">
                          <div className="text-stone-500 font-bold text-sm uppercase tracking-wider mb-2">Teams</div>
                          <div className="flex items-baseline gap-1">
                              <span className="text-5xl font-display font-bold text-stone-900">${billingCycle === 'monthly' ? '99' : '79'}</span>
                              <span className="text-stone-400 font-medium">/mo</span>
                          </div>
                          <p className="text-stone-500 mt-4 text-sm leading-relaxed">For scaling organizations and agencies.</p>
                      </div>
                      <div className="flex-1 space-y-4 mb-10">
                          {['Everything in Business', 'SSO / SAML', 'Dedicated Success Manager', 'Custom Contracts', 'Audit Logs', 'Unlimited Seats'].map(feature => (
                              <div key={feature} className="flex items-center gap-3 text-sm text-stone-600 font-medium">
                                  <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center shrink-0"><Check size={12} /></div>
                                  {feature}
                              </div>
                          ))}
                      </div>
                      <button onClick={() => navigate('/login')} className="w-full py-4 rounded-2xl border border-stone-200 font-bold text-stone-900 hover:bg-stone-50 hover:border-stone-300 transition-all">
                          Join Waitlist
                      </button>
                  </div>

              </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-stone-50 border-t border-stone-100">
          <div className="max-w-3xl mx-auto px-6">
              <h2 className="font-display text-3xl font-bold text-black mb-12 text-center">Frequently asked questions</h2>
              
              <div className="space-y-4">
                  <FaqItem 
                    question="Does the code work in Outlook?" 
                    answer="Yes. We use a hybrid coding technique that ensures compatibility with all major email clients, including Outlook desktop versions, Gmail, Apple Mail, and Yahoo."
                  />
                  <FaqItem 
                    question="Can I import my own brand assets?" 
                    answer="Absolutely. You can upload your logo, define your primary brand color, and even point us to your website so our AI can learn your style automatically."
                  />
                  <FaqItem 
                    question="Is the generated code mobile responsive?" 
                    answer="100%. All emails generated by KindlyMail are built mobile-first, ensuring they look great on phones, tablets, and desktops."
                  />
                  <FaqItem 
                    question="How do I export to Mailchimp?" 
                    answer="We have a direct integration (coming for Business plan) or you can simply click 'Copy HTML' and paste it into Mailchimp's custom code editor. It takes about 10 seconds."
                  />
              </div>
          </div>
      </section>

      {/* Footer - Big, Black, Curved */}
      <footer className="bg-black text-white pt-24 pb-12 rounded-t-[3rem] mt-12">
          <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-3">
                    <img src="https://iili.io/fNbamD7.md.png" alt="KindlyMail Logo" className="w-8 h-8 rounded-lg shadow-sm" />
                    <span className="font-bold text-xl tracking-tight text-white">KindlyMail</span>
                 </div>
                 <p className="text-stone-400 text-sm max-w-sm">
                    Crafting the future of email communication with kindness and intelligence.
                 </p>
                 <div className="text-xs text-stone-500 mt-2">
                    © 2026 KindlyMail AI Inc.
                 </div>
              </div>

              <div className="flex gap-8 text-sm font-medium text-stone-400">
                  <a href="#" className="hover:text-white transition-colors">Twitter</a>
                  <button onClick={() => navigate('/brand-assets')} className="hover:text-white transition-colors">Brand Assets</button>
                  <button onClick={() => navigate('/legal')} className="hover:text-white transition-colors">Legal</button>
                  <button onClick={() => navigate('/legal')} className="hover:text-white transition-colors">Privacy</button>
              </div>
          </div>
      </footer>
    </div>
  );
};

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-stone-50 transition-colors"
            >
                <span className="font-semibold text-stone-900 text-sm md:text-base">{question}</span>
                {isOpen ? <ChevronUp className="text-stone-400" size={18} /> : <ChevronDown className="text-stone-400" size={18} />}
            </button>
            {isOpen && (
                <div className="px-5 pb-5 text-stone-500 text-sm leading-relaxed border-t border-stone-100 pt-4 bg-stone-50/30">
                    {answer}
                </div>
            )}
        </div>
    );
};