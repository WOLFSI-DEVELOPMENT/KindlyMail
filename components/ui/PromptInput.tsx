import React, { useRef, useEffect, useState } from 'react';
import { ArrowUp, Paperclip, Settings, Shuffle, X, Globe, Check, Upload, Palette, Image as ImageIcon, Link2, Mic, Copy, RefreshCw, ArrowRight, ChevronDown, AlignLeft, Code } from 'lucide-react';
import { buildMetaPrompt } from '../../services/geminiService';
import { OutputFormat, ToneSettings } from '../../types';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onImageUpload?: (url: string | null) => void;
  websiteUrl?: string;
  onWebsiteUrlChange?: (url: string) => void;
  brandLogo?: string | null;
  onBrandLogoChange?: (url: string | null) => void;
  brandColor?: string;
  onBrandColorChange?: (color: string) => void;
  figmaUrl?: string;
  onFigmaUrlChange?: (url: string) => void;
  youtubeUrl?: string;
  onYoutubeUrlChange?: (url: string) => void;
  isLoading?: boolean;
  className?: string;
  placeholder?: string;
  outputFormat?: OutputFormat;
  onOutputFormatChange?: (format: OutputFormat) => void;
  toneSettings?: ToneSettings;
  onToneSettingsChange?: (settings: ToneSettings) => void;
}

const FigmaIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 346 512.36">
    <g fillRule="nonzero">
      <path fill="#00B6FF" d="M172.53 246.9c0-42.04 34.09-76.11 76.12-76.11h11.01c.3.01.63-.01.94-.01 47.16 0 85.4 38.25 85.4 85.4 0 47.15-38.24 85.39-85.4 85.39-.31 0-.64-.01-.95-.01l-11 .01c-42.03 0-76.12-34.09-76.12-76.12V246.9z"/>
      <path fill="#24CB71" d="M0 426.98c0-47.16 38.24-85.41 85.4-85.41l87.13.01v84.52c0 47.65-39.06 86.26-86.71 86.26C38.67 512.36 0 474.13 0 426.98z"/>
      <path fill="#FF7237" d="M172.53.01v170.78h87.13c.3-.01.63.01.94.01 47.16 0 85.4-38.25 85.4-85.4C346 38.24 307.76 0 260.6 0c-.31 0-.64.01-.95.01h-87.12z"/>
      <path fill="#FF3737" d="M0 85.39c0 47.16 38.24 85.4 85.4 85.4h87.13V.01H85.39C38.24.01 0 38.24 0 85.39z"/>
      <path fill="#874FFF" d="M0 256.18c0 47.16 38.24 85.4 85.4 85.4h87.13V170.8H85.39C38.24 170.8 0 209.03 0 256.18z"/>
    </g>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 333333 333333" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd">
    <path d="M329930 100020s-3254-22976-13269-33065c-12691-13269-26901-13354-33397-14124-46609-3396-116614-3396-116614-3396h-122s-69973 0-116608 3396c-6522 793-20712 848-33397 14124C6501 77044 3316 100020 3316 100020S-1 126982-1 154001v25265c0 26962 3315 53979 3315 53979s3254 22976 13207 33082c12685 13269 29356 12838 36798 14254 26685 2547 113354 3315 113354 3315s70065-124 116675-3457c6522-770 20706-848 33397-14124 10021-10089 13269-33090 13269-33090s3319-26962 3319-53979v-25263c-67-26962-3384-53979-3384-53979l-18 18-2-2zM132123 209917v-93681l90046 46997-90046 46684z" fill="#FF0000"/>
  </svg>
);

const ScreenshotIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
    <path fill="currentColor" d="M40.7999 3.84H7.2c-1.7817 0.002 -3.4898 0.7106 -4.7496 1.9704C1.1906 7.0702 0.4819 8.7784 0.48 10.56v26.88c0.002 1.7816 0.7106 3.4897 1.9704 4.7495C3.7102 43.4494 5.4183 44.1579 7.2 44.16h33.5999c1.7817 -0.0021 3.4899 -0.7106 4.7497 -1.9705 1.2599 -1.2598 1.9684 -2.9679 1.9704 -4.7495V10.56c-0.002 -1.7816 -0.7105 -3.4898 -1.9704 -4.7496 -1.2598 -1.2598 -2.968 -1.9684 -4.7497 -1.9704Zm-8.4 6.72c0.9969 0 1.9714 0.2956 2.8001 0.8494 0.8289 0.5539 1.4748 1.3409 1.8563 2.2619 0.3814 0.921 0.4813 1.9342 0.2868 2.9119 -0.1944 0.9777 -0.6745 1.8758 -1.3793 2.5806 -0.7049 0.7048 -1.603 1.185 -2.5806 1.3794 -0.9777 0.1945 -1.9911 0.0946 -2.9119 -0.2868 -0.921 -0.3815 -1.7081 -1.0275 -2.262 -1.8563 -0.5537 -0.8288 -0.8493 -1.8032 -0.8493 -2.8 0.0013 -1.3363 0.5329 -2.6175 1.4776 -3.5624 0.945 -0.9448 2.2261 -1.4763 3.5623 -1.4777ZM7.2 40.8c-0.8911 0 -1.7458 -0.354 -2.3759 -0.9841 -0.6301 -0.6301 -0.9841 -1.4847 -0.9841 -2.3759v-7.1011l9.9582 -8.8515c0.9607 -0.8521 2.2103 -1.3059 3.494 -1.2689 1.2837 0.0371 2.505 0.5622 3.415 1.4684l6.8198 6.805L15.2188 40.8H7.2Zm36.96 -3.36c0 0.8912 -0.354 1.7458 -0.9842 2.3759 -0.6301 0.6301 -1.4847 0.9841 -2.3759 0.9841H19.9711l12.7491 -12.7491c0.9027 -0.7676 2.0481 -1.1904 3.2331 -1.1936 1.1848 -0.0031 2.3325 0.4139 3.2391 1.1768l4.9676 4.1391V37.44Z" strokeWidth="1"></path>
  </svg>
);

const WebsiteIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
    <path fill="currentColor" fillRule="evenodd" d="M7.5054 26c0.03923 6.5852 0.26759 11.2322 0.47848 14.181 0.1103 1.5423 1.22655 2.6758 2.70092 2.8086 1.1112 0.1001 2.4695 0.201 4.0889 0.2863 1.1619 -1.2536 2.6073 -2.7613 4.4014 -4.5619 3.7107 -3.7242 6.1754 -5.9535 7.7349 -7.2658 1.9127 -1.6095 4.6093 -1.916 6.8033 -0.3968 1.4844 1.0279 3.6206 2.7133 6.5192 5.4605 0.1299 -2.7175 0.2367 -6.1991 0.2624 -10.5119H7.5054Zm2.8206 20.9735c1.3575 0.1223 3.0507 0.2442 5.1018 0.3397 0.0299 0.0028 0.0599 0.0048 0.0901 0.0062 2.3505 0.1081 5.167 0.1814 8.4825 0.1814 6.2656 0 10.7489 -0.2618 13.6742 -0.5253 3.1603 -0.2846 5.6094 -2.5815 6.2094 -5.596 0.0041 -0.0206 0.0078 -0.0412 0.0113 -0.0619 0.053 -0.2782 0.0903 -0.5623 0.1109 -0.8512 0.239 -3.3411 0.4946 -8.7243 0.4946 -16.4664 0 -7.7424 -0.2556 -13.1264 -0.4946 -16.46756 -0.2461 -3.44144 -2.8476 -6.19331 -6.3319 -6.50712C34.749 0.761853 30.2657 0.5 24.0002 0.5c-6.2656 0 -10.7489 0.261852 -13.6742 0.52532 -3.4843 0.31381 -6.08581 3.06568 -6.33193 6.50712 -0.23895 3.34116 -0.49456 8.72456 -0.49456 16.46696s0.25561 13.1258 0.49456 16.467c0.24612 3.4414 2.84763 6.1933 6.33193 6.5071Zm0.963 -29.327c0 -1.1046 0.8954 -2 2 -2h21.4218c1.1046 0 2 0.8954 2 2s-0.8954 2 -2 2H13.289c-1.1046 0 -2 -0.8954 -2 -2Zm2 -9.81642c-1.1046 0 -2 0.89543 -2 2 0 1.10452 0.8954 2.00002 2 2.00002h11.6846c1.1046 0 2 -0.8955 2 -2.00002 0 -1.10457 -0.8954 -2 -2 -2H13.289ZM11.3156 32.795c0 -2.168 1.7522 -3.9317 3.9212 -3.9317 2.169 0 3.9211 1.7637 3.9211 3.9317s-1.7521 3.9318 -3.9211 3.9318 -3.9212 -1.7638 -3.9212 -3.9318Z" clipRule="evenodd" strokeWidth="1"></path>
  </svg>
);

const PromptBuilderIcon = ({ className, color = "currentColor" }: { className?: string, color?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
    <g id="ai-spark-generate-text">
      <path id="Union" fill={color} d="M19 18c0.5523 0 1 0.4477 1 1s-0.4477 1 -1 1H5c-0.55228 0 -1 -0.4477 -1 -1s0.44772 -1 1 -1zm0 -4c0.5523 0 1 0.4477 1 1s-0.4477 1 -1 1H5c-0.55228 0 -1 -0.4477 -1 -1s0.44772 -1 1 -1zm-7 -4c0.5523 0 1 0.4477 1 1s-0.4477 1 -1 1H5c-0.55228 0 -1 -0.4477 -1 -1s0.44772 -1 1 -1zm6 -8.5c0.5049 0 0.9268 0.32644 1.0801 0.77246l0.0273 0.09082 0.0664 0.22852c0.3705 1.1292 1.3017 2.00646 2.4629 2.30078 0.4917 0.12454 0.8633 0.56893 0.8633 1.10742 0 0.53848 -0.3717 0.9819 -0.8633 1.10645 -1.2386 0.31386 -2.2164 1.29161 -2.5303 2.53027 -0.1245 0.49168 -0.5679 0.86328 -1.1064 0.86328s-0.9819 -0.3716 -1.1064 -0.86328c-0.3139 -1.23866 -1.2917 -2.21641 -2.5303 -2.53027 -0.461 -0.11678 -0.8169 -0.51382 -0.8594 -1.00684L13.5 6l0.0039 -0.09961c0.0425 -0.49305 0.3984 -0.89103 0.8594 -1.00781 1.2384 -0.3139 2.2154 -1.29085 2.5293 -2.5293C17.0171 1.87165 17.4615 1.5 18 1.5M9 6c0.55228 0 1 0.44772 1 1s-0.44772 1 -1 1H5c-0.55228 0 -1 -0.44772 -1 -1s0.44772 -1 1 -1z" strokeWidth="1"></path>
    </g>
  </svg>
);

const ToneDropdownMini: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (val: any) => void;
}> = ({ label, value, options, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">{label}</label>
      <div className="flex flex-wrap gap-1">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-2 py-1 rounded-md text-xs font-medium border transition-all ${value === opt ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export const PromptInput: React.FC<PromptInputProps> = ({ 
  value, 
  onChange, 
  onSubmit, 
  onImageUpload,
  websiteUrl = '',
  onWebsiteUrlChange,
  brandLogo,
  onBrandLogoChange,
  brandColor = '#000000',
  onBrandColorChange,
  figmaUrl = '',
  onFigmaUrlChange,
  youtubeUrl = '',
  onYoutubeUrlChange,
  isLoading,
  className = '',
  placeholder = "Describe the email you want to create...",
  outputFormat = 'html',
  onOutputFormatChange,
  toneSettings,
  onToneSettingsChange
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const formatRef = useRef<HTMLDivElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  // Modal States
  const [showSettings, setShowSettings] = useState(false);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [showFigmaModal, setShowFigmaModal] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [showPromptBuilder, setShowPromptBuilder] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Prompt Builder State
  const [builderInput, setBuilderInput] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isBuildingPrompt, setIsBuildingPrompt] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
      if (formatRef.current && !formatRef.current.contains(event.target as Node)) {
        setShowFormatDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  // ... (keeping toggleListening, uploadToImgBB, etc. unchanged)
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) onChange(value + (value ? ' ' : '') + finalTranscript);
    };
    recognition.onerror = (event: any) => { console.error("Speech Error", event.error); setIsListening(false); }
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const uploadToImgBB = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch('https://api.imgbb.com/1/upload?key=6d207e02198a847aa98d0a2a901485a5', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.success) return data.data.url;
    } catch (error) { console.error('Upload error:', error); }
    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processImageUpload(file);
  };

  const processImageUpload = async (file: File) => {
    setIsUploading(true);
    const url = await uploadToImgBB(file);
    if (url) {
      setUploadedImage(url);
      if (onImageUpload) onImageUpload(url);
      setShowScreenshotModal(false); 
    } else { alert('Failed to upload image.'); }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) await processImageUpload(file);
    }
  };

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    const url = await uploadToImgBB(file);
    if (url) { if (onBrandLogoChange) onBrandLogoChange(url); } 
    else { alert('Failed to upload logo.'); }
    setIsUploadingLogo(false);
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const clearImage = () => {
    setUploadedImage(null);
    if (onImageUpload) onImageUpload(null);
  };

  const handleBuildPrompt = async () => {
    if (!builderInput.trim()) return;
    setIsBuildingPrompt(true);
    setGeneratedPrompt('');
    const result = await buildMetaPrompt(builderInput);
    setGeneratedPrompt(result);
    setIsBuildingPrompt(false);
  };

  const handleUseBuiltPrompt = () => {
    onChange(generatedPrompt);
    setShowPromptBuilder(false);
    setBuilderInput('');
    setGeneratedPrompt('');
  };

  const updateTone = (key: keyof ToneSettings, val: any) => {
      if (onToneSettingsChange && toneSettings) {
          onToneSettingsChange({ ...toneSettings, [key]: val });
      }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className={`relative group bg-white border border-stone-200 shadow-2xl shadow-stone-200/50 rounded-[2rem] transition-all duration-300 focus-within:shadow-stone-300/50 focus-within:border-stone-300 ${className}`}>
        
        <div className="flex flex-col">
          {/* Active Context Chips */}
          <div className="px-6 pt-6 pb-0 flex flex-wrap gap-2">
              {uploadedImage && (
                <div className="relative inline-block">
                  <img src={uploadedImage} alt="Uploaded" className="h-14 w-auto rounded-xl border border-stone-200 shadow-sm" />
                  <button onClick={clearImage} className="absolute -top-2 -right-2 bg-stone-900 text-white rounded-full p-1 shadow-md hover:bg-stone-700 transition-colors"><X size={10} /></button>
                </div>
              )}
              {figmaUrl && (
                  <div className="inline-flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-medium text-stone-700 h-10">
                      <FigmaIcon className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">{figmaUrl}</span>
                      <button onClick={() => onFigmaUrlChange?.('')} className="ml-1 text-stone-400 hover:text-stone-900"><X size={12} /></button>
                  </div>
              )}
              {youtubeUrl && (
                  <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-1.5 text-xs font-medium text-red-700 h-10">
                      <YoutubeIcon className="w-4 h-4" />
                      <span className="truncate max-w-[150px]">{youtubeUrl}</span>
                      <button onClick={() => onYoutubeUrlChange?.('')} className="ml-1 text-red-300 hover:text-red-700"><X size={12} /></button>
                  </div>
              )}
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent border-none outline-none text-xl sm:text-2xl font-medium text-stone-800 placeholder-stone-300 p-6 pb-16 focus:ring-0 resize-none min-h-[120px] max-h-[400px] rounded-[2rem]"
            style={{ height: 'auto' }}
            disabled={isLoading}
            spellCheck={false}
          />
        </div>
        
        <div className="absolute bottom-3 left-6 right-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
              
              {/* Settings Trigger */}
              <div className="relative" ref={settingsRef}>
                <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-full transition-colors flex items-center gap-2 ${showSettings || websiteUrl || brandLogo ? 'text-stone-900 bg-stone-100' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}
                    title="Settings"
                >
                    <Settings size={20} />
                    {(brandLogo || websiteUrl) && <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>}
                </button>

                {/* Expanded Settings Popover */}
                {showSettings && (
                    <div className="absolute bottom-full mb-2 left-0 w-[340px] bg-white border border-stone-200 shadow-xl rounded-2xl p-5 z-20 animate-in fade-in zoom-in-95 duration-200 max-h-[400px] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-stone-900">Editor Settings</h3>
                        <button onClick={() => setShowSettings(false)} className="text-stone-400 hover:text-stone-600">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Section 1: Personality (New) */}
                    {toneSettings && (
                        <div className="mb-5">
                            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                                <AlignLeft size={12} />
                                Tone & Personality
                            </div>
                            <div className="space-y-3 bg-stone-50 p-3 rounded-xl border border-stone-100">
                                <ToneDropdownMini label="Warmth" value={toneSettings.warmth} options={['Default', 'More', 'Less']} onChange={(v) => updateTone('warmth', v)} />
                                <ToneDropdownMini label="Enthusiasm" value={toneSettings.enthusiasm} options={['Default', 'More', 'Less']} onChange={(v) => updateTone('enthusiasm', v)} />
                                <ToneDropdownMini label="Formatting" value={toneSettings.formatting} options={['Default', 'More', 'Less']} onChange={(v) => updateTone('formatting', v)} />
                                <ToneDropdownMini label="Emojis" value={toneSettings.emojis} options={['Default', 'More', 'Less']} onChange={(v) => updateTone('emojis', v)} />
                            </div>
                        </div>
                    )}

                    <div className="h-px bg-stone-100 w-full mb-5"></div>

                    {/* Section 2: Website (Auto) */}
                    <div className="mb-5">
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                            <Globe size={12} />
                            Auto-Detect from URL
                        </div>
                        <div className="relative">
                            <input 
                                type="url"
                                value={websiteUrl}
                                onChange={(e) => onWebsiteUrlChange?.(e.target.value)}
                                placeholder="https://yourwebsite.com"
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-black/5 focus:border-stone-400 outline-none"
                            />
                            {websiteUrl && <div className="absolute right-3 top-2.5 text-green-500"><Check size={14} /></div>}
                        </div>
                        <p className="text-[10px] text-stone-400 mt-1.5 leading-relaxed">
                            Gemini will visit your site to extract fonts, layout style, and tone automatically.
                        </p>
                    </div>

                    <div className="h-px bg-stone-100 w-full mb-5"></div>

                    {/* Section 3: Manual Assets */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                            <Palette size={12} />
                            Manual Assets
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center overflow-hidden shrink-0">
                                {brandLogo ? (
                                    <img src={brandLogo} alt="Brand Logo" className="h-full w-full object-contain p-1" />
                                ) : (
                                    isUploadingLogo ? <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-500 rounded-full animate-spin" /> : <Upload size={16} className="text-stone-300" />
                                )}
                            </div>
                            <div className="flex-grow">
                                <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoSelect} />
                                <button onClick={() => logoInputRef.current?.click()} className="text-xs font-medium text-stone-900 hover:text-pink-600 border-b border-stone-200 hover:border-pink-600 transition-all pb-0.5">
                                    {brandLogo ? 'Replace Logo' : 'Upload Logo'}
                                </button>
                                <p className="text-[10px] text-stone-400 mt-0.5">Recommended: Transparent PNG</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative h-8 w-full rounded-lg bg-stone-50 border border-stone-200 flex items-center px-2 overflow-hidden">
                                <input type="color" value={brandColor} onChange={(e) => onBrandColorChange?.(e.target.value)} className="absolute left-0 top-0 w-8 h-full opacity-0 cursor-pointer" />
                                <div className="w-4 h-4 rounded-full shadow-sm border border-black/10 mr-2" style={{ backgroundColor: brandColor }} />
                                <span className="text-xs font-mono text-stone-600 uppercase flex-grow">{brandColor}</span>
                            </div>
                            <label className="text-xs font-medium text-stone-500 whitespace-nowrap">Primary Color</label>
                        </div>
                    </div>

                    </div>
                )}
              </div>

              {/* Output Format Dropdown */}
              <div className="relative hidden sm:block" ref={formatRef}>
                  <button 
                    onClick={() => setShowFormatDropdown(!showFormatDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-500 bg-stone-50 border border-stone-100 rounded-full hover:bg-stone-100 transition-colors"
                  >
                      {outputFormat === 'html' ? (
                          <>
                            <Shuffle size={14} />
                            <span>Auto</span>
                          </>
                      ) : (
                          <>
                            <AlignLeft size={14} />
                            <span>Text</span>
                          </>
                      )}
                      <ChevronDown size={12} className="opacity-50" />
                  </button>

                  {showFormatDropdown && (
                      <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 p-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                          <button 
                            onClick={() => { onOutputFormatChange?.('html'); setShowFormatDropdown(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${outputFormat === 'html' ? 'bg-stone-100 text-stone-900' : 'text-stone-600 hover:bg-stone-50'}`}
                          >
                              <Code size={14} className="text-pink-500" />
                              <div>
                                  <span className="block text-stone-900">HTML Email (Auto)</span>
                                  <span className="block text-[10px] text-stone-400">Designer layout & visuals</span>
                              </div>
                          </button>
                          <button 
                            onClick={() => { onOutputFormatChange?.('text'); setShowFormatDropdown(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${outputFormat === 'text' ? 'bg-stone-100 text-stone-900' : 'text-stone-600 hover:bg-stone-50'}`}
                          >
                              <AlignLeft size={14} className="text-blue-500" />
                              <div>
                                  <span className="block text-stone-900">Text Only</span>
                                  <span className="block text-[10px] text-stone-400">Simple, personal plain text</span>
                              </div>
                          </button>
                      </div>
                  )}
              </div>

          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleListening} className={`p-2 rounded-xl transition-all active:scale-95 flex items-center justify-center min-w-[40px] min-h-[40px] ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-stone-400 hover:text-stone-800 hover:bg-stone-50'}`} title="Voice Input"><Mic size={20} /></button>
            <button onClick={onSubmit} disabled={(!value.trim() && !uploadedImage && !figmaUrl && !youtubeUrl) || isLoading || isUploading} className="bg-black text-white rounded-full p-2.5 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg flex items-center justify-center min-w-[40px] min-h-[40px]">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowUp size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Voice Waveform Animation */}
      {isListening && (
        <div className="flex justify-center items-center h-12 gap-1 px-8 animate-in fade-in duration-300">
          {[...Array(20)].map((_, i) => ( <div key={i} className="w-1 bg-black rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDuration: `${Math.random() * 0.5 + 0.2}s` }} /> ))}
        </div>
      )}

      {/* Feature Pills */}
      <div className="flex gap-2 px-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth flex-nowrap mask-linear-fade">
        <button onClick={() => setShowScreenshotModal(true)} className="flex-shrink-0 bg-white border border-stone-200 rounded-full px-4 py-2 flex items-center gap-2 hover:border-stone-300 hover:shadow-md transition-all active:scale-95 group whitespace-nowrap">
           <ScreenshotIcon className="w-4 h-4 text-pink-500" /> <span className="text-xs font-semibold text-stone-700 group-hover:text-stone-900">Screenshot to Email</span>
        </button>
        <button onClick={() => setShowFigmaModal(true)} className="flex-shrink-0 bg-white border border-stone-200 rounded-full px-4 py-2 flex items-center gap-2 hover:border-stone-300 hover:shadow-md transition-all active:scale-95 group whitespace-nowrap">
           <FigmaIcon className="w-4 h-4" /> <span className="text-xs font-semibold text-stone-700 group-hover:text-stone-900">Figma to Email</span>
        </button>
        <button onClick={() => setShowYoutubeModal(true)} className="flex-shrink-0 bg-white border border-stone-200 rounded-full px-4 py-2 flex items-center gap-2 hover:border-stone-300 hover:shadow-md transition-all active:scale-95 group whitespace-nowrap">
           <YoutubeIcon className="w-4 h-4" /> <span className="text-xs font-semibold text-stone-700 group-hover:text-stone-900">YouTube to Email</span>
        </button>
        <button onClick={() => setShowPromptBuilder(true)} className="flex-shrink-0 bg-white border border-stone-200 rounded-full px-4 py-2 flex items-center gap-2 hover:border-stone-300 hover:shadow-md transition-all active:scale-95 group whitespace-nowrap">
           <PromptBuilderIcon className="w-4 h-4 text-purple-500" color="currentColor" /> <span className="text-xs font-semibold text-stone-700 group-hover:text-stone-900">Prompt Builder</span>
        </button>
        <button onClick={() => setShowSettings(true)} className="flex-shrink-0 bg-white border border-stone-200 rounded-full px-4 py-2 flex items-center gap-2 hover:border-stone-300 hover:shadow-md transition-all active:scale-95 group whitespace-nowrap">
           <WebsiteIcon className="w-4 h-4 text-blue-500" /> <span className="text-xs font-semibold text-stone-700 group-hover:text-stone-900">Website to Email</span>
        </button>
      </div>

      {/* Modals (Screenshot, Figma, Youtube, Builder) - Keeping implementations same as before */}
      {showScreenshotModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowScreenshotModal(false)} />
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 fade-in duration-300">
             <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-stone-900 font-display">Screenshot to Email</h2><button onClick={() => setShowScreenshotModal(false)} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-stone-900 transition-colors"><X size={20} /></button></div>
             <div className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all duration-200 ${dragActive ? 'border-pink-500 bg-pink-50' : 'border-stone-200 bg-stone-50 hover:border-stone-300'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-pink-500">{isUploading ? <div className="w-6 h-6 border-2 border-stone-200 border-t-pink-500 rounded-full animate-spin" /> : <Upload size={32} />}</div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">Upload your screenshot</h3>
                <p className="text-stone-500 text-sm mb-6 max-w-xs">Drag and drop your image here, or click to browse.</p>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200">Browse Files</button>
             </div>
          </div>
        </div>
      )}

      {showFigmaModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowFigmaModal(false)} />
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 fade-in duration-300">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center border border-stone-100"><FigmaIcon className="w-5 h-5" /></div><h2 className="text-xl font-bold text-stone-900 font-display">Figma to Email</h2></div>
                <button onClick={() => setShowFigmaModal(false)} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-stone-900 transition-colors"><X size={20} /></button>
             </div>
             <p className="text-stone-500 mb-6">Paste your Figma file URL below. We use the Figma API to inspect the frame structure.</p>
             <div className="space-y-4">
               <div>
                  <label className="text-xs font-semibold text-stone-900 uppercase tracking-wide ml-3 mb-2 block">Figma URL</label>
                  <div className="relative"><Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} /><input type="url" placeholder="https://www.figma.com/file/..." className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-11 pr-4 py-4 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-stone-400 transition-all" value={figmaUrl} onChange={(e) => onFigmaUrlChange?.(e.target.value)} /></div>
               </div>
               <button onClick={() => setShowFigmaModal(false)} className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200 mt-4">Save Link</button>
             </div>
          </div>
        </div>
      )}

      {showYoutubeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowYoutubeModal(false)} />
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 fade-in duration-300">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center border border-red-100"><YoutubeIcon className="w-5 h-5" /></div><h2 className="text-xl font-bold text-stone-900 font-display">YouTube to Email</h2></div>
                <button onClick={() => setShowYoutubeModal(false)} className="p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-stone-900 transition-colors"><X size={20} /></button>
             </div>
             <p className="text-stone-500 mb-6">Paste a YouTube video URL below. We'll analyze the content and generate an email campaign.</p>
             <div className="space-y-4">
               <div>
                  <label className="text-xs font-semibold text-stone-900 uppercase tracking-wide ml-3 mb-2 block">YouTube URL</label>
                  <div className="relative"><Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} /><input type="url" placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-11 pr-4 py-4 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-400 transition-all" value={youtubeUrl} onChange={(e) => onYoutubeUrlChange?.(e.target.value)} /></div>
               </div>
               <button onClick={() => setShowYoutubeModal(false)} className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200 mt-4">Save Link</button>
             </div>
          </div>
        </div>
      )}

      {showPromptBuilder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowPromptBuilder(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl min-h-[500px] p-10 animate-in zoom-in-95 fade-in duration-300 flex flex-col items-center justify-between">
            <div className="absolute top-8 left-8"><PromptBuilderIcon className="w-12 h-12" color="#000000" /></div>
            <button onClick={() => setShowPromptBuilder(false)} className="absolute top-8 right-8 p-2 hover:bg-stone-50 rounded-full text-stone-400 hover:text-stone-900 transition-colors"><X size={24} /></button>
            <div className="w-full flex-grow flex flex-col items-center justify-center mt-12 mb-20 text-center">
               {!generatedPrompt && !isBuildingPrompt && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><h2 className="text-3xl font-bold text-stone-900 font-display mb-4">Prompt Builder</h2><p className="text-lg text-stone-500 max-w-md mx-auto">Tell me what you want to create, and I'll architect the perfect engineering prompt for you.</p></div>
               )}
               {isBuildingPrompt && (
                 <div className="w-full max-w-lg space-y-4 animate-in fade-in duration-500"><div className="h-4 bg-stone-100 rounded-full w-3/4 mx-auto animate-pulse"></div><div className="h-4 bg-stone-100 rounded-full w-full mx-auto animate-pulse delay-75"></div><div className="h-4 bg-stone-100 rounded-full w-5/6 mx-auto animate-pulse delay-150"></div><div className="h-4 bg-stone-100 rounded-full w-4/5 mx-auto animate-pulse delay-200"></div></div>
               )}
               {generatedPrompt && !isBuildingPrompt && (
                 <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-500"><div className="text-left bg-white/50 backdrop-blur-sm p-2 rounded-2xl"><p className="text-stone-800 text-lg font-medium leading-relaxed whitespace-pre-wrap">{generatedPrompt}</p></div><div className="flex justify-center gap-6 mt-8"><button onClick={() => { navigator.clipboard.writeText(generatedPrompt) }} className="flex flex-col items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors group"><div className="w-10 h-10 rounded-full bg-stone-50 group-hover:bg-stone-100 flex items-center justify-center"><Copy size={18} /></div><span className="text-xs font-medium">Copy</span></button><button onClick={handleBuildPrompt} className="flex flex-col items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors group"><div className="w-10 h-10 rounded-full bg-stone-50 group-hover:bg-stone-100 flex items-center justify-center"><RefreshCw size={18} /></div><span className="text-xs font-medium">Regenerate</span></button><button onClick={handleUseBuiltPrompt} className="flex flex-col items-center gap-2 text-stone-400 hover:text-blue-600 transition-colors group"><div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 group-hover:bg-blue-100 flex items-center justify-center"><Check size={18} /></div><span className="text-xs font-medium">Use Prompt</span></button></div></div>
               )}
            </div>
            <div className="absolute bottom-10 left-0 right-0 px-10 flex justify-center w-full"><div className="w-full max-w-xl relative bg-white shadow-xl shadow-stone-200/50 rounded-full border border-stone-100 p-2 pl-6 flex items-center transition-all focus-within:ring-2 focus-within:ring-stone-100 focus-within:border-stone-300"><input type="text" value={builderInput} onChange={(e) => setBuilderInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleBuildPrompt()} placeholder="e.g. A follow up email to a client..." className="flex-grow bg-transparent border-none outline-none text-stone-800 placeholder-stone-400" /><button onClick={handleBuildPrompt} disabled={!builderInput.trim() || isBuildingPrompt} className="bg-black text-white rounded-full px-6 py-3 hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-black/20"><span className="font-medium text-sm">Generate</span><ArrowRight size={16} /></button></div></div>
          </div>
        </div>
      )}

    </div>
  );
};
