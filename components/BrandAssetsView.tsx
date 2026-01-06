import React from 'react';
import { Download, ArrowLeft, Heart, MousePointer2, BarChart3, Users, MessageSquare, Sliders, Layout, Zap, FileText } from 'lucide-react';

interface BrandAssetsViewProps {
  onBack: () => void;
}

export const BrandAssetsView: React.FC<BrandAssetsViewProps> = ({ onBack }) => {
  
  const handleDownloadLogo = (theme: 'light' | 'dark') => {
    // For now, we will just download the provided PNG for simplicity in this demo environment
    // In a real env, you might serve specific SVGs or PNGs based on the theme
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
        <section className="mb-24">
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
        <section className="mb-24">
            <h2 className="text-2xl font-display font-bold mb-10 flex items-center gap-3">
                <span className="bg-stone-100 text-stone-500 text-sm font-mono px-2 py-1 rounded">02</span>
                App Screenshots
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                
                {/* 1. AI Chat */}
                <ScreenshotCard 
                    title="AI Copilot" 
                    description="Natural language design engine."
                    onDownload={() => handleDownloadAsset('AI_Copilot.png')}
                >
                    <div className="flex flex-col h-full bg-stone-50/50">
                        <div className="flex-1 p-4 space-y-3 overflow-hidden">
                             <div className="flex justify-end">
                                 <div className="bg-stone-900 text-white text-[10px] px-3 py-2 rounded-2xl rounded-br-sm shadow-sm max-w-[80%]">
                                     Make it pop with a neon gradient.
                                 </div>
                             </div>
                             <div className="flex justify-start">
                                 <div className="bg-white border border-stone-100 text-stone-600 text-[10px] px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm max-w-[80%]">
                                     I've applied a linear-gradient (pink to purple) to the header.
                                 </div>
                             </div>
                        </div>
                        <div className="p-3 border-t border-stone-100 bg-white">
                            <div className="h-8 rounded-full border border-stone-200 bg-stone-50 flex items-center px-3 justify-between">
                                <div className="h-1.5 w-20 bg-stone-200 rounded-full"></div>
                                <div className="w-5 h-5 rounded-full bg-stone-900 flex items-center justify-center">
                                    <ArrowLeft size={8} className="text-white rotate-90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </ScreenshotCard>

                {/* 2. Visual Editor */}
                <ScreenshotCard 
                    title="Visual Editor" 
                    description="Precision control over every pixel."
                    onDownload={() => handleDownloadAsset('Visual_Editor.png')}
                >
                    <div className="flex h-full">
                        <div className="w-1/3 border-r border-stone-100 bg-white p-3 space-y-3">
                            <div className="space-y-1">
                                <div className="h-1 w-8 bg-stone-300 rounded-full"></div>
                                <div className="h-6 w-full bg-stone-50 border border-stone-200 rounded-md"></div>
                            </div>
                            <div className="space-y-1">
                                <div className="h-1 w-10 bg-stone-300 rounded-full"></div>
                                <div className="flex gap-1">
                                    <div className="h-6 w-6 bg-stone-900 rounded-md"></div>
                                    <div className="h-6 flex-1 bg-stone-50 border border-stone-200 rounded-md"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 bg-stone-50 p-4 flex items-center justify-center">
                            <div className="w-20 h-20 bg-white shadow-lg rounded-lg border border-stone-100 flex items-center justify-center">
                                <div className="w-10 h-1 rounded-full bg-stone-200 mb-2"></div>
                                <div className="w-8 h-8 rounded-full bg-pink-500/20"></div>
                            </div>
                        </div>
                    </div>
                </ScreenshotCard>

                {/* 3. Template Gallery */}
                <ScreenshotCard 
                    title="Template Gallery" 
                    description="Start with high-converting layouts."
                    onDownload={() => handleDownloadAsset('Templates.png')}
                >
                    <div className="grid grid-cols-2 gap-3 p-4 bg-stone-50/30 h-full overflow-hidden">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-lg border border-stone-100 shadow-sm overflow-hidden flex flex-col h-24">
                                <div className="h-14 bg-stone-100 relative">
                                    {i === 1 && <div className="absolute inset-2 bg-pink-100 rounded-sm"></div>}
                                    {i === 2 && <div className="absolute inset-2 bg-blue-100 rounded-sm"></div>}
                                </div>
                                <div className="p-1.5 space-y-1">
                                    <div className="h-1 w-10 bg-stone-800 rounded-full"></div>
                                    <div className="h-0.5 w-6 bg-stone-200 rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScreenshotCard>

                {/* 4. Context Memory */}
                <ScreenshotCard 
                    title="Context Memory" 
                    description="Upload docs to train your AI."
                    onDownload={() => handleDownloadAsset('Context_Memory.png')}
                >
                    <div className="flex flex-col h-full">
                        <div className="p-3 border-b border-stone-100 bg-white">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Zap size={12} />
                                </div>
                                <div>
                                    <div className="h-1.5 w-16 bg-stone-800 rounded-full mb-1"></div>
                                    <div className="h-1 w-8 bg-stone-300 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 bg-stone-50 p-3 space-y-2 relative overflow-hidden">
                             {/* Floating Nodes Effect */}
                             <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                             <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-75"></div>

                             <div className="bg-white p-2 rounded-lg border border-stone-100 shadow-sm flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-100 rounded flex items-center justify-center text-[6px] text-red-500 font-bold">PDF</div>
                                <div className="h-1 w-12 bg-stone-400 rounded-full"></div>
                             </div>
                             <div className="bg-white p-2 rounded-lg border border-stone-100 shadow-sm flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center text-[6px] text-blue-500 font-bold">DOC</div>
                                <div className="h-1 w-10 bg-stone-400 rounded-full"></div>
                             </div>
                        </div>
                    </div>
                </ScreenshotCard>

                {/* 5. Campaign Analytics (New) */}
                <ScreenshotCard 
                    title="Campaign Analytics" 
                    description="Real-time performance tracking."
                    onDownload={() => handleDownloadAsset('Analytics.png')}
                >
                    <div className="p-4 flex flex-col h-full bg-white">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <div className="h-1.5 w-12 bg-stone-300 rounded-full mb-1"></div>
                                <div className="h-4 w-8 bg-stone-900 rounded-sm"></div>
                            </div>
                            <div className="h-4 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[8px] font-bold">+24%</div>
                        </div>
                        <div className="flex-1 flex items-end justify-between gap-1.5">
                            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                <div key={i} className="w-full bg-stone-100 rounded-t-sm relative group">
                                    <div 
                                        style={{ height: `${h}%` }} 
                                        className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-500 ${i === 5 ? 'bg-stone-900' : 'bg-stone-300'}`}
                                    ></div>
                                </div>
                            ))}
                        </div>
                        <div className="h-px bg-stone-100 w-full mt-1"></div>
                    </div>
                </ScreenshotCard>

                {/* 6. Team Collaboration (New) */}
                <ScreenshotCard 
                    title="Team Collaboration" 
                    description="Multiplayer editing in real-time."
                    onDownload={() => handleDownloadAsset('Collaboration.png')}
                >
                     <div className="relative h-full bg-white p-4">
                         {/* Content Mockup */}
                         <div className="space-y-2 mb-4">
                             <div className="h-2 w-3/4 bg-stone-100 rounded-full"></div>
                             <div className="h-2 w-full bg-stone-100 rounded-full"></div>
                             <div className="h-2 w-5/6 bg-stone-100 rounded-full"></div>
                         </div>
                         <div className="h-20 bg-stone-50 rounded-lg border border-dashed border-stone-200"></div>

                         {/* User Cursor 1 */}
                         <div className="absolute top-8 right-12 flex flex-col items-start z-10">
                             <MousePointer2 size={16} className="text-pink-500 fill-pink-500" />
                             <div className="bg-pink-500 text-white text-[8px] px-1.5 py-0.5 rounded ml-3">Sarah</div>
                         </div>

                         {/* User Cursor 2 */}
                         <div className="absolute bottom-10 left-8 flex flex-col items-start z-10">
                             <MousePointer2 size={16} className="text-blue-500 fill-blue-500" />
                             <div className="bg-blue-500 text-white text-[8px] px-1.5 py-0.5 rounded ml-3">Mike</div>
                         </div>
                     </div>
                </ScreenshotCard>

            </div>
        </section>

      </main>
    </div>
  );
};

const ScreenshotCard: React.FC<{ 
    children: React.ReactNode; 
    title: string; 
    description: string;
    onDownload?: () => void;
}> = ({ children, title, description, onDownload }) => {
    return (
        <div className="group flex flex-col gap-5">
            {/* Window Container */}
            <div className="relative bg-stone-100 rounded-[2rem] p-6 transition-all duration-300 hover:bg-stone-50 hover:-translate-y-2 hover:shadow-xl">
                
                <div className="bg-white rounded-xl shadow-lg shadow-stone-200/50 overflow-hidden border border-stone-200/50 aspect-[4/3] flex flex-col transform transition-transform duration-500 group-hover:scale-[1.02]">
                    {/* Window Chrome */}
                    <div className="h-8 bg-white border-b border-stone-100 flex items-center px-3 gap-1.5 shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] border border-[#e0443e]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e] border border-[#d89e24]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840] border border-[#1aab29]"></div>
                    </div>
                    {/* Window Content */}
                    <div className="flex-1 relative overflow-hidden">
                        {children}
                    </div>
                </div>

                {/* Download Overlay Button (Optional) */}
                {onDownload && (
                    <button 
                        onClick={onDownload}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur text-stone-900 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                        <Download size={16} />
                    </button>
                )}
            </div>

            {/* Label */}
            <div className="text-center px-2">
                <h3 className="font-bold text-lg text-stone-900 mb-1">{title}</h3>
                <p className="text-sm text-stone-500">{description}</p>
            </div>
        </div>
    );
}