import React from 'react';
import { PromptInput } from './ui/PromptInput';
import { Message, ToneOption } from '../types';

interface HomeViewProps {
  onGenerate: (prompt: string, imageUrl?: string | null, websiteUrl?: string, brandLogo?: string | null, brandColor?: string, figmaUrl?: string, youtubeUrl?: string) => void;
  isLoading: boolean;
  onOpenSettings: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onGenerate, isLoading, onOpenSettings }) => {
  const [prompt, setPrompt] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [websiteUrl, setWebsiteUrl] = React.useState('');
  const [brandLogo, setBrandLogo] = React.useState<string | null>(null);
  const [brandColor, setBrandColor] = React.useState('#000000');
  const [figmaUrl, setFigmaUrl] = React.useState('');
  const [youtubeUrl, setYoutubeUrl] = React.useState('');

  const handleGenerate = () => {
    if (prompt.trim() || imageUrl || figmaUrl || youtubeUrl) {
      onGenerate(prompt, imageUrl, websiteUrl, brandLogo, brandColor, figmaUrl, youtubeUrl);
    }
  };

  const suggestions = [
    "Create a welcome email for new Infinity OS users",
    "Write a 'Weekly Intelligence Stream' newsletter",
    "Draft a follow-up for a missed meeting",
    "Cold outreach for a design partnership"
  ];

  return (
    <div className="flex flex-col h-full w-full relative overflow-y-auto">
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 w-full max-w-5xl mx-auto py-12">
        
        {/* Full Personalization Pill Bar */}
        <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button
                onClick={onOpenSettings}
                className="bg-white border border-stone-200 rounded-full py-1.5 pl-1.5 pr-4 flex items-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
            >
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">NEW</span>
                <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900">Full Personalization</span>
            </button>
        </div>

        {/* Hero Text */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold text-center text-stone-900 mb-6 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Create Emails Worth Opening
        </h1>
        
        <p className="text-lg sm:text-xl text-stone-500 text-center mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          AI that writes, designs, and delivers campaigns that actually convert.
        </p>

        {/* Input Section */}
        <div className="w-full max-w-3xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <PromptInput 
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleGenerate}
            onImageUpload={setImageUrl}
            websiteUrl={websiteUrl}
            onWebsiteUrlChange={setWebsiteUrl}
            brandLogo={brandLogo}
            onBrandLogoChange={setBrandLogo}
            brandColor={brandColor}
            onBrandColorChange={setBrandColor}
            figmaUrl={figmaUrl}
            onFigmaUrlChange={setFigmaUrl}
            youtubeUrl={youtubeUrl}
            onYoutubeUrlChange={setYoutubeUrl}
            isLoading={isLoading}
          />
        </div>

        {/* Suggestions */}
        <div className="w-full max-w-4xl overflow-x-auto pb-4 no-scrollbar animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
            <div className="flex gap-4 px-2 justify-center">
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-stone-900 whitespace-nowrap mr-2">
                    Suggested prompts <span className="text-stone-400">›</span>
                </div>
                {suggestions.map((suggestion, index) => (
                    <button 
                        key={index}
                        onClick={() => setPrompt(suggestion)}
                        className="flex-shrink-0 px-5 py-3 bg-white border border-stone-100 rounded-2xl text-stone-600 text-sm font-medium hover:border-stone-300 hover:shadow-md transition-all text-left max-w-[280px]"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>

      </main>
    </div>
  );
};