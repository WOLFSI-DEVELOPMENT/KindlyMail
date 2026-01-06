import React, { useState } from 'react';
import { ArrowRight, Globe, Loader2, Check, ArrowLeft, Plus, Search, Twitter, Users, HelpCircle, Palette, FileEdit, Layout } from 'lucide-react';
import { analyzeBrandAssets, BrandAssets } from '../services/geminiService';

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  websiteUrl: string;
  brandAssets: BrandAssets;
  integration: string | null;
  source: string;
  context: string;
  action: 'template' | 'blank';
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    websiteUrl: '',
    brandAssets: { colors: [], fonts: [] },
    integration: null,
    source: '',
    context: '',
    action: 'blank'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleWebsiteSubmit = async () => {
    if (!data.websiteUrl) return;
    setStep(1); // Move to analysis view
    setIsAnalyzing(true);
    
    // Call Gemini
    const assets = await analyzeBrandAssets(data.websiteUrl);
    
    setData(prev => ({ ...prev, brandAssets: assets }));
    setIsAnalyzing(false);
  };

  const renderStep = () => {
    switch(step) {
      case 0: // Website URL
        return (
          <div className="w-full max-w-lg mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Globe className="text-stone-900" size={32} />
             </div>
             <h2 className="text-3xl font-display font-bold text-stone-900 mb-4">Let's get to know you.</h2>
             <p className="text-stone-500 mb-8 text-lg">Enter your website URL so we can learn your brand's unique style.</p>
             
             <div className="relative">
                <input 
                    type="url" 
                    placeholder="https://yourwebsite.com"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-6 py-5 text-xl outline-none focus:ring-2 focus:ring-black/5 mb-6 text-center"
                    value={data.websiteUrl}
                    onChange={(e) => setData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleWebsiteSubmit()}
                />
                <button 
                    onClick={handleWebsiteSubmit}
                    disabled={!data.websiteUrl}
                    className="w-full bg-black text-white rounded-full py-4 font-bold text-lg hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Analyze Brand
                </button>
                <button onClick={() => setStep(2)} className="mt-4 text-stone-400 hover:text-stone-600 text-sm font-medium">
                    Skip for now
                </button>
             </div>
          </div>
        );

      case 1: // Analysis Result
        return (
           <div className="w-full max-w-lg mx-auto text-center animate-in fade-in zoom-in-95 duration-500">
              {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-10">
                      <div className="relative w-24 h-24 mb-6">
                         <div className="absolute inset-0 border-4 border-stone-100 rounded-full"></div>
                         <div className="absolute inset-0 border-4 border-t-black rounded-full animate-spin"></div>
                         <Palette className="absolute inset-0 m-auto text-stone-300" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-stone-900 mb-2">Analyzing {data.websiteUrl}...</h3>
                      <p className="text-stone-500">Extracting colors, fonts, and vibes.</p>
                  </div>
              ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2">
                      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                          <Check size={32} />
                      </div>
                      <h2 className="text-3xl font-display font-bold text-stone-900 mb-2">We found your style!</h2>
                      <p className="text-stone-500 mb-8">Here is what we extracted from your site.</p>
                      
                      <div className="bg-stone-50 rounded-2xl p-6 mb-8 text-left border border-stone-100">
                          <div className="mb-4">
                              <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">Brand Colors</span>
                              <div className="flex gap-3 mt-2">
                                  {data.brandAssets.colors.length > 0 ? data.brandAssets.colors.map((c, i) => (
                                      <div key={i} className="flex flex-col gap-1 items-center">
                                        <div className="w-12 h-12 rounded-full shadow-sm border border-black/5" style={{ backgroundColor: c }}></div>
                                        <span className="text-[10px] font-mono text-stone-500">{c}</span>
                                      </div>
                                  )) : <span className="text-sm text-stone-400">No specific colors detected.</span>}
                              </div>
                          </div>
                          <div>
                              <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">Typography</span>
                              <div className="mt-2 text-lg font-medium text-stone-900 border-b border-stone-200 pb-1 inline-block">
                                  {data.brandAssets.fonts[0] || 'Sans-serif'}
                              </div>
                          </div>
                      </div>

                      <button 
                        onClick={handleNext}
                        className="w-full bg-black text-white rounded-full py-4 font-bold text-lg hover:bg-stone-800 transition-all"
                      >
                        Looks Good
                      </button>
                  </div>
              )}
           </div>
        );

      case 2: // Integrations (Klaviyo)
        return (
            <div className="w-full max-w-lg mx-auto text-center animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-3xl font-display font-bold text-stone-900 mb-4">Connect your ESP.</h2>
                <p className="text-stone-500 mb-8 text-lg">Where should we send your finished emails?</p>

                <div 
                    onClick={() => setData(prev => ({ ...prev, integration: prev.integration === 'klaviyo' ? null : 'klaviyo' }))}
                    className={`
                        cursor-pointer group relative p-6 rounded-2xl border-2 transition-all duration-300 mb-8 flex items-center gap-4 text-left
                        ${data.integration === 'klaviyo' ? 'border-black bg-stone-50' : 'border-stone-100 hover:border-stone-200 bg-white'}
                    `}
                >
                    <div className="w-16 h-16 bg-white rounded-xl border border-stone-100 flex items-center justify-center p-3 shadow-sm">
                        <img src="https://cdn.worldvectorlogo.com/logos/klaviyo.svg" alt="Klaviyo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-stone-900">Klaviyo</h3>
                        <p className="text-stone-500 text-sm">Marketing Automation</p>
                    </div>
                    <div className={`
                        ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                        ${data.integration === 'klaviyo' ? 'border-black bg-black text-white' : 'border-stone-200 text-transparent'}
                    `}>
                        <Check size={14} />
                    </div>
                </div>

                <button 
                    onClick={handleNext}
                    className="w-full bg-black text-white rounded-full py-4 font-bold text-lg hover:bg-stone-800 transition-all"
                >
                    {data.integration ? 'Connect & Continue' : 'Skip for now'}
                </button>
            </div>
        );

      case 3: // Source
         const sources = [
             { id: 'producthunt', label: 'Product Hunt', icon: <span className="font-bold text-orange-500">P</span> },
             { id: 'twitter', label: 'Twitter / X', icon: <Twitter size={18} className="text-blue-400" /> },
             { id: 'aisearch', label: 'AI Search Tool', icon: <Search size={18} className="text-purple-500" /> },
             { id: 'friend', label: 'Friend', icon: <Users size={18} className="text-green-500" /> },
             { id: 'other', label: 'Other', icon: <HelpCircle size={18} className="text-stone-400" /> },
         ];

         return (
            <div className="w-full max-w-lg mx-auto text-center animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-3xl font-display font-bold text-stone-900 mb-4">How did you find us?</h2>
                <p className="text-stone-500 mb-8 text-lg">We're just curious.</p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    {sources.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setData(prev => ({ ...prev, source: s.id }))}
                            className={`
                                flex items-center gap-3 p-4 rounded-xl border transition-all font-medium text-sm
                                ${data.source === s.id 
                                    ? 'border-black bg-stone-50 ring-1 ring-black text-stone-900' 
                                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'}
                            `}
                        >
                            <div className="w-8 h-8 rounded-full bg-white border border-stone-100 flex items-center justify-center shadow-sm">
                                {s.icon}
                            </div>
                            {s.label}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handleNext}
                    className="w-full bg-black text-white rounded-full py-4 font-bold text-lg hover:bg-stone-800 transition-all"
                >
                    Continue
                </button>
            </div>
         );

       case 4: // Context
          return (
            <div className="w-full max-w-lg mx-auto text-center animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-3xl font-display font-bold text-stone-900 mb-4">Add Personal Context</h2>
                <p className="text-stone-500 mb-8 text-lg">Anything specific we should know about your writing style?</p>

                <div className="relative mb-8">
                    <textarea 
                        className="w-full h-40 bg-stone-50 border border-stone-200 rounded-2xl p-6 text-lg resize-none outline-none focus:ring-2 focus:ring-black/5"
                        placeholder="e.g. I prefer short, punchy sentences. Never use emojis. Always sign off with 'Best, [Name]'."
                        value={data.context}
                        onChange={(e) => setData(prev => ({ ...prev, context: e.target.value }))}
                    />
                </div>

                <button 
                    onClick={handleNext}
                    className="w-full bg-black text-white rounded-full py-4 font-bold text-lg hover:bg-stone-800 transition-all"
                >
                    Continue
                </button>
                <button onClick={handleNext} className="mt-4 text-stone-400 hover:text-stone-600 text-sm font-medium">
                    Skip this step
                </button>
            </div>
          );

       case 5: // Final Action
          return (
            <div className="w-full max-w-4xl mx-auto text-center animate-in fade-in zoom-in-95 duration-500">
                <h2 className="text-4xl font-display font-bold text-stone-900 mb-6">You're all set.</h2>
                <p className="text-stone-500 mb-12 text-xl">How would you like to start your first project?</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                        onClick={() => {
                            const finalData = { ...data, action: 'template' as const };
                            onComplete(finalData);
                        }}
                        className="group flex flex-col items-center justify-center p-10 bg-white border border-stone-200 rounded-[2rem] hover:shadow-xl hover:border-stone-300 hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                            <Layout size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-stone-900 mb-2">Start with a Template</h3>
                        <p className="text-stone-500 max-w-xs mx-auto">Browse our gallery of high-converting, professionally designed layouts.</p>
                    </button>

                    <button 
                        onClick={() => {
                            const finalData = { ...data, action: 'blank' as const };
                            onComplete(finalData);
                        }}
                        className="group flex flex-col items-center justify-center p-10 bg-white border border-stone-200 rounded-[2rem] hover:shadow-xl hover:border-stone-300 hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 text-stone-900 group-hover:scale-110 transition-transform">
                            <FileEdit size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-stone-900 mb-2">Blank Canvas</h3>
                        <p className="text-stone-500 max-w-xs mx-auto">Start from scratch using our AI prompt builder to guide you.</p>
                    </button>
                </div>
            </div>
          );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
        {/* Progress Bar (Simple) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-stone-50">
            <div 
                className="h-full bg-black transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / 6) * 100}%` }}
            ></div>
        </div>

        {/* Back Button */}
        {step > 0 && (
            <button 
                onClick={handleBack}
                className="absolute top-8 left-8 p-2 rounded-full hover:bg-stone-50 text-stone-400 hover:text-stone-900 transition-colors"
            >
                <ArrowLeft size={24} />
            </button>
        )}

        <div className="flex-grow flex items-center justify-center p-6">
            {renderStep()}
        </div>
    </div>
  );
};