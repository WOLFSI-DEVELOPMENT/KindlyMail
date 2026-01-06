import React, { useState } from 'react';
import { Download, ArrowLeft, Heart, MousePointer2, BarChart3, Users, MessageSquare, Sliders, Layout, Zap, FileText, Copy, Check } from 'lucide-react';

interface BrandAssetsViewProps {
  onBack: () => void;
}

export const BrandAssetsView: React.FC<BrandAssetsViewProps> = ({ onBack }) => {
  
  const handleDownloadLogo = (theme: 'light' | 'dark') => {
    const link = document.createElement('a');
    link.href = 'https://iili.io/fNbamD7.md.png';
    link.download = 'KindlyMail-Logo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAsset = (name: string) => {
      alert(`Downloading asset: ${name}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
            <img src="https://iili.io/fNbamD7.md.png" alt="KindlyMail Logo" className="w-8 h-8 rounded-lg shadow-sm" />
            <span className="font-bold text-xl tracking-tight text-black">KindlyMail</span>
          </div>
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-6">Brand Assets</h1>
            <p className="text-xl text-stone-500 max-w-2xl mx-auto">
                Official logos, colors, and product screenshots for KindlyMail. 
                Optimized for press kits and marketing materials.
            </p>
        </div>

        {/* Logos Section */}
        <section className="mb-32">
            <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3">
                <span className="bg-stone-100 text-stone-500 text-sm font-mono px-2 py-1 rounded">01</span>
                Logos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Light Mode Logo */}
                <div className="border border-stone-200 rounded-3xl p-12 flex flex-col items-center justify-center bg-stone-50 gap-8 group relative overflow-hidden">
                    <div className="flex items-center gap-4 transform scale-150">
                         <img src="https://iili.io/fNbamD7.md.png" alt="KindlyMail Logo" className="w-16 h-16 rounded-2xl shadow-lg" />
                    </div>
                    <button 
                        onClick={() => handleDownloadLogo('light')}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-white border border-stone-200 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md absolute bottom-8"
                    >
                        <Download size={14} /> Download PNG
                    </button>
                </div>

                {/* Dark Mode Logo (Inverted Context) */}
                <div className="border border-stone-200 rounded-3xl p-12 flex flex-col items-center justify-center bg-black gap-8 group relative overflow-hidden">
                    <div className="flex items-center gap-4 transform scale-150">
                         <div className="relative">
                            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                            <img src="https://iili.io/fNbamD7.md.png" alt="KindlyMail Logo" className="relative w-16 h-16 rounded-2xl shadow-lg border border-white/10" />
                         </div>
                    </div>
                    <button 
                        onClick={() => handleDownloadLogo('dark')}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-white/20 absolute bottom-8"
                    >
                        <Download size={14} /> Download PNG
                    </button>
                </div>
            </div>
        </section>

        {/* Product Screenshots Section */}
        <section className="mb-32">
            <h2 className="text-2xl font-display font-bold mb-10 flex items-center gap-3">
                <span className="bg-stone-100 text-stone-500 text-sm font-mono px-2 py-1 rounded">02</span>
                App Screenshots
            </h2>
            
            <div className="space-y-20">
                
                {/* Feature 1: AI Chat */}
                <LargeScreenshotCard 
                    title="AI Copilot Interface" 
                    description="Our natural language engine allows users to generate production-ready emails just by chatting. The interface is clean, showing a conversation history and a prominent input area."
                    tag="Generation"
                    onDownload={() => handleDownloadAsset('AI_Copilot.png')}
                >
                    <div className="flex flex-col h-[500px] w-full bg-stone-50 relative">
                        {/* Mock Chat UI */}
                        <div className="absolute top-10 left-10 right-10 bottom-0 bg-white rounded-t-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
                             <div className="h-12 border-b border-stone-100 flex items-center px-4 bg-stone-50/50">
                                 <div className="flex gap-2">
                                     <div className="w-3 h-3 rounded-full bg-red-400/50"></div>
                                     <div className="w-3 h-3 rounded-full bg-amber-400/50"></div>
                                     <div className="w-3 h-3 rounded-full bg-green-400/50"></div>
                                 </div>
                             </div>
                             <div className="flex-1 p-8 space-y-6">
                                 <div className="flex flex-col items-end gap-2">
                                     <div className="bg-stone-900 text-white px-6 py-4 rounded-3xl rounded-br-none text-lg shadow-sm">
                                         Create a newsletter for our spring collection launch.
                                     </div>
                                 </div>
                                 <div className="flex flex-col items-start gap-2">
                                     <div className="bg-white border border-stone-200 text-stone-700 px-6 py-4 rounded-3xl rounded-bl-none text-lg shadow-sm">
                                         I've generated 3 variations based on your brand colors.
                                     </div>
                                 </div>
                             </div>
                             <div className="p-6 border-t border-stone-100 bg-white">
                                 <div className="h-14 rounded-full border border-stone-200 bg-stone-50"></div>
                             </div>
                        </div>
                    </div>
                </LargeScreenshotCard>

                {/* Feature 2: Visual Editor */}
                <LargeScreenshotCard 
                    title="Visual Editor" 
                    description="Users can fine-tune every pixel using the visual inspector. It provides granular control over typography, spacing, colors, and layout without writing code."
                    tag="Editing"
                    align="right"
                    onDownload={() => handleDownloadAsset('Visual_Editor.png')}
                >
                    <div className="flex h-[500px] w-full bg-stone-100 relative items-center justify-center">
                        <div className="absolute inset-10 bg-white rounded-xl shadow-2xl border border-stone-200 flex overflow-hidden">
                            <div className="w-64 border-r border-stone-100 bg-stone-50 p-4 space-y-4">
                                <div className="space-y-2">
                                    <div className="h-4 w-20 bg-stone-200 rounded"></div>
                                    <div className="h-10 w-full bg-white border border-stone-200 rounded-lg"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-24 bg-stone-200 rounded"></div>
                                    <div className="flex gap-2">
                                        <div className="h-10 w-10 bg-stone-900 rounded-lg"></div>
                                        <div className="h-10 flex-1 bg-white border border-stone-200 rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 bg-stone-50/50 p-8 flex items-center justify-center">
                                <div className="w-64 h-64 bg-white shadow-lg rounded-xl border border-stone-200 flex flex-col items-center justify-center p-8">
                                     <div className="w-16 h-16 rounded-full bg-pink-100 mb-4"></div>
                                     <div className="h-4 w-32 bg-stone-200 rounded mb-2"></div>
                                     <div className="h-2 w-20 bg-stone-100 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </LargeScreenshotCard>

                {/* Feature 3: Analytics */}
                <LargeScreenshotCard 
                    title="Real-time Analytics" 
                    description="Track open rates, click-throughs, and engagement in real-time. The dashboard presents complex data in beautiful, easy-to-understand charts."
                    tag="Performance"
                    onDownload={() => handleDownloadAsset('Analytics.png')}
                >
                    <div className="flex flex-col h-[500px] w-full bg-stone-50 relative p-12">
                        <div className="bg-white w-full h-full rounded-2xl shadow-xl border border-stone-100 p-8 flex flex-col">
                             <div className="flex justify-between items-end mb-8">
                                 <div>
                                     <h3 className="text-2xl font-bold text-stone-900">Campaign Performance</h3>
                                     <p className="text-stone-500">Last 30 Days</p>
                                 </div>
                                 <div className="text-4xl font-bold text-stone-900">24.8% <span className="text-base text-green-500 font-normal">Open Rate</span></div>
                             </div>
                             <div className="flex-1 flex items-end justify-between gap-4">
                                 {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                                     <div key={i} className="w-full bg-stone-50 rounded-t-xl relative group overflow-hidden">
                                         <div 
                                             style={{ height: `${h}%` }} 
                                             className={`absolute bottom-0 w-full rounded-t-xl transition-all duration-700 ${i === 11 ? 'bg-stone-900' : 'bg-stone-200 group-hover:bg-stone-300'}`}
                                         ></div>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    </div>
                </LargeScreenshotCard>

            </div>
        </section>

        {/* Product Hunt Kit */}
        <section>
            <h2 className="text-2xl font-display font-bold mb-10 flex items-center gap-3">
                <span className="bg-stone-100 text-stone-500 text-sm font-mono px-2 py-1 rounded">03</span>
                Launch Kit
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Copy Section */}
                <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">Name</span>
                        </div>
                        <CopyBox text="KindlyMail AI" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">Tagline</span>
                        </div>
                        <CopyBox text="Create emails worth opening. AI-powered, designer-quality." />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">Description</span>
                        </div>
                        <CopyBox 
                            multiline 
                            text="Stop wrestling with HTML table tags. KindlyMail is the first email design engine that understands your brand. Paste a URL to extract styles, upload a screenshot to clone a layout, or just chat to design production-ready code." 
                        />
                    </div>
                </div>

                {/* Media Guidelines */}
                <div className="flex flex-col gap-8">
                    {/* Thumbnail Asset */}
                    <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 flex items-center gap-8">
                        <div className="w-24 h-24 bg-white rounded-2xl shadow-sm border border-stone-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-stone-400">240x240</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-stone-900 mb-1">Thumbnail (GIF/JPG)</h3>
                            <p className="text-sm text-stone-500 mb-4">Use the main logo on a white background or a simple animation.</p>
                            <button className="text-xs font-bold text-stone-900 border-b border-stone-200 hover:border-stone-900 transition-all pb-0.5">Download Template</button>
                        </div>
                    </div>

                    {/* Gallery Asset */}
                    <div className="flex-1 bg-stone-50 rounded-3xl p-8 border border-stone-200 flex flex-col justify-center">
                        <div className="aspect-[16/9] w-full bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center mb-6">
                            <span className="text-xs font-bold text-stone-400">1270x760</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-stone-900 mb-1">Gallery Images</h3>
                            <p className="text-sm text-stone-500 mb-4">We recommend 3-5 images showing the dashboard, the editor, and the final output.</p>
                            <button className="text-xs font-bold text-stone-900 border-b border-stone-200 hover:border-stone-900 transition-all pb-0.5">Download Kit</button>
                        </div>
                    </div>
                </div>

            </div>
        </section>

      </main>
    </div>
  );
};

const LargeScreenshotCard: React.FC<{ 
    children: React.ReactNode; 
    title: string; 
    description: string;
    tag?: string;
    align?: 'left' | 'right';
    onDownload?: () => void;
}> = ({ children, title, description, tag, align = 'left', onDownload }) => {
    return (
        <div className={`flex flex-col lg:flex-row gap-12 items-center ${align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
            
            {/* Image Container */}
            <div className="w-full lg:w-3/5 group">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-stone-200 border border-stone-100 bg-white transition-transform duration-500 hover:scale-[1.01]">
                     {/* Window Chrome */}
                    <div className="h-10 bg-white border-b border-stone-100 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-stone-200"></div>
                        <div className="w-3 h-3 rounded-full bg-stone-200"></div>
                        <div className="w-3 h-3 rounded-full bg-stone-200"></div>
                    </div>
                    {children}

                    {onDownload && (
                        <button 
                            onClick={onDownload}
                            className="absolute top-4 right-4 bg-white/90 backdrop-blur text-stone-900 p-2.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
                        >
                            <Download size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Text Content */}
            <div className="w-full lg:w-2/5">
                {tag && (
                    <span className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-bold uppercase tracking-wider mb-4">
                        {tag}
                    </span>
                )}
                <h3 className="text-3xl font-display font-bold text-stone-900 mb-4">{title}</h3>
                <p className="text-lg text-stone-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

const CopyBox: React.FC<{ text: string; multiline?: boolean }> = ({ text, multiline }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="relative group">
            {multiline ? (
                <textarea 
                    readOnly 
                    value={text} 
                    className="w-full h-24 bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm text-stone-800 resize-none focus:outline-none"
                />
            ) : (
                <input 
                    readOnly 
                    value={text} 
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 focus:outline-none"
                />
            )}
            <button 
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-white border border-stone-200 rounded-lg text-stone-500 hover:text-stone-900 shadow-sm opacity-0 group-hover:opacity-100 transition-all active:scale-95"
            >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
            </button>
        </div>
    );
}